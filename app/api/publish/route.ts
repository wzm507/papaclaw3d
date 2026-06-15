import { NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), "data", "site-config.json");

export async function POST() {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      return NextResponse.json(
        { error: "Config file not found" },
        { status: 404 }
      );
    }

    exec("next build", { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        console.error("Build failed:", error);
        return;
      }
      console.log("Build stdout:", stdout);
      if (stderr) {
        console.error("Build stderr:", stderr);
      }
    });

    return NextResponse.json({
      success: true,
      message: "Build triggered successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to trigger build", details: String(error) },
      { status: 500 }
    );
  }
}
