/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import React, { useState, useEffect } from 'react';
// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Material Dashboard 2 React Components
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
function AppleMusicGPT() {
  const classes = useStyles();
  const classesblur = useBlurStyles();
  const [input, setInput] = useState("");
  const [response, setResponseData] = useState(null);
  const [linkState, setLinkState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);

  const openAppleMusicGPTSnackbarSuccess = () => setSnackbarSuccessOpen(true);
  const closeAppleMusicGPTSnackbarSuccess = () => setSnackbarSuccessOpen(false);
  const [snackbarUnauthOpen, setSnackbarUnauthOpen] = useState(false);

  const openAppleMusicGPTSnackbarUnauth = () => setSnackbarUnauthOpen(true);
  const closeAppleMusicGPTSnackbarUnauth = () => setSnackbarUnauthOpen(false);

  const renderSuccessSnackbar = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Request Success"
      content="Your playlist has been generated and uploaded to apple music"
      dateTime="Just now"
      open={snackbarSuccessOpen}
      onClose={closeAppleMusicGPTSnackbarSuccess}
      close={closeAppleMusicGPTSnackbarSuccess}
      bgWhite
    />
  );
  const renderUnauthSnackbar = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Not Authenticated"
      content="Please Authenticate with Apple Music"
      dateTime="Just now"
      open={snackbarUnauthOpen}
      onClose={closeAppleMusicGPTSnackbarUnauth}
      close={closeAppleMusicGPTSnackbarUnauth}
      bgWhite
    />
  );
  const music = useContext(MusicKitContext);
  const handleAuthorize = () => {
    if (music) {
      music.authorize()
        .then(() => {
          console.log('User authorized');
          setLinkState(true)
          console.log(music.musicUserToken);

        })
        .catch((error) => {
          console.error('Authorization error:', error);
        });

    } else {
      console.log('MusicKit instance is not available');
    }
  };
  const handleUnauthorize = () => {

    music.unauthorize();
    setLinkState(false)
    console.log('User unauthorized');
  }
  useEffect(() => {
    if (music.musicUserToken) {
      setLinkState(true);
    } else {
      setLinkState(false);
    }
  }, [music.musicUserToken]);
  
  const sendData = async () => {
    setIsLoading(true);

    const payload = {
      prompt: input,
      musicUserToken: music.musicUserToken
    };

    try {
 
      const response = await GPTService.generateAppleMusic(JSON.stringify(payload));
      
      setResponseData(response); // Do something with the response
      openAppleMusicGPTSnackbarSuccess();
      setInput("");
      
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
   

  };


  const columns = [
    { field: 'song', headerName: 'Song Name', width: 250 },
    { field: 'artist', headerName: 'Artist', width: 250 },
    { field: 'trackid', headerName: 'Track ID', width: 250 },
  ];

  // Ma to rows for DataGrid
  const rows = response ? response.songs.map((song, index) => ({
    id: index,
    ...song
  })) : [];
  return (
    <DashboardLayout>
      <DashboardNavbar />
      
      <div className={isLoading ? classesblur.blur : ''}>
      <MDBox px={2} py={1}>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={0}
        >
         <MDBox 
  sx={{ 
    display:'flex',
    justifyContent:'space-between',
    alignItems:'center', // Add this line
    width: '100%',
    p: 1,
    borderRadius: 1,
    mb: 0,
    ml:3,
    pl:0
  }}
>
  <Typography variant="h2" align="left">Apple Music GPT</Typography>
  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
    <img src={infinigptlogo} alt="Logo" style={{height: '50px', width: '50px'}} />
    
    {linkState ? <LinkIcon fontSize="large" style={{ color: '#00b0ff' }}/> : <LinkOffIcon fontSize="large" style={{ color: 'red' }}/>}
    <img src={applemusicimg} alt="Logo" style={{height: '50px', width: '50px'}} />
    {linkState ? <MDButton
                  variant="gradient"
                  color="info"
                  fullWidth
                  type="button"
                  style={{ width: '150px' }}
                  onClick={handleUnauthorize}
                >
                  UnAuthenticate
                </MDButton>:  <MDButton
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
          <Grid container spacing={3} pl={1}>
            <Grid item xs={7}>
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
            <Grid item xs={5}>
              <MDBox>
                <MDButton
                  variant="gradient"
                  color="info"
                  fullWidth
                  type="button"
                  
                  onClick={linkState ? sendData: openAppleMusicGPTSnackbarUnauth}
                  
                >
                  Generate
                </MDButton>
              </MDBox>
             
            </Grid>

          </Grid>

          <MDBox>
            {response && ( // Only render DataGrid if response exists
            <ThemeProvider theme={theme}>
              <DataGrid
              color='white'
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
              />
              </ThemeProvider>
            )}
          </MDBox>
        </Stack>
      
      </MDBox>
      
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
      <Footer />
    </DashboardLayout>
  );
}


export default AppleMusicGPT;
