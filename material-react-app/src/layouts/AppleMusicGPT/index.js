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
const sendData = async () => {

  const payload = {
    prompt: "Make me a 5 song r and b playlist"
  };

  try {
    const response = await GPTService.generate(JSON.stringify(payload));
    setResponseData(response); // Do something with the response
  } catch (error) {
    console.error(error);
  }
};
function AppleMusicGPT() {
  const sendData = async () => {

    const payload = {
      prompt: "Make me a 5 song r and b playlist"
    };
  
    try {
      const response = await GPTService.generate(JSON.stringify(payload));
      setResponseData(response); // Do something with the response
    } catch (error) {
      console.error(error);
    }
  };
  const [isGenerated, setIsGenerated] = useState(false);
  // State to hold response data
  const [response, setResponseData] = useState(null);
  useEffect(() => {
    // If button has been clicked, call sendData
    if(isGenerated) {
      sendData(setResponseData);
    }
  }, [isGenerated]);
  const columns = [
    { field: 'song', headerName: 'Song Name', width: 200 },
    { field: 'artist', headerName: 'Artist', width: 200 },
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
      <MDInput label="Enter Your Prompt" multiline rows={5} fullWidth/>
      </Grid>
      <Grid item xs={5}>
      <MDBox>
                <MDButton
                  variant="gradient"
                  color="info"
                  fullWidth
                  type="button"
                  onClick={() => setIsGenerated(true)} 
                >
                  Generate
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