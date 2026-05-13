import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const READING_DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;

const calculateWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(Boolean).length;
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const {
      title,
      cyrillicText,
      traditionalText,
      description,
      difficulty,
      requiredAccuracy,
    } = body;

    if (!title || !cyrillicText || !traditionalText) {
      return NextResponse.json(
        { message: "title, cyrillicText, and traditionalText are required" },
        { status: 400 },
      );
    }

    // Use singular 'speechTarget' to match your 'model SpeechTarget'
    const target = await prisma.speechTarget.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        cyrillicText: cyrillicText.trim(),
        traditionalText: traditionalText.trim(),
        wordsCount: calculateWords(cyrillicText),
        requiredAccuracy: requiredAccuracy ? Number(requiredAccuracy) : null,
        difficulty: READING_DIFFICULTIES.includes(difficulty)
          ? difficulty
          : "EASY",
      },
    });

    return NextResponse.json(target, { status: 201 });
  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { message: "Failed to create target", detail: error.message },
      { status: 500 },
    );
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ message: "id is required" }, { status: 400 });
    }

    const updateData: any = {};

    if (updates.title) updateData.title = updates.title.trim();
    if (updates.description !== undefined)
      updateData.description = updates.description;
    if (updates.traditionalText)
      updateData.traditionalText = updates.traditionalText.trim();
    if (updates.requiredAccuracy !== undefined)
      updateData.requiredAccuracy = Number(updates.requiredAccuracy);

    if (
      updates.difficulty &&
      READING_DIFFICULTIES.includes(updates.difficulty)
    ) {
      updateData.difficulty = updates.difficulty;
    }

    if (updates.cyrillicText) {
      updateData.cyrillicText = updates.cyrillicText.trim();
      updateData.wordsCount = calculateWords(updates.cyrillicText);
    }

    const target = await prisma.speechTarget.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(target);
  } catch (error: any) {
    console.error("PUT Error:", error);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
};

// ... GET and DELETE remain the same, ensuring you use prisma.speechTarget
