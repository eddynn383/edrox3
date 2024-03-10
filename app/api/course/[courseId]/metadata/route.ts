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

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const alreadyExists = await db.metadata.findFirst({
            where: {
                courseId: courseId,
                key: data.key
            }
        })

        console.log("metadata exists: ", alreadyExists)

        if(alreadyExists) {
            return new NextResponse("Metadata already exists!", { status: 502 })
        }

        console.log({ data })
        const metadata = await db.metadata.create({
            data: {
                key: data.key,
                value: data.value,
                type: data.type,
                courseId: courseId
            }
        })

        console.log(metadata)
        return Response.json(metadata)
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}