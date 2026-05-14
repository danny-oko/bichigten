import { NextRequest, NextResponse } from "next/server";

import { CACHE_REVALIDATE_SECONDS } from "@/lib/server/cache";

export const POST = async (req: NextRequest) => {
  const data = await req.formData();
  const file = data.get("audio") as File;
  const audioBuffer = await file.arrayBuffer();

  const response = await fetch("https://api.chimege.com/v1.2/transcribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      Punctuate: "true",
      Token: "86d6ceb9ca4d406247fbb4f14d5c2b443e27d8686ab8a776583ab83867e928ad",
    },
    body: audioBuffer,
    next: { revalidate: CACHE_REVALIDATE_SECONDS },
  });
  const audioToText = await response.text();
  console.log(audioToText);

  return NextResponse.json({
    data: audioToText,
  });
};
