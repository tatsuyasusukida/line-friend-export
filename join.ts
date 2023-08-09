import { readFile, writeFile } from "fs/promises";

async function main() {
  const users = (await readFile("data-export-dup.tsv", "utf8"))
    .split("\n")
    .filter((line) => line !== "")
    .slice(1)
    .map((line) => {
      const [lineId, nickname, name, chatUrl] = line.split("\t");
      return { lineId, nickname, name, chatUrl };
    });

  const customers = (await readFile("data-customers.tsv", "utf8"))
    .split("\n")
    .filter((line) => line !== "")
    .slice(1)
    .map((line) => {
      const [number, name, deliveryStaff, tel, mobile] = line.split("\t");
      return { number, name, deliveryStaff, tel, mobile };
    });

  const lineUserIdMap = new Map(
    users.map((user) => {
      const key = user.nickname.replace(/\s/g, "");
      const value = user.lineId;
      return [key, value];
    })
  );

  const lines: string[] = [];

  lines.push(
    ["番号", "顧客名", "LINE ID", "配達スタッフ", "固定電話", "携帯電話"].join(
      "\t"
    )
  );

  let count: number = 0;

  for (const customer of customers) {
    const key = customer.name.replace(/\s/g, "");
    const lineId = lineUserIdMap.get(key) || "";

    if (lineId !== "") {
      count += 1;
    }

    lines.push(
      [
        customer.number,
        customer.name,
        lineId,
        customer.deliveryStaff,
        customer.tel,
        customer.mobile,
      ].join("\t")
    );
  }

  console.log(count);

  writeFile("data-export.tsv", lines.join("\n"));
}

main().catch((err) => console.error(err));
