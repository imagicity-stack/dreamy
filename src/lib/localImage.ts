import fs from "fs";
import path from "path";

/**
 * Finds a picture that somebody dropped into the repo by hand.
 *
 * The content panel can already hold an uploaded image per record, but that
 * needs Firebase Storage and somebody logged in. For a handful of fixed cards —
 * the cosplay categories, say — it is far less ceremony to commit a file next
 * to the code and have the page pick it up. So: name the file after the thing
 * it illustrates, put it in public/assets/<folder>, and it appears.
 *
 * Any of the four sensible web formats will do, checked in the order a
 * photograph is most likely to be in. Nothing found means the caller draws its
 * own placeholder rather than shipping a broken <img> to a visitor.
 */
const EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

/** ANIME & MANGA -> anime-manga. The name a file should be given. */
export function imageSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function localImage(folder: string, name: string): string | null {
  const slug = imageSlug(name);
  if (!slug) return null;

  for (const ext of EXTENSIONS) {
    const rel = `assets/${folder}/${slug}.${ext}`;
    if (fs.existsSync(path.join(process.cwd(), "public", rel))) return `/${rel}`;
  }
  return null;
}

/** What to call the file that is missing, for a placeholder to name. */
export function expectedImageName(folder: string, name: string): string {
  return `public/assets/${folder}/${imageSlug(name)}.jpg`;
}
