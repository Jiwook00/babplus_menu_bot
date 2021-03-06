require("dotenv").config();
const request = require("request-promise-native");
const cheerio = require("cheerio");
const webhookUri = process.env.WEBHOOK_URI;

const Slack = require("slack-node");
const slack = new Slack();
slack.setWebhook(webhookUri);

const emojis = [
  `ð`,
  `ðĨ`,
  `ðĨĐ`,
  `ð`,
  `ð`,
  `ðĨ`,
  `ð`,
  `ðĪĐ`,
  `ðĪ`,
  `ð`,
  `ð`,
  `ðĻðŧâðģ`,
  `ðĐðžâðģ`,
  `ð§ðūâðģ`,
  `ðĻðŧâðū`,
  `ð―`,
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
      text: `${emoji} ėĪë ë°ĨíëŽėĪ ëĐëī`,
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
            "ð― https://blog.naver.com/babplus123/222378669083 \n ðļ https://www.instagram.com/babplus_/",
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
