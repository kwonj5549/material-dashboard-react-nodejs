import express from "express";

import passport from "passport";
// Middleware to parse JSON bodies

const router = express.Router();
// Middleware to parse JSON bodies
router.use(express.json());

// Middleware to parse URL-encoded bodies

import { Configuration, OpenAIApi } from "openai";
import { userModel } from "../../schemas/user.schema";
import { apiUsageHistory } from "../../schemas/apiUsageHistory.schema";
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
async function searchSong(songName, artistName) {
    const headers = {
        'Authorization': `Bearer ${process.env.APPLE_MUSIC_DEV_TOKEN}`,
        'Content-Type': 'application/json'
    };

    const requestOptions = {
        method: 'GET',
        headers: headers
    };

    const combinedSearchTerm = `${songName} ${artistName}`;

    try {
        const response = await fetch(`https://api.music.apple.com/v1/catalog/us/search?term=${encodeURIComponent(combinedSearchTerm)}&limit=1&types=songs`, requestOptions);
   
        const result = await response.json();
        

        if (result.results.songs && result.results.songs.data.length > 0) {
            const trackId = result.results.songs.data[0].id;
       

            return trackId;

        } else {
            console.log('No songs found with the specified name and artist.');
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
async function createPlaylistWithSongs(playlistName,trackIds,userToken) {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${process.env.APPLE_MUSIC_DEV_TOKEN}`);
    headers.append('Music-User-Token', userToken);
    headers.append('Content-Type', 'application/json');
    const raw = JSON.stringify({
        "attributes": {
            "name": playlistName,
            "description": 'Created using MusicKit API'
        }
    });
    const requestOptionsCreatePlaylist = {
        method: 'POST',
        headers: headers,
        body: raw,
        redirect: 'follow'
    };

    
    const requestOptionsAddSongs = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            data: trackIds.map(trackId => ({
                id: trackId,
                type: 'songs'
            }))
        })
    };

  
    try {
        const response = await fetch(`https://api.music.apple.com/v1/me/library/playlists`, requestOptionsCreatePlaylist);
        const result = await response.json();
        
        const playlistId = result.data[0].id;
        try {
            const response = await fetch(`https://api.music.apple.com/v1/me/library/playlists/${playlistId}/tracks`, requestOptionsAddSongs);
        } catch (error) {
            console.error('Error:', error);
        }
        
    } catch (error) {
        console.error('Error:', error);
    }
   
  

}
router.get('/fetch-apiUsage', passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        let userId = req.headers.userid;

        // Validate userId
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Fetch the user
        const userAPI = await apiUsageHistory.findOne({ _id: userId });
        if(userAPI){
            res.json({apiUsage:userAPI.apiUsage});
        }else{
            const newAPIUser = new apiUsageHistory({
                _id: userId,
                apiUsage:0,
                usageHistory: {},
              });
              await newAPIUser.save();
              res.json({apiUsage:0});
        }
        // Check if user exists
      
        // Send the response
       
    } catch (error) {
        // Log the error for debugging
        console.error(error);
        
        // Send error response
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/generate-AppleMusic',passport.authenticate('jwt',{session: false}), async (req, res) => {
    const sysprompt = "you are AI playlist generator";
    const date = new Date();
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
let userId = req.headers.userid



let cost = 0;
cost = cost + (completion.data.usage.prompt_tokens/1000)*0.03+(completion.data.usage.completion_tokens/1000)*0.06;


await apiUsageHistory.findOneAndUpdate({ _id: userId }, { $inc: { apiUsage: cost } }, { new: true, upsert: true });
const userAPILog = await apiUsageHistory.findOne({ _id: userId });

// Update the usage history
userAPILog.usageHistory.push({
    apiUsage: cost,
    timestamp: date,
    service:"applemusicgpt"
});

await userAPILog.save();
console.log(cost)

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
            console.log(trackId)
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
    res.send({
        playlist,
        apiUsage: userAPILog.apiUsage,
      });
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