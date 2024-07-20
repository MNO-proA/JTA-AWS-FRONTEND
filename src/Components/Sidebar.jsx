/* eslint-disable react/prop-types */
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  SettingsOutlined,
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
  PublicOutlined,
  PointOfSaleOutlined,
  TodayOutlined,
  CalendarMonthOutlined,
  AdminPanelSettingsOutlined,
  TrendingUpOutlined,
  PieChartOutlined,
} from "@mui/icons-material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaymentsIcon from '@mui/icons-material/Payments';
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import logo from '/1024x1024.png'


const navItems = [
  {
    text: "Overview",
    icon: <Groups2Outlined />,
  },
  //  {
  //   text: "Staffs",
  //   icon: <Groups2Outlined />,
  // },
  {
    text: "Shifts",
    icon: <TodayOutlined />,
  },
  {
    text: "Expense",
    icon: <PaymentsIcon/>,
  }, 
  {
    text: "Dashboard",
    icon: <DashboardIcon/>,
  },
  // {
  //   text: "Customers",
  //   icon: <Groups2Outlined />,
  // },
  // {
  //   text: "Transactions",
  //   icon: <ReceiptLongOutlined />,
  // },
  // {
  //   text: "Geography",
  //   icon: <PublicOutlined />,
  // },
  // {
  //   text: "Sales",
  //   icon: null,
  // },
  
  // {
  //   text: "Daily",
  //   icon: <TodayOutlined />,
  // },
  
  // {
  //   text: "Admin",
  //   icon: <AdminPanelSettingsOutlined />,
  // },
];

const Sidebar = ({
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSixing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center" gap="0.5rem">
                <Box
                component="img"
                alt="profile"
                src={logo}
                height="80px"
                width="80px"
                sx={{ objectFit: "cover" }}
              />
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                      {text}
                    </Typography>
                  );
                }
                const lcText = text.toLowerCase();

                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${lcText}`);
                        setActive(lcText);
                      }}
                      sx={{
                        backgroundColor:
                          active === lcText
                            ? theme.palette.secondary[300]
                            : "transparent",
                        '&:hover': {
                                  backgroundColor: theme.palette.secondary[200], 
                                  color: theme.palette.primary[900], 
                                },
                        
                        color:
                          active === lcText
                            ? theme.palette.primary[900]
                            : theme.palette.secondary[100],
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color:
                            active === lcText
                              ? theme.palette.primary[900]
                              : theme.palette.secondary[200],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === lcText && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>

        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
