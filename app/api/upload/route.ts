import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // We need to export authOptions from there
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        console.log("Upload API called");

        const session = await getServerSession(authOptions);
        console.log("Session:", session);

        if (!session || !session.user?.email) {
            console.log("Unauthorized: No session");
            return NextResponse.json({ error: "Unauthorized - Please log in" }, { status: 401 });
        }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const duration = parseFloat(formData.get("duration") as string) || 0;

    console.log("File received:", file?.name, file?.type, file?.size);
    console.log("Title:", title);

    if (!file) {
        console.log("No file in request");
        return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const filename = `${Date.now()}_${file.name.replaceAll(" ", "_")}`;
    console.log("Uploading to Supabase as:", filename);

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
            return NextResponse.json({ error: `Upload to Supabase failed: ${uploadError.message}` }, { status: 500 });
        }

        console.log("Supabase upload successful:", uploadData);

        // Get public URL
        const { data: { publicUrl } } = supabase
            .storage
            .from('uploads')
            .getPublicUrl(filename);

        console.log("Public URL:", publicUrl);

        // Use static user ID for static auth, or find/create user
        let userId = "1"; // Default static user ID

        try {
            console.log("Looking up user:", session.user.email);
            const user = await prisma.user.findUnique({
                where: { email: session.user.email }
            });

            if (user) {
                console.log("User found:", user.id);
                userId = user.id;
            } else {
                console.log("User not found, creating new user");
                // Create user if doesn't exist
                const newUser = await prisma.user.create({
                    data: {
                        email: session.user.email,
                        name: session.user.name || "User",
                        password: "static", // placeholder since we're using static auth
                    }
                });
                console.log("User created:", newUser.id);
                userId = newUser.id;
            }
        } catch (dbError) {
            console.error("Database error:", dbError);
            // Continue with static user ID if database fails
        }

        console.log("Creating song record with userId:", userId);
        const song = await prisma.song.create({
            data: {
                title: title || file.name,
                url: publicUrl,
                duration: duration,
                userId: userId
            }
        });

        console.log("Song created successfully:", song.id);
        return NextResponse.json({ Message: "Success", status: 201, song });
    } catch (innerError) {
        console.log("Inner error occurred:", innerError);
        return NextResponse.json({ Message: "Failed", status: 500, error: String(innerError) });
    }
    } catch (outerError) {
        console.log("Outer error occurred:", outerError);
        return NextResponse.json({ Message: "Failed", status: 500, error: String(outerError) }, { status: 500 });
    }
}
