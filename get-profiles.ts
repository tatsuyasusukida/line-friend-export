import { readFile } from "fs/promises";
import fetch from "node-fetch";

type ResponseBody = {
  displayName: string;
  userId: string;
  language?: string;
  pictureUrl?: string;
  statusMessage?: string;
};

async function main() {
  const lines = (await readFile("data-user-ids.txt", "utf-8"))
    .split("\n")
    .filter((line) => line !== "");

  const responseBodies = [] as any[];

  for (const line of lines) {
    const endpoint = `https://api.line.me/v2/bot/profile/${line}`;
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
      },
    });

    if (response.status !== 200) {
      console.error(await response.text());
      continue;
    }

    responseBodies.push(await response.json());
  }

  console.log(JSON.stringify(responseBodies, null, 2));
}

main().catch((err) => console.error(err));
