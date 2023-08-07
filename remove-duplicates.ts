import { readFile } from "fs/promises";

async function main() {
  const users: {
    userId: string;
    displayName: string;
    pictureUrl: string;
    language: string;
    nickname?: string;
    chatId: string;
    chatUrl: string;
  }[] = JSON.parse(await readFile("data-last-emoji.json", "utf-8"));

  const nicknames = users.map((user) => user.nickname);
  const result = users.filter((user, i) => {
    if (!user.nickname) {
      return true;
    }

    if (nicknames.indexOf(user.nickname) === i) {
      return true;
    } else {
      console.log(nicknames.indexOf(user.nickname), i);
      console.log(user.nickname);
      return false;
    }
  });

  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => console.error(err));
