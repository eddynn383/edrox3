import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(request: Request) {
    try {
        const res = await request.json()
        console.log({ res })
        const category = await prisma.category.create({
            data: {
                name: res.name
            },
        })

        return Response.json(category)
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function GET() {
    try {
        const category = await prisma.category.findMany({
            cacheStrategy: { ttl: 60 }
        })
        .withAccelerateInfo()

        return Response.json(category)
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify(error), { status: 500 })
    }
}