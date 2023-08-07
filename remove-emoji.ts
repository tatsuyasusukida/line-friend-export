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
  }[] = JSON.parse(await readFile("data-last.json", "utf-8"));

  const result = users.map((user) => {
    if (!user.nickname) {
      return user;
    }

    const nickname = user.nickname
      .replace(
        /((💛)|(🎅)|(🎄)|(セ🎍)|(🍎)|(＠)|(@)|(💖)|(🎄)|(🍓)|(セ💛L)|(L1)|(L2)|(L🎄)|(M1)|(Ｍ1)|(M2)|(Ｍ2)|(ｍ見)|(hク)|(ｈく)|(h見)|(h2)|(h正)|(🌼)|(セL)|(セＭ1)|(！)|(豊橋)|(豊川)|(正🎍)|(ク💛M)|(正月)|(正ク)|(正ク🎍🎍🎅)|(L　連)|(ポ！)|(ポL2)|(ポ💖)|(ポク)|(ポ🍎)|(クく)|(※くく)|(ク正)|(ミ見)).*$/,
        ""
      )
      .replace(/((　連)|(h)|(h)|(ポ)|(セ)|(ク)|(M))$/, "")
      .replace(/((🎍)|(️)|(※))/g, "")
      .replace("洋子く", "洋子")
      .replace("弥寿子ク", "弥寿子")
      .replace("啓子ク正", "啓子")
      .replace("晴世ｈ", "晴世")
      .replace("美佳く", "美佳")
      .trim();

    return {
      ...user,
      nickname,
    };
  });

  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => console.error(err));
