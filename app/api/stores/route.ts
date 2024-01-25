import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { StoreValidator } from "@/lib/validators/store";
import db from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name } = StoreValidator.parse(body);

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const isExist = await db.store.findFirst({
      where: {
        name,
        userId,
      }
    })

    if(isExist) {
      return new NextResponse("Name is already taken", { status: 409 });
    }

    const store = await db.store.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(store);
    
  } catch (error) {
    console.log("[STORES_POST]", error);

    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 });
    }

    return new NextResponse("Internal error", { status: 500 });
  }
}
