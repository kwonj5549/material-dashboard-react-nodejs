
// @mui material components
import Grid from "@mui/material/Grid";
import React, { useState, useEffect } from 'react';
// GPT Toolkit React components
import MDBox from "components/MDBox";

// GPT Toolkit React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// GPT Toolkit React Components
import MDInput from "components/MDInput";

import MDButton from "components/MDButton";
import GPTService from 'services/gpt-service';
import Stack from '@mui/material/Stack';
import MDSnackbar from "components/MDSnackbar";
import { DataGrid } from '@mui/x-data-grid';
import { createContext, useContext } from "react";
import { MusicKitContext } from 'context/index.js';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import { makeStyles } from "@mui/styles";
import applemusicimg from "assets/images/apple-music8293.png"
import infinigptlogo from "assets/images/infinigptlogo.png"
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import Divider from "@mui/material/Divider";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { AppBar, Tabs, Tab } from '@mui/material';
// Create a custom theme
const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: grey[50], // this will give a very light grey color, almost white
        },
      },
    },
  },
});
const useStyles = makeStyles((theme) => ({
  input: {
    "& .MuiInputBase-root": {
      backgroundColor: "white",
      color: "black" // Make sure the text color contrasts with the background
    }
  }
}));
const useBlurStyles = makeStyles((theme) => ({
  blur: {
    filter: 'blur(2px)',
    pointerEvents: 'none'
  },
  spinnerContainer: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9999

  },

}));
import Typography from '@mui/material/Typography';
function WordpressGPT() {
  const classes = useStyles();
  const classesblur = useBlurStyles();
  const [input, setInput] = useState("");
  const [response, setResponseData] = useState(null);
  const [linkState, setLinkState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
  const [advancedPromptInput, setadvancedPromptInput] = useState("Write a blog post with the concise and appealing title inside double brackets like this [[\"title\"]] and keep the double bracks in the output and then put a summary of the whole blog post right below in this format Summary: \"the summary of the article\" and put the content/actual blog post about the below this: ${topic} in the style of an expert with 15 years of experience without explicitly mentioning this");
  const openWordpressGPTSnackbarSuccess = () => setSnackbarSuccessOpen(true);
  const closeWordpressGPTSnackbarSuccess = () => setSnackbarSuccessOpen(false);
  const [snackbarUnauthOpen, setSnackbarUnauthOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const openWordpressGPTSnackbarUnauth = () => setSnackbarUnauthOpen(true);
  const closeWordpressGPTSnackbarUnauth = () => setSnackbarUnauthOpen(false);
  const [ppenvalue, setppenValue] = useState(.35);
  const [fpenvalue, setfpenValue] = useState(0);
  const [tempvalue, setTempValue] = useState(.7);
  const [maxtokenvalue, setMaxTokenValue] = useState(4000);
  const [tabvalue, setTabValue] = useState(0);
  const [siteURL, setsiteURL] = useState("");
  const [WPusername, setWPusernameInput] = useState("kwill5800");
  const [accessToken, setAccessToken] = useState("");
 const [WPaccessToken, setWPaccessToken] = useState("")
 const CLIENT_ID="87833"
const CLIENT_SECRET="vnWsWAvLBzvb3j40QBQQFQtIFnqzSc7jtlA4ltSpSOC4TXot1B3FUDecfZbumw7r"
const REDIRECT_URI="http://localhost:8080/auth/wordpress/callback"
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handlefPenInputChange = (event) => {
    setfpenValue(parseFloat(event.target.value));
  };
  

  const handlefPenSliderChange = (event, newValue) => {
    setfpenValue(newValue);
  };

  const handlepPenInputChange = (event) => {
    setppenValue(parseFloat(event.target.value));
  };

  const handlepPenSliderChange = (event, newValue) => {
    setppenValue(newValue);
  };
  const handleTempInputChange = (event) => {
    setTempValue(parseFloat(event.target.value));
  };

  const handleTempSliderChange = (event, newValue) => {
    setTempValue(newValue);
  };
  const handleMaxTokenInputChange = (event) => {
    setMaxTokenValue(parseFloat(event.target.value));
  };

  const handleMaxTokenSliderChange = (event, newValue) => {
    setMaxTokenValue(newValue);
  };

  useEffect(() => {
    // Parse the authorization code from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const userId = JSON.parse(localStorage.getItem("user"));
    // Check if the state value mastches the user ID in the local storage
  
   
  
    if (code) {
      // Exchange the authorization code for an access token
      fetch('https://public-api.wordpress.com/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${userId.id}`
      })
      .then(response => response.json())
      .then(data => {
        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          setAccessToken(data.access_token);
        }
      });
    }
    
    const savedAccessToken = localStorage.getItem("access_token");
    if (savedAccessToken) {
      setAccessToken(savedAccessToken);
    }
  }, []);
  const renderSuccessSnackbar = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Request Success"
      content="Your blog has been generated and uploaded to WordPress"
      dateTime="Just now"
      open={snackbarSuccessOpen}
      onClose={closeWordpressGPTSnackbarSuccess}
      close={closeWordpressGPTSnackbarSuccess}
      bgWhite
    />
  );
  const renderUnauthSnackbar = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Not Authenticated"
      content="Please Authenticate with  Wordpress"
      dateTime="Just now"
      open={snackbarUnauthOpen}
      onClose={closeWordpressGPTSnackbarUnauth}
      close={closeWordpressGPTSnackbarUnauth}
      bgWhite
    />
  );
  const music = useContext(MusicKitContext);
  const handleAuthorize = async () => {
    const userId = JSON.parse(localStorage.getItem("user"));
    window.location.href = `https://public-api.wordpress.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${userId.id}&response_type=code`;
};
  const handleUnauthorize = () => {

    localStorage.removeItem('WPaccessToken');
    setWPaccessToken("")
  }
  useEffect(() => {
    if (WPaccessToken) {
      setLinkState(true);
    } else {
      setLinkState(false);
    }
}, [WPaccessToken]);

const sendData = async () => {
  setIsLoading(true);

  const advancedSettings = {
    advancedPromptInput: advancedPromptInput,
    frequencyPenalty: fpenvalue,
    presencePenalty: ppenvalue,
    maxTokens: maxtokenvalue,
    temperature: tempvalue
  };
  
  const payload = {
    prompt: input,
    useAdvancedSettings: tabvalue, 
    advancedSettings:advancedSettings,
    siteURL:siteURL
    
  };

  try {

    const response = await GPTService.generateWordpress(JSON.stringify(payload));
    setSelectedBlog(response[0])
    setResponseData(response); 
   
    console.log(selectedBlog)// Do something with the response
    openAppleMusicGPTSnackbarSuccess();
    setInput("");

  } catch (error) {
    console.error(error);
  } finally {
    setIsLoading(false);
  }


};
useEffect(() => {
  let token = new URLSearchParams(window.location.search).get('accessToken');
  if (!token) {
    token = localStorage.getItem('WPaccessToken');
  }
  setWPaccessToken(token);
  if (token) {
    localStorage.setItem('WPaccessToken', token);
  }
}, []);



  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className={isLoading ? classesblur.blur : ''}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MDBox
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                p: 1,
                borderRadius: 1,
                mb: 0,
                ml: 3,
                pl: 0
              }}
            >
                <MDBox sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'left', p: 2,pl:0 }}>
              <Typography sx={{pr:2}}variant="h2" align="left">Wordpress GPT</Typography>
           
              

                  <Tabs value={tabvalue} onChange={handleTabChange} aria-label="simple tabs example">
                    <Tab label="Basic" />
                    <Tab label="Advanced" />
                    <Tab label="History" />
                  </Tabs>
                </MDBox>
      
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <img src={infinigptlogo} alt="Logo" style={{ height: '50px', width: '50px' }} />
                {linkState ? <LinkIcon fontSize="large" style={{ color: '#00b0ff' }} /> : <LinkOffIcon fontSize="large" style={{ color: 'red' }} />}
                <img src={applemusicimg} alt="Logo" style={{ height: '50px', width: '50px' }} />
                {linkState ? <MDButton
                  variant="gradient"
                  color="info"
                  fullWidth
                  type="button"
                  style={{ width: '150px' }}
                  onClick={handleUnauthorize}
                >
                  UnAuthenticate
                </MDButton> : <MDButton
                  variant="gradient"
                  color="info"
                  fullWidth
                  type="button"
                  style={{ width: '150px' }}
                  onClick={handleAuthorize}
                >
                  Authenicate
                </MDButton>}
              </div>
            </MDBox>
          </Grid>
          <Grid item xs={9}>
            <MDInput
              className={classes.input}
              label="Enter Your Prompt"
              multiline
              rows={5}
              fullWidth
              value={input}
              onChange={event => setInput(event.target.value)}

            />
          </Grid>
          <Grid item xs={3}>
            <MDBox>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="button"
                onClick={linkState ? sendData : openWordpressGPTSnackbarUnauth}
              >
                Generate
              </MDButton>
            </MDBox>
          </Grid>
          <Grid item xs={7}>
          <MDBox 
  mt={5} 
  sx={{ 
    boxShadow: theme.shadows[3], 
    display: 'flex', 
    flexDirection: 'column', 
    width: '100%', 
    height: response ? '450px' : '80px', 
    borderRadius: '10px', 
    backgroundColor: '#ffffff', 
    overflow: 'auto' 
  }} 
  p={2}
>
  <Typography variant="h2" align="left">Response</Typography>
  {selectedBlog && response && (
    <Grid container spacing={3} direction="column" style={{ height: '100%' }}>
      <Grid item>
        <Select
          value={selectedBlog}
          onChange={event => setSelectedBlog(event.target.value)}
        >
          {response.map((blog, index) => (
            <MenuItem value={blog} key={index}>
              {blog.title}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid item>
        <TextField
          label="Title"
          value={selectedBlog.title}
          onChange={event => setSelectedBlog({...selectedBlog, title: event.target.value})}
          fullWidth
        />
      </Grid>
      <Grid item style={{ flexGrow: 1 }}>
        <TextField
          label="Content"
          multiline
          rows={10}
          value={selectedBlog.content}
          onChange={event => setSelectedBlog({...selectedBlog, content: event.target.value})}
          style={{ height: '100%' }}
          fullWidth
        />
      </Grid>
    </Grid>
  )}
</MDBox>
          </Grid>
          <Grid item xs={5}>
           {tabvalue == 1 && <MDBox
              sx={{
                p: 2,
                mt: 5, // Add top margin
                width: '100%',
                height: '600px', // Set fixed height
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                boxShadow: theme.shadows[3],
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                // Reduced gap for dividers
              }}
            >
              <Typography variant="h2" align="left">Advanced</Typography>
              <Divider />  {/* Divider line */}
              <MDBox 
  sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'flex-start' 
  }}
>
              <Typography variant="h6">Prompt:</Typography>
              <MDInput
                className={classes.input}
                label="Enter the default prompt that goes after the user prompt"
                multiline
                rows={2}
                fullWidth
                value={advancedPromptInput}
                onChange={event => setadvancedPromptInput(event.target.value)}
              />
              </MDBox>
              <Divider />  {/* Divider line */}
              <MDBox 
  sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'flex-start' 
  }}
>
              <Typography variant="h6">WP Username:</Typography>
              <MDInput
                className={classes.input}
                label="Enter your username"
                multiline
                rows={1}
                sx={{ width:"40%"}}
                value={WPusername}
                onChange={event => setWPusernameInput(event.target.value)}
              />
              </MDBox>
              <Divider /> 
              <MDBox 
  sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'flex-start' 
  }}
>
              <Typography variant="h6">Site URL</Typography>
              <MDInput
                className={classes.input}
                label="Enter your Application Password"
                multiline
                rows={1}
                sx={{ width:"40%"}}
                value={siteURL}
                onChange={event => setsiteURL(event.target.value)}
              />
              </MDBox>
              <Divider /> 

              <Grid container direction="row" alignItems="center" spacing={2}>
                <Grid item xs={3}>
                  <Typography variant="h6">Frequency Penalty:</Typography>
                </Grid>
                <Grid item xs={2}>
                  <TextField

                    variant="outlined"
                    value={fpenvalue}
                    onChange={handlefPenInputChange}
                    type="number"
                    inputProps={{
                      step: 0.01,
                      min: 0,
                      max: 2,
                    }} />
                </Grid>
                <Grid item xs={6}>
                  <Slider
                    value={fpenvalue}
                    onChange={handlefPenSliderChange}
                    min={0}
                    max={2}
                    step={0.01}
                    aria-label="Slider for Frequency Penalty"
                  />
                </Grid>
              </Grid>

              <Divider />  {/* Divider line */}
              <Grid container direction="row" alignItems="center" spacing={2}>
                <Grid item xs={3}>
                  <Typography variant="h6">Presence Penalty:</Typography>
                </Grid>
                <Grid item xs={2}>
                  <TextField

                    variant="outlined"
                    value={ppenvalue}
                    onChange={handlepPenInputChange}
                    type="number"
                    inputProps={{
                      step: 0.01,
                      min: 0,
                      max: 2,
                    }} />
                </Grid>
                <Grid item xs={6}>
                  <Slider
                    value={ppenvalue}
                    onChange={handlepPenSliderChange}
                    min={0}
                    max={2}
                    step={0.01}
                    aria-label="Slider for Presence Penalty"
                  />
                </Grid>
              </Grid>
              <Divider />  {/* Divider line */}
              <Grid container direction="row" alignItems="center" spacing={2}>
                <Grid item xs={3}>
                  <Typography variant="h6">Temperature:</Typography>
                </Grid>
                <Grid item xs={2}>
                  <TextField

                    variant="outlined"
                    value={tempvalue}
                    onChange={handleTempInputChange}
                    type="number"
                    inputProps={{
                      step: 0.01,
                      min: 0,
                      max: 2,
                    }} />
                </Grid>
                <Grid item xs={6}>
                  <Slider
                    value={tempvalue}
                    onChange={handleTempSliderChange}
                    min={0}
                    max={2}
                    step={0.01}
                    aria-label="Slider for Temperature"
                  />
                </Grid>
              </Grid>
              <Divider />  {/* Divider line */}
              <Grid container direction="row" alignItems="center" spacing={2}>
                <Grid item xs={3}>
                  <Typography variant="h6">Max Tokens:</Typography>
                </Grid>
                <Grid item xs={2}>
                  <TextField

                    variant="outlined"
                    value={maxtokenvalue}
                    onChange={handleMaxTokenInputChange}
                    type="number"
                    inputProps={{
                      step: 1,
                      min: 1000,
                      max: 8000,
                    }} />
                </Grid>
                <Grid item xs={6}>
                  <Slider
                    value={maxtokenvalue}
                    onChange={handleMaxTokenSliderChange}
                    min={1000}
                    max={8000}
                    step={1}
                    aria-label="Slider for Max Tokens"
                  />
                </Grid>
              </Grid>
            </MDBox>}
          </Grid>
        </Grid>
      </div>
      {isLoading &&
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999
        }}>
          <CircularProgress />
        </div>
      }
      {renderSuccessSnackbar}
      {renderUnauthSnackbar}

    </DashboardLayout>
  );
}


export default WordpressGPT;