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
        const data = await request.json()
        const { courseId } = params

        console.log(courseId)

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // const alreadyExists = await db.tutor.findFirst({
        //     where: {
        //         courseId: courseId,
        //         name: data.name,
        //     }
        // })

        // console.log("tutor exists: ", alreadyExists)

        // if(alreadyExists) {
        //     return new NextResponse("Tutor already exists!", { status: 502 })
        // }

        console.log("TUTOR REQUEST: ", data)
        const tutor = await db.tutor.create({
            data: {
                name: data.name,
                image: data.image,
                userId: data.userId,
                courseId: courseId
            }
        })

        console.log("TUTOR: ", tutor)
        return Response.json(tutor)
    } catch (error) {
        console.log("TUTOR ERROR: ", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
