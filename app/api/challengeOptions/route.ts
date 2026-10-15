import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { isAdmin } from "@/lib/admin";
import { challengeOptions } from "@/db/schema";

export const GET = async () => {
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db.query.challengeOptions.findMany();

  return NextResponse.json(data, {
    headers: {
      "Content-Range": `challengeOptions 0-${data.length}/${data.length}`,
      "Access-Control-Expose-Headers": "Content-Range",
    },
  });
};

export const POST = async (req: Request) => {
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  const data = await db
    .insert(challengeOptions)
    .values({
      ...body,
    })
    .returning();

  return NextResponse.json(data[0]);
};
