import express from "express";
const app = express();

// Middleware to parse JSON bodies

const router = express.Router();
// Middleware to parse JSON bodies
router.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
router.post('/generate-text', async (req, res) => {
    const sysprompt = "you are AI playlist generator";

    const userprompt = req.body.prompt || '';
    console.log(sysprompt)
    console.log(userprompt)
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

    let pattern = /(\d+\.\s)(.*?)(\s-\s)(".*?")/;
    let pattern2 = /(\d+\.\s)(".*?")(\sby\s)(.*)/;

    let lines = generatedText.split('\n');

    let regexedLines = [];

    let playlist = {
        playlistName: "",
        songs: []
    };
    for(let line of lines){
        let match = line.match(pattern);
        let match2 = line.match(pattern2);
       
        const match3 = generatedText.match(/PlaylistName:\s*(.+)/);

        if (match) {
            let artist = match[2];
            let song = match[4].replace(/"/g, '');
           
            regexedLines.push(`Song: ${song}, Artist: ${artist}`);
            playlist.songs.push({
                song: song,
                artist: artist
            });
            if(match3){
                playlist.playlistName = match3[1]
                
            }
        }
        else if (match2) {
            let song = match2[2].replace(/"/g, '');
            let artist = match2[4];
            console.log(`Song: ${song}, Artist: ${artist}`);
            playlist.songs.push({
                song: song,
                artist: artist
            });
          
            if(match3){
                playlist.playlistName = match3[1]

            }
        }
    }
console.log(playlist)
    res.send(playlist);
});


export default router;