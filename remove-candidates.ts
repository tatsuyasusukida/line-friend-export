import { readFile } from "fs/promises";

async function main() {
  const users: {
    chatId?: string;
    candidates?: {
      chatId: string;
    }[];
  }[] = JSON.parse(await readFile("data-append.json", "utf-8"));
  const chatIds = users
    .filter((user) => user.chatId)
    .map((user) => user.chatId) as string[];
  const chatIdsSet = new Set(chatIds);
  const newUsers = users.map((user) => {
    if (!user.candidates) {
      return {
        ...user,
        chatUrl: getChatUrl(user.chatId),
      };
    }

    return {
      ...user,
      candidates: user.candidates
        .filter((candidate) => {
          return chatIdsSet.has(candidate.chatId);
        })
        .map((candidate) => {
          return {
            ...candidate,
            chatUrl: getChatUrl(candidate.chatId),
          };
        }),
    };
  });

  console.log(JSON.stringify(newUsers, null, 2));
}

function getChatUrl(chatId?: string): string {
  return chatId
    ? `https://chat.line.biz/${process.env.LINE_CHANNEL_USER_ID}/chat/${chatId}`
    : "";
}

main().catch((err) => console.error(err));
