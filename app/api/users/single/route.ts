import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/prisma/client";

export async function GET() {
    const session = await getServerSession(authOptions);

    // Check if a valid session exists
    if (!session) {
        return NextResponse.json(
            { error: "You are not authorized" },
            { status: 401 }
        );
    }

    // Get the user's ID
    const { id } = session.user;

    // Check if the user's ID exists
    if (!id) {
        return NextResponse.json(
            { error: "You are not authorized" },
            { status: 401 }
        );
    }

    try {
        const users = await prisma.user.findUnique({
            where: { id },
            include: {
                location: true,
                businesses: true,
            },
        });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.error();
    }
}