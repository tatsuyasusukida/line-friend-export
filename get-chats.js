(async function () {
  const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec));
  const endpoint = `https://chat.line.biz/api/v2/bots/${userId}/chats`;
  const responseBodies = [];
  let responseBody = null;

  for (;;) {
    const searchParams = new URLSearchParams({
      folderType: "ALL",
      limit: "25",
    });

    if (responseBody && responseBody.next) {
      searchParams.set("next", responseBody.next);
    }

    const response = await fetch(endpoint + "?" + searchParams.toString());

    if (response.status !== 200) {
      console.error(await response.text());
      return;
    }

    responseBody = await response.json();
    responseBodies.push(responseBody);

    if (!responseBody.next) {
      break;
    }

    // 気休め
    await sleep(200);
  }

  console.log(responseBodies);
})().catch((err) => console.error(err));
