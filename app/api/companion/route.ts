import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try{
        const body = await req.json();
        const user = await currentUser();
        const { src, name, description, instructions, seed, } = body;
        

        if (!user || !user.id || !user.firstName) {
            return new NextResponse("Unauthorized", { status: 401});
        };

        if (!src || !name || !description || !instructions || !seed) {
            return new NextResponse("Missing required Fields", { status: 400 });
        };

        const companion = await prismadb.companion.create({
            data: {
              userId: user.id,
              userName: user.firstName,
              src,
              name,
              description,
              instructions,
              seed,
            }
          });

        return NextResponse.json(companion);
    }
    catch (error) {
        console.log("[Companion_POST] error")
        return new NextResponse("Internal Error", { status: 500 });
    }
}