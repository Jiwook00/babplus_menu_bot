require("dotenv").config();
const request = require("request-promise-native");
const cheerio = require("cheerio");
const webhookUri = process.env.WEBHOOK_URI;

const Slack = require("slack-node");
const slack = new Slack();
slack.setWebhook(webhookUri);

const emojis = [
  `🍚`,
  `🥘`,
  `🥩`,
  `🍜`,
  `🍙`,
  `🥗`,
  `🍗`,
  `🤩`,
  `🤔`,
  `😋`,
  `😉`,
  `👨🏻‍🍳`,
  `👩🏼‍🍳`,
  `🧑🏾‍🍳`,
  `👨🏻‍🌾`,
  `🍽`,
];

const getRandom = (length) => Math.floor(Math.random() * length);

const randomEmoji = () => {
  const number = getRandom(emojis.length);
  return emojis[number];
};

const getThumbnail = () => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const index = getRandom(numbers.length);
  return `${process.env.S3_URI}/ghibli_${numbers[index]}.gif`;
};

const crawling = async () => {
  let result = [];
  const url =
    "https://blog.naver.com/PostView.naver?blogId=babplus123&logNo=222378669083&redirect=Dlog&widgetTypeCall=true&directAccess=false";
  await request(url, (err, res, body) => {
    if (err) {
      return;
    }
    const $ = cheerio.load(body);
    let colArr = $(".post-view");
    const text1 =
      colArr[0].children[4].children[0].children[0].children[0].children[0]
        .children[0].data;
    if (text1) {
      result.push(text1);
    }
    for (let i = 5; i < 12; i++) {
      const text = colArr[0].children[i].children[0].children[0].data;
      if (text) {
        result.push(text);
      }
    }
  });
  return result;
};

const postMenu = async () => {
  const emoji = randomEmoji();
  const menus = await crawling();
  const thumbnailUrl = getThumbnail();
  let menuText = "";
  console.log(":::menus:::", menus);

  for (let i = 0; i < menus.length; i++) {
    if (menus[i]) {
      menuText = menuText + `\n ${menus[i]}`;
    }
  }

  if (menus.length < 8) {
    menuText =
      menuText +
      `\n 메뉴 정보를 모두 가저오지 못했습니다 😣 \n 아래의 인스타그랩 또는 블로그를 확인 해주세요.`;
  }

  slack.webhook(
    {
      text: `${emoji} 오늘 밥플러스 메뉴`,
      attachments: [
        {
          color: "939597",
          fields: [
            {
              title: ``,
              value: `${menuText}`,
            },
          ],
          thumb_url: thumbnailUrl,
        },
        {
          footer:
            "🅽 https://blog.naver.com/babplus123/222378669083 \n 🅸 https://www.instagram.com/babplus_/",
        },
      ],
    },
    function (err, response) {
      if (err) {
        console.log("::err::", err);
      }
    }
  );
};

module.exports = { postMenu };
