import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(
       request: NextRequest,
       { params }: { params: { code: string } }
) {
       const code = params.code;

       if (!code) {
              return NextResponse.json({ error: "Code required" }, { status: 400 });
       }

       // Fetch URL
       const { data: urlData, error } = await supabase
              .from("urls")
              .select("original_url, click_count")
              .eq("short_code", code)
              .single();

       if (error || !urlData) {
              return NextResponse.json({ error: "Short URL not found" }, { status: 404 });
       }

       // Increment click count
       // We use rpc if available, or best-effort update
       const { error: rpcError } = await supabase.rpc('increment_click_count', { code });

       if (rpcError) {
              // Fallback: This is not atomic but works for MVP if RPC missing
              // We don't await this to keep redirect fast, but Vercel might kill it.
              // Best to await.
              await supabase
                     .from('urls')
                     .update({ click_count: (urlData.click_count || 0) + 1 })
                     .eq('short_code', code);
       }

       return NextResponse.redirect(urlData.original_url, { status: 301 });
}
