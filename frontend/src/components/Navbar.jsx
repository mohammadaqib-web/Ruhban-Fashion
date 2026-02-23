import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Badge,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  Divider,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import logo from "../assets/logo-removebg.png";

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        // Always show near top
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setShowNavbar(false);
      } else {
        // Scrolling up
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* 🔵 Main Navbar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "rgba(0,0,0,0.9)",
          top: showNavbar ? 0 : "-80px",
          transition: "top 0.3s ease-in-out",
          backdropFilter: "blur(5px)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            {/* LEFT SECTION */}
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={toggleDrawer(true)}
                sx={{ ml: -2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box
              sx={{
                ml: { xs: -12, sm: 10, md: 0 },
                mb: -2.5,
                mt: -1,
              }}
            >
              <Box component={"img"} src={logo} width={"100px"} />
            </Box>

            {/* CENTER LOGO */}
            {!isMobile && (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button color="inherit" sx={{ fontSize: 18 }}>
                  Home
                </Button>

                <Button
                  color="inherit"
                  endIcon={<ExpandMoreIcon />}
                  onClick={handleMenuOpen}
                  sx={{ fontSize: 18 }}
                >
                  Top Wear
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleMenuClose} sx={{ fontSize: 18 }}>
                    T-Shirts
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose} sx={{ fontSize: 18 }}>
                    Shirts
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose} sx={{ fontSize: 18 }}>
                    Jackets
                  </MenuItem>
                </Menu>

                <Button color="inherit" sx={{ fontSize: 18 }}>
                  Bottom Wear
                </Button>
                <Button color="inherit" sx={{ fontSize: 18 }}>
                  Combo
                </Button>
                <Button color="inherit" sx={{ fontSize: 18 }}>
                  Footwear
                </Button>
              </Box>
            )}

            {/* RIGHT ICONS */}
            <Box sx={{ mr: -2 }}>
              <IconButton color="inherit">
                <SearchIcon />
              </IconButton>

              <IconButton color="inherit">
                <PersonOutlineIcon />
              </IconButton>

              <IconButton color="inherit">
                <Badge badgeContent={2} color="error">
                  <ShoppingCartOutlinedIcon />
                </Badge>
              </IconButton>
            </Box>
          </Toolbar>
        </Container>

        <Divider sx={{ bgcolor: "#333" }} />
      </AppBar>

      {/* 📱 MOBILE DRAWER */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 230,
            bgcolor: "#111",
            height: "100%",
            color: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "right",
              mt: 0.5,
              mr: 0.5,
            }}
          >
            <IconButton onClick={toggleDrawer(false)} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* <Typography variant="h6">Menu</Typography> */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box component={"img"} src={logo} width={"140px"} mt={-5} />
          </Box>
          {/* <Divider sx={{ bgcolor: "#333" }} /> */}

          <List sx={{ mt: -3 }}>
            {["Home", "Top Wear", "Bottom Wear", "Combo", "Footwear"].map(
              (text) => (
                <ListItem button key={text}>
                  <ListItemText
                    primary={text}
                    sx={{
                      "& .MuiTypography-root": {
                        fontSize: 18,
                        fontWeight: 500,
                      },
                    }}
                  />
                </ListItem>
              ),
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
