import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), "data", "site-config.json");

export async function GET() {
  try {
    const fileContent = fs.readFileSync(CONFIG_PATH, "utf-8");
    const config = JSON.parse(fileContent);
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read config", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(CONFIG_PATH, JSON.stringify(body, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to write config", details: String(error) },
      { status: 500 }
    );
  }
}
