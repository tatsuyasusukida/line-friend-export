import { createHash } from "crypto";
import { readFile } from "fs/promises";
import fetch from "node-fetch";

async function main() {
  const chats: {
    chatId: string;
    name: string;
    nickname: string;
    icon: string;
    isDuplicated: boolean;
  }[] = JSON.parse(await readFile("data-nicknames.json", "utf-8"));

  const profiles: {
    userId: string;
    displayName: string;
    pictureUrl?: string;
  }[] = JSON.parse(await readFile("data-profiles.json", "utf-8"));

  // const mappings = (await readFile("mappings.txt", "utf-8"))
  //   .split("\n")
  //   .filter((line) => line !== "")
  //   .map((line) => {
  //     const [userId, chatId] = line.split(" ");
  //     return { userId, chatId };
  //   });

  const newProfiles = await Promise.all(
    profiles.map(async (profile) => {
      const filteredChats = chats.filter((chat) => {
        return chat.name === profile.displayName;
      });

      if (filteredChats.length === 0) {
        return profile;
      } else if (filteredChats.length === 1) {
        return {
          ...profile,
          nickname: filteredChats[0].nickname,
          chatId: filteredChats[0].chatId,
        };
      } else {
        const candidates = filteredChats.map((chat) => ({
          chatId: chat.chatId,
          nickname: chat.nickname,
          icon: chat.icon,
        }));

        if (profile.pictureUrl) {
          const pictureDigest = await getImageHash(profile.pictureUrl);

          for (const candidate of candidates) {
            if (candidate.icon !== "") {
              const iconDigest = await getImageHash(candidate.icon);

              if (pictureDigest === iconDigest) {
                return {
                  ...profile,
                  nickname: filteredChats[0].nickname,
                  chatId: filteredChats[0].chatId,
                };
              }
            }
          }
        }

        return {
          ...profile,
          candidates,
        };

        // const filteredMappings = mappings.filter((mapping) => {
        //   return mapping.userId === profile.userId;
        // });

        // if (filteredMappings.length === 0) {
        // } else if (filteredMappings.length === 1) {
        //   const chat = filteredChats.find(
        //     (chat) => chat.chatId === filteredMappings[0].chatId
        //   );

        //   if (!chat) {
        //     throw new Error("!chat");
        //   }

        //   return {
        //     ...profile,
        //     nickname: chat.nickname,
        //   };
        // } else {
        //   throw new Error("filteredMappings.length >= 2");
        // }
      }
    })
  );

  console.log(JSON.stringify(newProfiles, null, 2));
}

async function getImageHash(url: string): Promise<string> {
  const arrayBuffer = await fetch(url).then((res) => res.arrayBuffer());
  const buffer = Buffer.from(arrayBuffer);
  return createHash("sha-256").update(buffer).digest("hex");
}

main().catch((err) => console.error(err));
