import { NextRequest, NextResponse } from "next/server";

import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";

export async function POST(req: NextRequest) {
  try {
    const { text, type } = await req.json();

    if (!text || !type) {
      return NextResponse.json(
        { error: "text болон type шаардлагатай" },
        { status: 400 },
      );
    }

    const response = await fetch("https://api.chimege.com/v1.2/kimo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Token:
          "39598bf8769bd7c1a043dca78a8dd2049d69964864917a21926f0c664748ca10",
        Type: type,
      },
      body: JSON.stringify({
        Text: text,
      }),
      next: { revalidate: CACHE_REVALIDATE_SECONDS },
    });

    const result = await response.text();

    return NextResponse.json({ result });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error: "Kimo API error" }, { status: 500 });
  }
}
