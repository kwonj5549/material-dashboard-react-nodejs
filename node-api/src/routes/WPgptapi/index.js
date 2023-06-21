import express from "express";

import passport from "passport";
// Middleware to parse JSON bodies

const router = express.Router();
// Middleware to parse JSON bodies
router.use(express.json());

// Middleware to parse URL-encoded bodies

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
async function generateAdvancedBlogPost(topic,req) {
const completion = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{ "role": "system", "content": "you are ai blog post generator" }, { "role": "user", "content": `Write a blog post with the concise and appealing title inside double brackets like this [[\"title\"]] and keep the double bracks in the output and then put a summary of the whole blog post right below in this format Summary: \"the summary of the article\" and put the content/actual blog post about the below this: ${topic} in the style of an expert with 15 years of experience without explicitly mentioning this`  }],

    max_tokens: req.body.advancedSettings.maxTokens,
    n: 1,
    temperature:  req.body.advancedSettings.temperature,
    frequency_penalty: req.body.advancedSettings.frequencyPenalty,
    presence_penalty: req.body.advancedSettings.presence,
    top_p: 1
});
return completion;
}
async function generateBasicBlogPost(topic) {
const completion = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{ "role": "system", "content": "you are ai blog post generator" }, { "role": "user", "content": `Write a blog post with the concise and appealing title inside double brackets like this [[\"title\"]] and keep the double bracks in the output and then put a summary of the whole blog post right below in this format Summary: \"the summary of the article\" and put the content/actual blog post about the below this: ${topic} in the style of an expert with 15 years of experience without explicitly mentioning this`  }],


    max_tokens: 4000,
    n: 1,
    temperature: 0.7,
    frequency_penalty: 0,
    presence_penalty: 0.35,
    top_p: 1
});
return completion;
}

function extractTextBetweenDoubleBrackets(text) {
    const match = text.match(/\[\[(.*?)\]\]/);
    return match ? match[1] : "New Post";
  }
  
router.post('/generate-Wordpress', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const topics = req.body.prompt.split("\n");
    const tasks = topics.map(async topic => {
      let completion;
      if (req.body.useAdvancedSettings == 1) {
        completion = await generateAdvancedBlogPost(topic,req);
      } else {
        completion = await generateBasicBlogPost(topic);
      }
  
      console.log(completion.data.choices[0].message.content);
      const generatedText = completion.data.choices[0].message.content;
  
      // Extract title and content
      const title = extractTextBetweenDoubleBrackets(generatedText);
      const content = generatedText.replace(/\[\[(.*?)\]\]/, "").replace(/content:/gi, "").trim(); // Remove the title and "content:" from the content // Remove the title from the content
  
      // Return the generated object
      return {
        title: title,
        content: content,
      };
    });
  
    // Wait for all tasks to complete
    let generations = await Promise.all(tasks);
  
    // Send the generations back as the response
    res.json(generations);
  });


export default router;