import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import InfoInformation from "../../../views/componenets/Profile/infoInformation";
import Security from "../../../views/componenets/Profile/security";
import Permission from "../../../views/componenets/Profile/permission";
import { getStaffByID } from '@/services/staff.service';
import { Box, Container, Typography, Paper, Tab, Tabs, Avatar, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";

// Styled components for consistent layout
const ContentWrapper = styled(Box)({
  minHeight: '600px', // Set minimum height to prevent layout jumps
  padding: '24px',
  position: 'relative'
});

const PageHeader = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: '48px',
  paddingTop: '24px'
});

const SectionTitle = styled(Typography)({
  fontSize: '24px',
  fontWeight: '400',
  lineHeight: '28px',
  marginBottom: '24px',
  paddingLeft: '24px'
});

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: '14px',
  minHeight: '48px',
  padding: '12px 24px'
}));

const StyledTabs = styled(Tabs)({
  borderBottom: "1px solid #DADCE0",
  minHeight: '48px',
  '& .MuiTabs-indicator': {
    backgroundColor: '#4489FE'
  }
});

export default function ProfilePage() {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const { staffId } = router.query; // Get the staffId from the URL
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([
    { pageName: "Task Types", view: true, use: true, create: true, edit: false, delete: false, all: false },
    { pageName: "Services", view: false, use: false, create: false, edit: false, delete: false, all: false },
    { pageName: "Workflows", view: false, use: false, create: false, edit: false, delete: false, all: false },
    { pageName: "Staff Designations", view: false, use: false, create: false, edit: false, delete: false, all: false },
    { pageName: "Staff", view: false, use: false, create: false, edit: false, delete: false, all: false },
    { pageName: "Clients", view: false, use: false, create: false, edit: false, delete: false, all: false },
    { pageName: "Resellers", view: false, use: false, create: false, edit: false, delete: false, all: false },
    { pageName: "Orders", view: false, use: false, create: false, edit: false, delete: false, all: false },
    { pageName: "Files", view: false, use: false, create: false, edit: false, delete: false, all: false },
  ]);

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
  });

  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    if (staffId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await getStaffByID(staffId);
          if (data) {
            setProfileData({
              fullName: data.fullName || "",
              email: data.email || "",
            });
            setUserRoles(data.roles || []);
          }
        } catch (error) {
          console.error("Error fetching staff data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [staffId]); // Runs when staffId changes

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSaveProfile = (updatedData) => {
    setProfileData({ ...profileData, ...updatedData });
  };

  const handleSavePermissions = useCallback((permissions) => {
    // Your permission saving logic here
  }, []); // Add any dependencies your handler needs

  const renderSettingsContent = () => {
    return (
      <ContentWrapper>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <SectionTitle>
              {tabValue === 0 ? 'Main Information' : tabValue === 1 ? 'Password & Security' : 'Permissions'}
            </SectionTitle>
            {tabValue === 0 ? (
              <InfoInformation data={profileData} onSave={handleSaveProfile} />
            ) : tabValue === 1 ? (
              <Security
                data={profileData}
                onSave={handleSaveProfile}
                staffId={router.query.staffId}
              />
            ) : (
              <Permission
                permissions={permissions}
                onChange={handleSavePermissions}
                userRoles={userRoles}
                staffId={staffId}
              />
            )}
          </>
        )}
      </ContentWrapper>
    );
  };

  const initials = profileData.fullName
    ?.split(' ')
    ?.map(name => name[0])
    ?.join('')
    ?.substring(0, 2)
    ?.toUpperCase() || '';

  if (loading && !profileData.fullName) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
        <PageHeader>
          <Avatar
            sx={{
              width: 90,
              height: 90,
              bgcolor: '#4489FE',
              color: '#fff',
              fontSize: '46px',
              mb: 2
            }}
          >
            {initials}
          </Avatar>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 500 }}>
            {profileData.fullName || "No Name Available"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {profileData.email || "No email available"}
          </Typography>
        </PageHeader>

        <StyledTabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
        >
          <StyledTab label="Main Information" />
          <StyledTab label="Settings" />
          <StyledTab label="Permissions" />
        </StyledTabs>

        {renderSettingsContent()}
      </Paper>
    </Container>
  );
}
