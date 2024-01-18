const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios").default;

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

app.get("/api/conversation", async (req, res) => {
  try {
    const q = req.query.q;
    var options = {
      method: "POST",
      url: "https://chat.oaifree.com/backend-api/conversation",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "insomnia/8.5.1",
        "X-Authorization": "Bearer lJ1es8rPG_YetKk77G17O0vlDUPfGAXFn__HckAD0tM",
        Cookie:
          "_Secure-next-auth.apps-origin=https://chat.oaifree.com; google-analytics_v4_PnTc__ga4sid=1563106130; google-analytics_v4_PnTc__session_counter=1; google-analytics_v4_PnTc__ga4=32e8a6bb-59e7-4c08-b552-f3e2feb305f1; cf_chl_3=22e504c37e87f86; cf_clearance=HYIEkBpsV.7orPHM6b650op5btLL79uGMrvMlX71LyA-1705610588-1-AYQmD7/UWhmwp3uIiJiGdhHUq77MxWJaMG234C9YksXiGeuCUN94cg7k9ij09hUXwpM6Q73CzFa0BYoy7dxvIhI=; _Secure-next-auth.session-id=Ay3DE3ib4g5dGgiBD6hzWbf3HWWRFpI2LO8ji9jlAk0; google-analytics_v4_PnTc__engagementDuration=0; google-analytics_v4_PnTc__engagementStart=1705610604864; google-analytics_v4_PnTc__counter=5; google-analytics_v4_PnTc__let=1705610604864; _Secure-next-auth.session-data=MTcwNTYxMDYwNHwzUFpCaVYwdTJDYWdUT2JhZjBrZHUtcm9ZaFpudUpFeVhtcHE5MlpaQlVOYWEwRVdQYTM1N242RTFfTHV4Q0FNUUpRczhtenJkY1JMa0dOZ085anFEVEZtM0Y3STZRMWx8V06hu86R1AzLYy2D0FyyWpBt0WS3o7JAa5TSGVBkoQM=; _dd_s=rum=0&expire=1705611516326",
      },
      data: {
        action: "next",
        messages: [
          {
            id: "aaa28538-8a7d-4b2b-b813-40c26a6b72d0",
            author: { role: "user" },
            content: {
              content_type: "text",
              parts: [q],
            },
            metadata: {},
          },
        ],
        parent_message_id: "aaa1cae6-a010-48ab-85c1-3984ae23b830",
        model: "text-davinci-002-render-sha",
        timezone_offset_min: -480,
        suggestions: [
          "Tell me a random fun fact about the Roman Empire",
          "Write a short-and-sweet text message inviting my neighbor to a barbecue.",
          "Can you suggest fun activities for a family of 4 to do indoors on a rainy day?",
          "Show me a code snippet of a website's sticky header in CSS and JavaScript.",
        ],
        history_and_training_disabled: false,
        arkose_token: null,
        conversation_mode: { kind: "primary_assistant" },
        force_paragen: false,
        force_rate_limit: false,
      },
    };

    var validResponses = [];

    axios
      .request(options)
      .then(function (response) {
        const responses = response.data;

        const splitResponses = responses.split("\n\n");

        splitResponses.forEach((response) => {
          if (response.includes("DONE")) {
            console.log("Stream complete");
          } else {
            try {
              const data = JSON.parse(response.replace("data: ", ""));

              if (
                data &&
                data.message &&
                data.message.content &&
                data.message.content.parts
              ) {
                const content = data.message.content.parts[0];

                if (content.trim() !== "") {
                  validResponses.push(content);
                }
              } else {
              }
            } catch (error) {}
          }
        });
        const l = validResponses.length;
        const content = validResponses[l - 1];
        res.json({ content });
      })
      .catch(function (error) {
        console.error(error);
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
