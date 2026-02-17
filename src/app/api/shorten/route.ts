import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { nanoid } from "nanoid";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
       try {
              const body = await req.json();
              const { original_url, custom_alias } = body;

              if (!original_url) {
                     return NextResponse.json(
                            { error: "Missing original_url" },
                            { status: 400 }
                     );
              }

              // Validate URL format
              try {
                     new URL(original_url);
              } catch (e) {
                     return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
              }

              let code = custom_alias;

              // If custom alias provided, use it
              if (code) {
                     // Check if alias exists
                     const { data: existing } = await supabase
                            .from("urls")
                            .select("id")
                            .eq("short_code", code)
                            .single();

                     if (existing) {
                            return NextResponse.json(
                                   { error: "Custom alias already taken" },
                                   { status: 409 }
                            );
                     }
              } else {
                     // Generate unique code
                     // Try up to 3 times to find a unique code
                     let isUnique = false;
                     let attempts = 0;

                     while (!isUnique && attempts < 3) {
                            attempts++;
                            code = nanoid(7); // 7 chars is usually plenty safe
                            const { data: existing } = await supabase
                                   .from("urls")
                                   .select("id")
                                   .eq("short_code", code)
                                   .single();

                            if (!existing) {
                                   isUnique = true;
                            }
                     }

                     if (!isUnique) {
                            return NextResponse.json(
                                   { error: "Failed to generate unique code. Please try again." },
                                   { status: 500 }
                            );
                     }
              }

              // Insert into DB
              const { data, error } = await supabase
                     .from("urls")
                     .insert([
                            {
                                   original_url,
                                   short_code: code
                            }
                     ])
                     .select()
                     .single();

              if (error) {
                     console.error("Supabase insert error:", error);
                     return NextResponse.json({ error: error.message }, { status: 500 });
              }

              return NextResponse.json({
                     short_code: data.short_code,
                     message: "URL shortened successfully"
              }, { status: 201 });

       } catch (error) {
              console.error("Internal API error:", error);
              return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
       }
}
