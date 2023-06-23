import express from "express";

import passport from "passport";
// Middleware to parse JSON bodies


const router = express.Router();


// Middleware to parse JSON bodies
router.use(express.json());
import { userModel } from "../../schemas/user.schema";
// Middleware to parse URL-encoded bodies
const CLIENT_ID="87833"
const CLIENT_SECRET="vnWsWAvLBzvb3j40QBQQFQtIFnqzSc7jtlA4ltSpSOC4TXot1B3FUDecfZbumw7r"
const REDIRECT_URI="http://localhost:8080/auth/wordpress/callback"
import { Configuration, OpenAIApi } from "openai";
import base64 from 'base-64'; 
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
  const WPuserId = req.headers.userid
  console.log(WPuserId)
  const user = await userModel.findOne({ _id: WPuserId });
  console.log(user)
  const WP_AUTH_TOKEN = user.wordpressAccessToken
const WP_API_URL = req.body.siteURL
console.log(WP_AUTH_TOKEN)
let userAPIUsage = user.apiUsage;

    const tasks = topics.map(async topic => {
      let completion;
 
     
      if (req.body.useAdvancedSettings == 1) {
        completion = await generateAdvancedBlogPost(topic,req);
        
      } else {
        completion = await generateBasicBlogPost(topic);
      }
      userAPIUsage = userAPIUsage + (completion.data.usage.prompt_tokens/1000)*0.03+(completion.data.usage.completion_tokens/1000)*0.06;
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
    generations.forEach(async (blog) => {
      try {
        const response = await fetch(`https://public-api.wordpress.com/wp/v2/sites/${WP_API_URL}/posts/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${WP_AUTH_TOKEN}`
          },
          body: JSON.stringify({
            // assuming "title" and "content" are correct properties for the WordPress API
            title: blog.title,
            content: blog.content,
            status: 'publish' // if you want to auto-publish the post
          })
        });
  
        if (!response.ok) throw new Error(response.statusText);
        
        const data = await response.json();
  
        console.log(`Blog post with ID: ${data.id} created.`);
      } catch (error) {
        console.error(`Failed to create blog post: ${error.message}`);
      }
    });
    // Send the generations back as the response
    await userModel.findOneAndUpdate({ _id: WPuserId }, { $set: { apiUsage: userAPIUsage } }, { new: true, upsert: true });
    res.send({
      generations,
      apiUsage: userAPIUsage,
    });
  });
  import OAuth2Strategy from 'passport-oauth2';
  passport.use('wordpress', new OAuth2Strategy({
    authorizationURL: 'https://public-api.wordpress.com/oauth2/authorize',
    tokenURL: 'https://public-api.wordpress.com/oauth2/token',
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: REDIRECT_URI,
    passReqToCallback: true // pass the request to the callback
  }, 
 async function(req, accessToken, refreshToken, profile, done) { // notice the added "req" here
    console.log('Inside OAuth2Strategy function');
    console.log('Access Token: ', accessToken);
    
    const userId = req.query.state;
    console.log('User ID (state): ', userId);
    
   
  try {
    const user = await userModel.findOneAndUpdate({ _id: userId }, { $set: { wordpressAccessToken: accessToken } }, { new: true, upsert: true });
    console.log(user)
    done(null, user);
  } catch(err) {
    done(err);
  }
  }));
  router.get('/auth/wordpress/callback', function(req, res, next) {
    console.log('Inside auth callback handler'); // <-- new logging statement
    passport.authenticate('wordpress', function(err, user, info) {
      console.log('Inside authenticate function'); // <-- new logging statement
     
        return res.redirect(`http://localhost:3000/WordpressGPT?accessToken=${user.wordpressAccessToken}`);
    
     
         
    })(req, res, next);
  });
export default router;