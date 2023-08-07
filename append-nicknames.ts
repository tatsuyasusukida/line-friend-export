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

  type Profile = {
    userId: string;
    displayName: string;
    pictureUrl?: string;
  };

  type Candidate = {
    chatId: string;
    nickname: string;
    icon: string;
  };

  const profiles: Profile[] = JSON.parse(
    await readFile("data-profiles.json", "utf-8")
  );

  const newProfiles: (
    | Profile
    | { nickname?: string; chatId?: string; candidates?: Candidate[] }
  )[] = [];

  for (const profile of profiles) {
    const chatsWithSameName = chats.filter((chat) => {
      return chat.name === profile.displayName;
    });

    if (chatsWithSameName.length === 0) {
      newProfiles.push(profile);
      continue;
    }

    const candidates = chatsWithSameName.map((chat) => ({
      chatId: chat.chatId,
      nickname: chat.nickname,
      icon: chat.icon,
    }));

    newProfiles.push(
      await (async () => {
        if (profile.pictureUrl) {
          const pictureDigest = await getImageHash(profile.pictureUrl);

          for (const candidate of candidates) {
            if (candidate.icon !== "") {
              const iconDigest = await getImageHash(candidate.icon);

              if (pictureDigest === iconDigest) {
                return {
                  ...profile,
                  nickname: chatsWithSameName[0].nickname,
                  chatId: chatsWithSameName[0].chatId,
                };
              }
            }
          }
        }

        return {
          ...profile,
          candidates,
        };
      })()
    );
  }

  console.log(JSON.stringify(newProfiles, null, 2));
}

async function getImageHash(url: string): Promise<string> {
  const arrayBuffer = await fetch(url).then((res) => res.arrayBuffer());
  const buffer = Buffer.from(arrayBuffer);
  return createHash("sha-256").update(buffer).digest("hex");
}

main().catch((err) => console.error(err));
