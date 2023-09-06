import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "../../../prisma/client";
import { buildQueryObject, calcualteAverage } from "@/utils";

const getReviews = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const query = buildQueryObject(searchParams);

    const reviews = await prisma.review.findMany(query);

    return NextResponse.json(reviews);
};

const createReviews = async (req: NextRequest) => {
    const data = await req.json();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/api/auth/signin");
    }

    if (session?.user?.id == data.proId) {
        NextResponse.json("Sorry you can not write a review for yourself!", {
            status: 403,
        });
        return;
    }

    data.userId = session?.user.id;
    const newData = {
        userId: data.userId,
        serviceProfileId: data.serviceId,
        comment: data.comment,
        rating: data.rating,
    };

    const reviews = await prisma.review.create({
        data: newData,
    });

    // Update servicePorfile avarage rating
    const serviceReviews = await prisma.review.findMany({
        where: {
            id: data.serviceId,
        },
        select: { rating: true },
    });

    const totalRating = serviceReviews.length;
    const sumRatings = serviceReviews.reduce(
        (sum, review) => sum + (review.rating || 0),
        0
    );
    const averageRating = calcualteAverage(totalRating, sumRatings);

    await prisma.serviceProfile.update({
        where: { id: data.serviceId },
        data: { rating: averageRating },
    });

    return NextResponse.json(reviews, { status: 201 });
};

export { getReviews as GET, createReviews as POST };
