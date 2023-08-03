import fetch from "node-fetch";

type ResponseBody = {
  userIds: string[];
  next?: string;
};

async function main() {
  const endpoint = "https://api.line.me/v2/bot/followers/ids";
  let responseBody: ResponseBody | null = null;

  for (;;) {
    const searchParams = new URLSearchParams({
      limit: "1000",
    });

    if (responseBody?.next) {
      searchParams.set("start", responseBody.next);
    }

    const response = await fetch(endpoint + "?" + searchParams.toString(), {
      headers: {
        Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
      },
    });

    if (response.status !== 200) {
      console.error(await response.text());
      return;
    }

    responseBody = (await response.json()) as ResponseBody;

    for (const userId of responseBody.userIds) {
      console.log(userId);
    }

    if (!responseBody.next) {
      break;
    }
  }
}

main().catch((err) => console.error(err));
