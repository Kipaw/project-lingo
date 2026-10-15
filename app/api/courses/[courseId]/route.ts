import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { courses } from "@/db/schema";
import { isAdmin } from "@/lib/admin";

type Context = {
  params: Promise<{ courseId: string }>;
};

export const GET = async (req: Request, { params }: Context) => {
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { courseId } = await params;

  const data = await db.query.courses.findFirst({
    where: eq(courses.id, Number(courseId)),
  });

  return NextResponse.json(data);
};

export const PUT = async (req: Request, { params }: Context) => {
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { courseId } = await params;
  const body = await req.json();

  const data = await db
    .update(courses)
    .set({
      ...body,
    })
    .where(eq(courses.id, Number(courseId)))
    .returning();

  return NextResponse.json(data[0]);
};

export const DELETE = async (req: Request, { params }: Context) => {
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { courseId } = await params;

  const data = await db
    .delete(courses)
    .where(eq(courses.id, Number(courseId)))
    .returning();

  return NextResponse.json(data[0]);
};
