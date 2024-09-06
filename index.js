const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios").default;

const app = express();
const port = 11000;

// Middleware
app.use(bodyParser.json());

app.get("/api/conversation", async (req, res) => {
  try {
    const q = req.query.q;

var options = {
  method: 'POST',
  url: 'https://new.oaifree.com/backend-api/conversation',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    Cookie: '',
    'X-Authorization': 'Bearer '
  },
  data: {
    action: 'next',
    messages: [
      {
        id: 'aaa2f1fb-b0aa-4e78-91dc-8b25726741c0',
        author: {role: 'user'},
        content: {content_type: 'text', parts: [q]},
        metadata: {}
      }
    ],
    parent_message_id: 'aaa1a4c7-3ba7-40ab-9dd7-da68fe4e798e',
    model: 'text-davinci-002-render-sha',
    timezone_offset_min: -480,
    suggestions: [
      'I\'m going to cook for my date who claims to be a picky eater. Can you recommend me a dish that\'s easy to cook?',
      'Compare storytelling techniques in novels and in films in a concise table across different aspects',
      'Plan a 3-day trip to see the northern lights in Norway. Also recommend any ideal dates.',
      'Give me 3 ideas about how to plan good New Years resolutions. Give me some that are personal, family, and professionally-oriented.'
    ],
    history_and_training_disabled: false,
    arkose_token: null,
    conversation_mode: {kind: 'primary_assistant'},
    force_paragen: false,
    force_rate_limit: false
  }
};


    var validResponses = [];
var id;

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
            const iid = data.conversation_id;
              id = iid; // Assign the value to id

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
        deletemessage(id);
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





async function  deletemessage(id){
  var options = {
    method: "PATCH",
    url: "https://chat.oaifree.com/backend-api/conversation/" + id,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'insomnia/8.6.0',
    Cookie: '_Secure-next-auth.apps-origin=https://chat.oaifree.com; google-analytics_v4_PnTc__ga4=823fd194-64ea-434b-a90c-ad0e5a504244; _Secure-next-auth.session-id=hS34E72AJuDr4eGIyNVMNg80Y6Ie9VQGzexUPreF6ws; google-analytics_v4_PnTc__ga4sid=1749964907; google-analytics_v4_PnTc__session_counter=5; cf_clearance=grTuciuoS0mH1TmXm5MSmSwAfsEMRFMD1DNqge5k1zE-1706525536-1-AXsVxS7MGDzHWbElJCdOyZFKnDlAeUvC1Ac9L4xuaUh46E7zuhEQveuNnMV3ZNuXqlxvgaRZixWjCDqh/FMuY00=; google-analytics_v4_PnTc__engagementDuration=0; _Secure-next-auth.session-data=MTcwNjUyNjIyNXxPOWY1cWd2VWsycS0xcVFQMUxkOTdlVTJ2bnhvV2RTVHRENTJHaEhrbmtzd3p3cS11RzlxRnlRYjNjUnpoQndBRHpnWG5MMlJ5bWdacVBnRnFNTnJGSHdyOUJWSzhBMmR8MigLGbXylhgZ6a1l2nr3lg7mpKTAwQVD3PUU0O0DL0U=; google-analytics_v4_PnTc__engagementStart=1706526338152; google-analytics_v4_PnTc__counter=52; google-analytics_v4_PnTc__let=1706526338152; _dd_s=rum=0&expire=1706527254990',
    'X-Authorization': 'Bearer oEfET3WA-75vsDFuRzE1L6E4qBPCfg9UCIrorg39Npc'
  },
    data: { is_visible: false },
  };

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
}

