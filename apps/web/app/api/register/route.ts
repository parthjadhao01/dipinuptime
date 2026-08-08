import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import { prisma } from "@repo/db";

export async function POST(req: Request) {
  const session = await getServerSession(NEXT_AUTH_CONFIG);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();

  if (!name) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      isRegistered: true,
    },
  });

  return NextResponse.json({ success: true });
}
