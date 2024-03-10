import { auth } from "@/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

type paramsType = {
    params: {
        courseId: string
    }
}

export async function GET(request: Request, { params }: paramsType) {
    try {
        const chapter = await db.chapter.findMany({
            where: {
                courseId: params.courseId
            }
        })

        return Response.json(chapter)
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function POST(request: Request, { params }: paramsType) {
    try {
        const session = await auth()
        const data = await request.json()
        const { courseId } = params

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                createdById: session.user.id,
            }
        })

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId: params.courseId,
            },
            orderBy: {
                position: "desc",
            },
        });

        const newPosition = lastChapter ? lastChapter.position + 1 : 1;

        console.log({ data })
        const chapter = await db.chapter.create({
            data: {
                title: data.title,
                description: data.description,
                videoUrl: data.videoUrl,
                position: newPosition,
                isPublished: data.isPublished,
                isFree: data.isFree,
                courseId: courseId
            }
        })

        console.log(chapter)
        return Response.json(chapter)
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}