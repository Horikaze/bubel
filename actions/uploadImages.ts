"use server";

import fs from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { log } from "console";

export async function uploadImagesAction(formData: FormData) {
  const files = formData.getAll("images") as File[];

  if (!files || files.length === 0) {
    throw new Error("Brak przesłanych plików");
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");

  // Upewnij się, że folder istnieje
  await fs.mkdir(uploadDir, { recursive: true });

  const urls: string[] = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // unikalna nazwa pliku
    const ext = path.extname(file.name) || ".png";
    const base = path.basename(file.name, ext);
    const randomSuffix = randomBytes(4).toString("hex");
    const fileName = `${base}-${randomSuffix}${ext}`;

    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    // URL względem public/
    urls.push(`/uploads/${fileName}`);
  }
  console.log(urls);
  return urls;
}
