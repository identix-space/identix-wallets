import { readdir, readFile } from "fs";
import { promisify } from "util";
import { resolve } from "path";

const readdirAsync = promisify(readdir);

export async function getDirectoryFilesList(path: string): Promise<string[]> {
  const filepath = resolve(process.cwd(), `./${path}`);
  return await readdirAsync(filepath);
}

export async function readFileAsBase64(absFilePath: string): Promise<string> {
  return await new Promise((resolve, reject) => {
    readFile(absFilePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString('base64'));
      }
    });
  });
}

