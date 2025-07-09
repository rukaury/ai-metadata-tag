import { NextResponse } from "next/server";
import { runLabelDetectionAndGetResults } from "../../../backend/RunLabelDetectionPlaceholder.js";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const results = await runLabelDetectionAndGetResults();
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error in label detection API route:", error);
    return NextResponse.json(
      { error: "Failed to run label detection." },
      { status: 500 }
    );
  }
} 