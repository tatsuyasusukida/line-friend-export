import { readFile } from "fs/promises";

async function main() {
  const users: any[] = JSON.parse(
    await readFile("data-last-dup.json", "utf-8")
  );

  const headerCells = [
    "LINE ID",
    "お名前",
    "お客さまが設定したお名前",
    "チャットページのURL",
    // "【候補】お客さまが設定したお名前",
    // "【候補】チャットページのURL",
  ];

  console.log(headerCells.join("\t"));

  for (const user of users) {
    const { userId, displayName, nickname, chatUrl } = user;
    const cells = [userId, nickname, displayName, chatUrl];

    if (!nickname) {
      continue;
    }

    if (user.candidates) {
      for (const candidate of user.candidates) {
        cells.push(candidate.nickname);
        cells.push(candidate.chatUrl);
      }
    }

    console.log(cells.join("\t"));
  }
}

main().catch((err) => console.error(err));
