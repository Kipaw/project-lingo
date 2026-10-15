import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { lessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";

type Context = {
  params: Promise<{ lessonId: string }>;
};

export const GET = async (req: Request, { params }: Context) => {
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { lessonId } = await params;

  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, Number(lessonId)),
  });

  return NextResponse.json(data);
};

export const PUT = async (req: Request, { params }: Context) => {
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { lessonId } = await params;
  const body = await req.json();

  const data = await db
    .update(lessons)
    .set({
      ...body,
    })
    .where(eq(lessons.id, Number(lessonId)))
    .returning();

  return NextResponse.json(data[0]);
};

export const DELETE = async (req: Request, { params }: Context) => {
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { lessonId } = await params;

  const data = await db
    .delete(lessons)
    .where(eq(lessons.id, Number(lessonId)))
    .returning();

  return NextResponse.json(data[0]);
};
