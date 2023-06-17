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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Material Dashboard 2 React Components
import MDInput from "components/MDInput";

import MDButton from "components/MDButton";


function AppleMusicGPT() {


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox px={2} py={2}>
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
                  onClick={handleLogOut}
                >
                  Log Out
                </MDButton>
              </MDBox>
      </Grid>
    </Grid>
        
        <MDBox mt={4.5}>
          
        </MDBox>
        
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

const handleLogOut = async () => {
  const response = await AuthService.logout();
  authContext.logout();
};
export default AppleMusicGPT;
