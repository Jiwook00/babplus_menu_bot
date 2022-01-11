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

const crawling = async () => {
  let manuImageUrl = "";
  const url =
    "https://blog.naver.com/PostView.naver?blogId=babplus123&logNo=222378669083&redirect=Dlog&widgetTypeCall=true&directAccess=false";
  await request(url, (err, res, body) => {
    if (err) {
      return;
    }
    const $ = cheerio.load(body);
    const colArr = $(".post-view");
    manuImageUrl = colArr[0].children[3].children[0].attribs["data-lazy-src"];
  });
  return manuImageUrl;
};

const postMenu = async () => {
  const emoji = randomEmoji();
  const manuImageUrl = await crawling();

  slack.webhook(
    {
      text: `${emoji} 오늘 밥플러스 메뉴`,
      attachments: [
        {
          blocks: [
            {
              type: "image",
              image_url: manuImageUrl,
              alt_text: "inspiration",
            },
          ],
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
