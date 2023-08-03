import { readFile } from "fs/promises";

async function main() {
  const text = await readFile("data-chats.json", "utf-8");
  const items = JSON.parse(text) as {
    list: {
      chatId: string;
      profile: {
        name?: string;
        nickname?: string;
        iconHash?: string;
      };
    }[];
  }[];

  const users: {
    chatId: string;
    name: string;
    nickname: string;
    icon: string;
  }[] = [];

  for (const item of items) {
    for (const listItem of item.list) {
      if (!listItem.profile?.name) {
        continue;
      }

      const chatId = listItem.chatId;
      const name = listItem.profile.name;
      const nickname = listItem.profile.nickname ?? "";
      const icon = listItem.profile.iconHash
        ? `https://profile.line-scdn.net/${listItem.profile.iconHash}`
        : "";

      const user = { chatId, name, nickname, icon };

      users.push(user);
    }
  }

  const userNames = users.map((user) => user.name);
  const duplicateNames: string[] = [];

  userNames.forEach((userName, i) => {
    if (userNames.indexOf(userName) !== i) {
      duplicateNames.push(userName);
    }
  });

  const duplicateNamesSet = new Set(duplicateNames);

  console.log(
    JSON.stringify(
      users.map((user) => ({
        ...user,
        isDuplicated: duplicateNamesSet.has(user.name),
      })),
      null,
      2
    )
  );
}

main().catch((err) => console.error(err));
