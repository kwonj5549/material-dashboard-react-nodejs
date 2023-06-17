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
import { DataGrid } from '@mui/x-data-grid';

function AppleMusicGPT() {
  const [input, setInput] = useState("");
  const [response, setResponseData] = useState(null);
  const [music, setMusic] = useState(null);  

  const handleAuthorize = () => {
    try {
      window.MusicKit.configure({
        developerToken: 'eyJhbGciOiJFUzI1NiIsImtpZCI6IjY3TDY2U05QTTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJVN1dLODZQTFlYIiwiaWF0IjoxNjg3MDEzODMyLCJleHAiOjE3MDE0MTM4MzJ9.dxtV-q4w9aJgAe5MqaUeK5RbqcWYXVo6QT_MU1SA6gEx2gNscENfuhq6QajgnMV-yqYq4P2QmwJUnIgpNcGxAw',
        app: {
          name: 'My Cool Web App',
          build: '1978.4.1',
        },
      });

      // store the instance in a state or in a React context
    } catch (err) {
      console.error('MusicKit configuration error:', err);
    }
    const music = MusicKit.getInstance();
    music.authorize()
      .then(() => {
        console.log('User authorized');
        console.log(music.musicUserToken);
      })
      .catch((error) => {
        console.error('Authorization error:', error);
      });
  };
  const handleUnauthorize = () =>{
    try {
      window.MusicKit.configure({
        developerToken: 'eyJhbGciOiJFUzI1NiIsImtpZCI6IjY3TDY2U05QTTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJVN1dLODZQTFlYIiwiaWF0IjoxNjg3MDEzODMyLCJleHAiOjE3MDE0MTM4MzJ9.dxtV-q4w9aJgAe5MqaUeK5RbqcWYXVo6QT_MU1SA6gEx2gNscENfuhq6QajgnMV-yqYq4P2QmwJUnIgpNcGxAw',
        app: {
          name: 'My Cool Web App',
          build: '1978.4.1',
        },
      });

      // store the instance in a state or in a React context
    } catch (err) {
      console.error('MusicKit configuration error:', err);
    }
    const music = MusicKit.getInstance();
    music.unauthorize();
    console.log('User unauthorized');
  }

  const sendData = async () => {

    const payload = {
      prompt: input 
    };
  
    try {
      const response = await GPTService.generate(JSON.stringify(payload));
      setResponseData(response); // Do something with the response
      setInput("");
    } catch (error) {
      console.error(error);
    }
  };


  const columns = [
    { field: 'song', headerName: 'Song Name', width: 250 },
    { field: 'artist', headerName: 'Artist', width: 250 },
    
  ];

  // Ma to rows for DataGrid
  const rows = response ? response.songs.map((song, index) => ({
    id: index,
    ...song
  })) : [];
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox px={2} py={2}>
      <Stack
  direction="column"
  justifyContent="center"
  alignItems="center"
  spacing={2}
>
      <Grid container spacing={3}>
      <Grid item xs={7}>
      <MDInput 
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
                  onClick={sendData} 
                >
                  Generate
                </MDButton>
              </MDBox>
              <MDBox>
                <MDButton
                  variant="gradient"
                  color="info"
                  fullWidth
                  type="button"
                  onClick={handleAuthorize} 
                >
                  Authenticate
                </MDButton>
              </MDBox>
              <MDBox>
                <MDButton
                  variant="gradient"
                  color="info"
                  fullWidth
                  type="button"
                  onClick={handleUnauthorize} 
                >
                  UnAuthenticate
                </MDButton>
              </MDBox>
      </Grid>
      
    </Grid>
        
        <MDBox>
        {response && ( // Only render DataGrid if response exists
          <DataGrid
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
        )}
        </MDBox>
        </Stack>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}


export default AppleMusicGPT;
