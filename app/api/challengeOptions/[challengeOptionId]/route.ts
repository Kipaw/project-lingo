import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { challengeOptions } from "@/db/schema";
import { isAdmin } from "@/lib/admin";

type Context = {
  params: Promise<{ challengeOptionId: string }>;
};

export const GET = async (req: Request, { params }: Context) => {
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { challengeOptionId } = await params;

  const data = await db.query.challengeOptions.findFirst({
    where: eq(challengeOptions.id, Number(challengeOptionId)),
  });

  return NextResponse.json(data);
};

export const PUT = async (req: Request, { params }: Context) => {
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { challengeOptionId } = await params;
  const body = await req.json();

  const data = await db
    .update(challengeOptions)
    .set({
      ...body,
    })
    .where(eq(challengeOptions.id, Number(challengeOptionId)))
    .returning();

  return NextResponse.json(data[0]);
};

export const DELETE = async (req: Request, { params }: Context) => {
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { challengeOptionId } = await params;

  const data = await db
    .delete(challengeOptions)
    .where(eq(challengeOptions.id, Number(challengeOptionId)))
    .returning();

  return NextResponse.json(data[0]);
};
