import { auth } from "@/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

type paramsType = {
    params: {
        courseId: string
    }
}

export async function POST(request: Request, { params }: paramsType) {
    try {
        const session = await auth()
        const user = session?.user
        const data = await request.json()
        const { courseId } = params

        console.log("USER: ", user)

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const alreadyExists = await db.rating.findFirst({
            where: {
                courseId: courseId,
                userId: session.user.id
            }
        })

        console.log("metadata exists: ", alreadyExists)

        if (alreadyExists) {
            return new NextResponse("Review already exists!", { status: 502 })
        }

        console.log("dataBeforeSave: ", data)
        const rating = await db.rating.create({
            data: {
                courseId: courseId,
                userId: user.id as string,
                rating: data.rating,
                title: data.title,
                comment: data.comment
            }
        })

        console.log("SAVED RATING: ", rating)
        return Response.json(rating)
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}