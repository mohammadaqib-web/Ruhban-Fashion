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
import Collapse from "@mui/material/Collapse";
import ListItemButton from "@mui/material/ListItemButton";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = ({ categories = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  const handleProductsClick = () => {
    setOpenProducts(!openProducts);
  };
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (linkTo) => {
    if (linkTo) navigate(linkTo);
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
          // backgroundColor: "#000000e6",
          // backgroundColor: "rgba(0,0,0,0.9)",
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
                <Button
                  onClick={() => navigate("/")}
                  sx={{
                    fontSize: 18,
                    backgroundColor: isActive("/") ? "white" : "transparent",
                    color: isActive("/") ? "black" : "white",
                    "&:hover": {
                      backgroundColor: isActive("/")
                        ? "white"
                        : "rgba(255,255,255,0.1)",
                    },
                    pl: 2.5,
                    pr: 2.5,
                  }}
                >
                  Home
                </Button>

                <Button
                  onClick={() => navigate("/about")}
                  sx={{
                    fontSize: 18,
                    backgroundColor: isActive("/about")
                      ? "white"
                      : "transparent",
                    color: isActive("/about") ? "black" : "white",
                    pl: 2.5,
                    pr: 2.5,
                  }}
                >
                  About Us
                </Button>

                <Button
                  color="inherit"
                  endIcon={<ExpandMoreIcon />}
                  onClick={handleMenuOpen}
                  sx={{ fontSize: 18 }}
                >
                  Products
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  PaperProps={{
                    sx: {
                      mt: 2.5,
                      px: 5,
                      py: 5,
                      minWidth: 500,
                      borderRadius: 2,
                      backgroundColor: "#000000e6",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 2,
                      color: "white",
                    }}
                  >
                    <MenuItem
                      onClick={() => handleMenuClose("/products")}
                      sx={{ fontSize: 16 }}
                    >
                      {"ALL PRODUCTS"}
                    </MenuItem>
                    {categories.categories.length > 0 &&
                      categories.categories
                        // ?.filter((cat) => cat.isActive)
                        ?.map((cat) => (
                          <MenuItem
                            key={cat._id}
                            onClick={() =>
                              handleMenuClose(
                                `/products/${cat.name}/${cat._id}`,
                              )
                            }
                            sx={{
                              backgroundColor: isActive(
                                `/products/${cat.name}/${cat._id}`,
                              )
                                ? "white"
                                : "transparent",
                              color: isActive(
                                `/products/${cat.name}/${cat._id}`,
                              )
                                ? "black"
                                : "white",
                            }}
                          >
                            {cat.name.toUpperCase()}
                          </MenuItem>
                        ))}
                  </Box>
                </Menu>

                <Button
                  onClick={() => navigate("/contact")}
                  sx={{
                    fontSize: 18,
                    backgroundColor: isActive("/contact")
                      ? "white"
                      : "transparent",
                    color: isActive("/contact") ? "black" : "white",
                    pl: 2.5,
                    pr: 2.5,
                  }}
                >
                  Contact Us
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
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 230,
            bgcolor: "#111",
            color: "white",
          },
        }}
      >
        <Box sx={{ height: "100%" }}>
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

          <List sx={{ mt: -1 }}>
            {/* HOME */}
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate("/");
                  setDrawerOpen(false);
                }}
                sx={{
                  backgroundColor: isActive("/") ? "white" : "transparent",
                  color: isActive("/") ? "black" : "white",
                  pt: 1.5,
                  pr: 1.5,
                }}
              >
                <ListItemText
                  primary="Home"
                  sx={{ "& .MuiTypography-root": { fontWeight: 600 } }}
                />
              </ListItemButton>
            </ListItem>

            {/* ABOUT */}
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate("/about");
                  setDrawerOpen(false);
                }}
                sx={{
                  backgroundColor: isActive("/about") ? "white" : "transparent",
                  color: isActive("/about") ? "black" : "white",
                  pt: 1.5,
                  pr: 1.5,
                }}
              >
                <ListItemText
                  primary="About Us"
                  sx={{ "& .MuiTypography-root": { fontWeight: 600 } }}
                />
              </ListItemButton>
            </ListItem>

            {/* PRODUCTS DROPDOWN */}
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleProductsClick}
                sx={{ pt: 1.5, pr: 1.5 }}
              >
                <ListItemText
                  primary="Products"
                  sx={{ "& .MuiTypography-root": { fontWeight: 600 } }}
                />
                {openProducts ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            <Collapse in={openProducts} timeout="auto" unmountOnExit>
              {/* ALL PRODUCTS */}
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    pl: 4,
                    backgroundColor: isActive("/products")
                      ? "white"
                      : "transparent",
                    color: isActive("/products") ? "black" : "white",
                    pt: 1.5,
                    pr: 1.5,
                  }}
                  onClick={() => {
                    navigate("/products");
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemText primary="All Products" />
                </ListItemButton>
              </ListItem>

              {/* DYNAMIC CATEGORIES */}
              {categories?.categories?.length > 0 &&
                categories.categories.map((cat) => {
                  const categoryPath = `/products/${cat.name}/${cat._id}`;

                  return (
                    <ListItem key={cat._id} disablePadding>
                      <ListItemButton
                        sx={{
                          pl: 4,
                          backgroundColor: isActive(categoryPath)
                            ? "white"
                            : "transparent",
                          color: isActive(categoryPath) ? "black" : "white",
                          pt: 1.5,
                          pr: 1.5,
                        }}
                        onClick={() => {
                          navigate(categoryPath);
                          setDrawerOpen(false);
                        }}
                      >
                        <ListItemText
                          primary={cat.name}
                          sx={{
                            "& .MuiTypography-root": {
                              fontSize: 16,
                              textTransform: "capitalize",
                            },
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
            </Collapse>

            {/* CONTACT */}
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate("/contact");
                  setDrawerOpen(false);
                }}
                sx={{
                  backgroundColor: isActive("/contact")
                    ? "white"
                    : "transparent",
                  color: isActive("/contact") ? "black" : "white",
                  pt: 1.5,
                  pr: 1.5,
                }}
              >
                <ListItemText
                  primary="Contact Us"
                  sx={{ "& .MuiTypography-root": { fontWeight: 600 } }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
