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

router.post('/generate-wordpress',passport.authenticate('jwt',{session: false}), async (req, res) => {
    const sysprompt = "you are AI playlist generator";

    const userprompt = req.body.prompt || '';
    const appleMusicUserToken = req.body.musicUserToken
    console.log(sysprompt)
    console.log(userprompt)
    let completion;
    if(req.body.useAdvancedSettings==1){
    completion = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [{ "role": "system", "content": sysprompt }, { "role": "user", "content": `${userprompt} ${req.body.advancedSettings.advancedPromptInput}` }],

        max_tokens: req.body.advancedSettings.maxTokens,
        n: 1,
        temperature:  req.body.advancedSettings.temperature,
        frequency_penalty: req.body.advancedSettings.frequencyPenalty,
        presence_penalty: req.body.advancedSettings.presence,
        top_p: 1
    });
}else{
    completion = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [{ "role": "system", "content": sysprompt }, { "role": "user", "content": `${userprompt} make the songs in this format 1. "song" by artist and add a playlist name at the end in the format PlaylistName: the name of the playlist` }],

        max_tokens: 4000,
        n: 1,
        temperature: 0.7,
        frequency_penalty: 0,
        presence_penalty: 0.35,
        top_p: 1
    });
}
    console.log(completion.data.choices[0].message.content);
    const generatedText = completion.data.choices[0].message.content;

    let pattern = /(\d+\.\s)(.*?)(\s-\s)(".*?")/;
    let pattern2 = /(\d+\.\s)(".*?")(\sby\s)(.*)/;

    let lines = generatedText.split('\n');



    let playlist = {
        playlistName: "",
        songs: []
    };
    for (let line of lines) {
        let match = line.match(pattern);
        let match2 = line.match(pattern2);

        const match3 = generatedText.match(/PlaylistName:\s*(.+)/);

        if (match) {
            let artist = match[2];
            let song = match[4].replace(/"/g, '');
            const trackId = await searchSong(song, artist);
            if (trackId) {
                playlist.songs.push({
                    song: song,
                    artist: artist,
                    trackid: trackId

                });
            }
            if (match3) {
                playlist.playlistName = match3[1]

            }
        }
        else if (match2) {
            let song = match2[2].replace(/"/g, '');
            let artist = match2[4];
            console.log(`Song: ${song}, Artist: ${artist}`);
            const trackId = await searchSong(song, artist);
            if (trackId) {
                playlist.songs.push({
                    song: song,
                    artist: artist,
                    trackid: trackId

                });
            }
            if (match3) {
                playlist.playlistName = match3[1]

            }
        }
    }

    res.send(playlist);
    const trackIds = playlist.songs.map(song => song.trackid);
    if (trackIds.length > 0) {
        if (playlist.playlistName){
        await createPlaylistWithSongs(playlist.playlistName,trackIds,appleMusicUserToken);
       
        }
        else{
            await createPlaylistWithSongs("New Playlist",trackIds,appleMusicUserToken);
       
        }
        
        // res.json(addResult);
    }
    
});
router.post('/send-AppleMusic', async (req, res) => {
    
});

export default router;