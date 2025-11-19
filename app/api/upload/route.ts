import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // We need to export authOptions from there
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const duration = parseFloat(formData.get("duration") as string) || 0;

    if (!file) {
        return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const filename = `${Date.now()}_${file.name.replaceAll(" ", "_")}`;

    try {
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('uploads')
            .upload(filename, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (uploadError) {
            console.error("Supabase upload error:", uploadError);
            return NextResponse.json({ error: uploadError.message || "Upload failed" }, { status: 500 });
        }

        // Get public URL
        const { data: { publicUrl } } = supabase
            .storage
            .from('uploads')
            .getPublicUrl(filename);

        // Use static user ID for static auth, or find/create user
        let userId = "1"; // Default static user ID

        try {
            const user = await prisma.user.findUnique({
                where: { email: session.user.email }
            });

            if (user) {
                userId = user.id;
            } else {
                // Create user if doesn't exist
                const newUser = await prisma.user.create({
                    data: {
                        email: session.user.email,
                        name: session.user.name || "User",
                        password: "static", // placeholder since we're using static auth
                    }
                });
                userId = newUser.id;
            }
        } catch (dbError) {
            console.error("Database error:", dbError);
            // Continue with static user ID if database fails
        }

        const song = await prisma.song.create({
            data: {
                title: title || file.name,
                url: publicUrl,
                duration: duration,
                userId: userId
            }
        })

        return NextResponse.json({ Message: "Success", status: 201, song });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500, error: String(error) });
    }
}
