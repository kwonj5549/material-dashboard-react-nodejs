import express from "express";
const app = express();

// Middleware to parse JSON bodies

const router = express.Router();
// Middleware to parse JSON bodies
router.use(express.json());

// Middleware to parse URL-encoded bodies
router.use(express.urlencoded({ extended: true }));
router.post("/login", async (req, res, next) => {

  const { email, password } = req.body.data.attributes;
  await loginRouteHandler(req, res, email, password);
});

router.post('/generate-text', async (req, res) => {
    const sysprompt = "you are AI playlist generator";
    const userprompt = req.query.prompt || '';
    console.log(sysprompt)
    const completion = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [{ "role": "system", "content": sysprompt }, { "role": "user", "content": `${userprompt} make the songs in this format 1. "song" by artist and add a playlist name at the end in the format PlaylistName: the name of the playlist`  }],

        max_tokens: 4000,
        n: 1,
        temperature: 0.7,
        frequency_penalty: 0,
        presence_penalty: 0.35,
        top_p: 1
    });
    console.log(completion.data.choices[0].message.content);
    const generatedText = completion.data.choices[0].message.content;
    res.send(generatedText)
});


