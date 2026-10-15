import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { isAdmin } from "@/lib/admin";
import { units } from "@/db/schema";

export const GET = async () => {
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db.query.units.findMany();

  return NextResponse.json(data, {
    headers: {
      "Content-Range": `units 0-${data.length}/${data.length}`,
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
    .insert(units)
    .values({
      ...body,
    })
    .returning();

  return NextResponse.json(data[0]);
};
