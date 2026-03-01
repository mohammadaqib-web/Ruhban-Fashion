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
  CircularProgress,
  TextField,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
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
import axios from "axios";
import { useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartCount,
  // selectCartTotal,
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
} from "../features/auth/cartSlice";
import { useDispatch } from "react-redux";
import Backdrop from "@mui/material/Backdrop";
import userTokenValidity from "../utils/UserTokenValidity";
import { logout } from "../features/auth/authSlice";

const Navbar = ({ categories = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const token = useSelector((state) => state.auth.token);
  const validUser = userTokenValidity();

  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartCount = useSelector(selectCartCount);

  const [cartOpen, setCartOpen] = useState(false);
  const [validatedCart, setValidatedCart] = useState([]);
  const [validating, setValidating] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState("cart");

  const [processing, setProcessing] = useState(false);
  const [verifyingPincode, setVerifyingPincode] = useState(false);

  const [address, setAddress] = useState({
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [addressError, setAddressError] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  const handleProductsClick = () => {
    setOpenProducts(!openProducts);
  };
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (linkTo) => {
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

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_APP_API}/products/search?keyword=${searchQuery}`,
        );

        setSearchResults(data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  useEffect(() => {
    const validateCart = async () => {
      if (cartItems.length === 0) {
        setValidatedCart([]);
        return;
      }

      try {
        setValidating(true);

        const { data } = await axios.post(
          `${import.meta.env.VITE_APP_API}/products/cart/validate`,
          { items: cartItems },
        );

        setValidatedCart(data);
        if (data.length <= 0) dispatch(clearCart());
      } catch (error) {
        dispatch(clearCart());
        // console.error("Cart validation failed", error);
      } finally {
        setValidating(false);
      }
    };

    if (cartOpen) {
      validateCart();
    }
  }, [cartOpen, cartItems]);

  const hasStockIssue = validatedCart.some((item) => item.availableQty === 0);
  const subtotal = validatedCart.reduce(
    (acc, item) => acc + item.price * item.availableQty,
    0,
  );

  const handlePayment = async () => {
    if (!validUser) {
      navigate(`/auth?redirect=${location.pathname}`);
      return;
    }

    if (!validatedCart.length) return;

    setProcessing(true);

    try {
      // 1️⃣ Create Razorpay Order
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API}/orders/razorpay/create`,
        { amount: subtotal },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const options = {
        key: import.meta.env.VITE_APP_razorpay_key_id, // ✅ FIXED ENV NAME
        amount: data.amount,
        currency: "INR",
        order_id: data.id,

        // ✅ Success handler
        handler: async function (response) {
          try {
            // 2️⃣ Verify Payment
            await axios.post(
              `${import.meta.env.VITE_APP_API}/orders/razorpay/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            );

            // 3️⃣ Create Final Order
            await axios.post(
              `${import.meta.env.VITE_APP_API}/orders`,
              {
                orderItems: validatedCart.map((item) => ({
                  product: item.productId,
                  name: item.name,
                  size: item.size,
                  quantity: item.availableQty,
                  price: item.price,
                })),
                totalAmount: subtotal,
                shippingAddress: address,
                payment: {
                  paymentMethod: "razorpay",
                  paymentStatus: "paid",
                  paymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                },
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            );

            dispatch(clearCart());
            handleCartClose();
          } catch (err) {
            console.error("Verification/Order failed:", err);
          } finally {
            setProcessing(false); // ✅ always release UI
          }
        },

        // ✅ IMPORTANT: Handle manual close
        modal: {
          ondismiss: function () {
            console.log("User closed Razorpay popup");
            setProcessing(false); // ✅ release UI
          },
        },

        theme: {
          color: "#000000",
        },
      };

      const rzp = new window.Razorpay(options);

      // ✅ Handle payment failure
      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        setProcessing(false);
      });

      rzp.open();
    } catch (err) {
      console.error("Payment initialization failed:", err);
      setProcessing(false);
    }
  };

  const handleCOD = async () => {
    try {
      setProcessing(true);

      await axios.post(
        `${import.meta.env.VITE_APP_API}/orders`,
        {
          orderItems: validatedCart.map((item) => ({
            product: item.productId,
            name: item.name,
            size: item.size,
            quantity: item.availableQty,
            price: item.price,
          })),
          totalAmount: subtotal,
          shippingAddress: address,
          payment: {
            paymentMethod: "cod",
            paymentStatus: "pending",
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      dispatch(clearCart());
      handleCartClose();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleCartClose = () => {
    setCartOpen(false);
    setCheckoutStep("cart");
  };

  const isBallia = address.city?.trim().toLowerCase() === "ballia";

  const getVerifiedCityName = async (pincode, city) => {
    try {
      const res = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );

      if (res.data[0].Status !== "Success") return false;

      return res.data[0].PostOffice.some((po) => {
        const name = po.Name.toLowerCase();
        const district = po.District.toLowerCase();
        const inputCity = city.toLowerCase().trim();

        return name.includes(inputCity) || district.includes(inputCity);
      });
    } catch {
      return false;
    }
  };

  const validateAddress = async () => {
    if (!address.addressLine1.trim()) {
      return "Address is required";
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      return "Pincode must be 6 digits";
    }
    if (!address.city.trim()) {
      return "City is required";
    }

    const isValid = await getVerifiedCityName(address.pincode, address.city);

    if (!isValid) {
      return "City does not match pincode";
    }

    return null;
  };

  const handlePincodeChange = async (value) => {
    if (!/^\d*$/.test(value)) return;
    if (value.length > 6) return;

    setAddress((prev) => ({
      ...prev,
      pincode: value,
    }));

    if (value.length === 6) {
      try {
        setVerifyingPincode(true); // ✅ start freeze

        const res = await axios.get(
          `https://api.postalpincode.in/pincode/${value}`,
        );

        if (res.data[0].Status === "Success" && res.data[0].PostOffice) {
          const po = res.data[0].PostOffice[0];

          setAddress((prev) => ({
            ...prev,
            city: po.District,
            state: po.State,
          }));

          setAddressError("");
        } else {
          setAddressError("Invalid pincode");
        }
      } catch {
        setAddressError("Unable to verify pincode");
      } finally {
        setVerifyingPincode(false); // ✅ release freeze
      }
    } else {
      setAddress((prev) => ({
        ...prev,
        city: "",
        state: "",
      }));
    }
  };

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
                      onClick={() => handleMenuItemClick("/products")}
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
                              handleMenuItemClick(
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
              <IconButton color="inherit" onClick={() => setSearchOpen(true)}>
                <SearchIcon />
              </IconButton>

              <IconButton
                color="inherit"
                onClick={() => {
                  if (validUser) navigate("/profile");
                  else {
                    dispatch(logout());
                    navigate(`/auth?redirect=${location.pathname}`);
                  }
                }}
              >
                <PersonOutlineIcon />
              </IconButton>

              <IconButton color="inherit" onClick={() => setCartOpen(true)}>
                <Badge badgeContent={cartCount} color="error">
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

      <Drawer
        anchor="top"
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        PaperProps={{
          sx: {
            height: { xs: "100vh", md: "100vh" },
            backgroundColor: "black",
            color: "white",
          },
        }}
      >
        {/* Close Button */}
        <Box sx={{ textAlign: "right", pr: 1, pt: 1 }}>
          <IconButton
            onClick={() => setSearchOpen(false)}
            sx={{ color: "white" }}
          >
            <CloseIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Box>

        <Box
          display="flex"
          height="100%"
          sx={{
            px: { xs: 3, md: 10 },
            pb: 4,
          }}
        >
          {/* ---------------- LEFT CATEGORY PANEL ---------------- */}
          <Box
            sx={{
              width: "15%",
              pr: 4,
              borderRight: "1px solid grey",
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
            }}
          >
            <Typography
              sx={{
                mb: 2,
                cursor: "pointer",
                fontSize: 18,
                "&:hover": { color: "brown", ml: 1 },
                transition: "0.3s",
              }}
              onClick={() => {
                navigate("/products");
                setSearchOpen(false);
              }}
            >
              ALL PRODUCTS
            </Typography>

            {categories?.categories?.map((cat) => (
              <Typography
                key={cat._id}
                sx={{
                  mb: 2,
                  cursor: "pointer",
                  fontSize: 18,
                  "&:hover": { color: "brown", ml: 1 },
                  transition: "0.3s",
                }}
                onClick={() => {
                  navigate(`/products/${cat.name}/${cat._id}`);
                  setSearchOpen(false);
                }}
              >
                {cat.name.toUpperCase()}
              </Typography>
            ))}
          </Box>

          {/* ---------------- RIGHT SEARCH PANEL ---------------- */}
          <Box sx={{ flex: 1, pl: { xs: 0, md: 6 } }}>
            {/* Search Input */}
            <Box display="flex" alignItems="center">
              <input
                autoFocus
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchResults([]);
                  if (e.target.value !== "") {
                    setLoading(true);
                  }
                }}
                style={{
                  width: "100%",
                  fontSize: "26px",
                  border: "none",
                  borderBottom: "2px solid brown",
                  outline: "none",
                  background: "transparent",
                  paddingBottom: "10px",
                  color: "white",
                }}
              />

              {/* <IconButton
                onClick={() => setSearchQuery("")}
                sx={{ color: "white" }}
              >
                <CloseIcon />
              </IconButton> */}
            </Box>

            {/* Results Scroll Area */}
            <Box
              sx={{
                mt: 4,
                maxHeight: "80vh",
                overflowY: "auto",
                pr: 2,
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {loading && <CircularProgress sx={{ color: "white" }} />}

              {searchResults.map((product) => (
                <Box
                  key={product._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    mb: 3,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate(`/product/${product._id}`);
                    setSearchOpen(false);
                  }}
                >
                  <img
                    src={product.images?.[0]?.url}
                    width="60"
                    height="60"
                    style={{ objectFit: "cover", borderRadius: 8 }}
                  />
                  <Typography sx={{ fontSize: 18 }}>{product.name}</Typography>
                </Box>
              ))}

              {!loading && searchQuery && searchResults.length === 0 && (
                <Typography sx={{ mt: 3, color: "gray" }}>
                  No products found
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Drawer>

      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => handleCartClose()}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 400 },
            p: 3,
          },
        }}
      >
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">Shopping Cart ({cartCount})</Typography>
          <IconButton onClick={() => handleCartClose()}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        {checkoutStep === "cart" &&
          (cartItems.length === 0 ? (
            <Typography>Your cart is empty</Typography>
          ) : (
            <>
              <Box sx={{ flex: 1 }}>
                {validatedCart.map((item) => (
                  <Box key={item.productId + item.sizeId}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        mb: 3,
                      }}
                    >
                      <img
                        src={item.image}
                        width="80"
                        height="80"
                        style={{ objectFit: "cover", borderRadius: 8 }}
                      />

                      <Box sx={{ flex: 1 }}>
                        <Typography fontWeight="bold">{item.name}</Typography>

                        <Typography variant="body2">
                          Size: {item.size}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 1,
                            gap: 1,
                          }}
                        >
                          <Button
                            size="small"
                            onClick={() =>
                              dispatch(
                                decreaseQty({
                                  productId: item.productId,
                                  sizeId: item.sizeId,
                                }),
                              )
                            }
                          >
                            -
                          </Button>

                          {item.availableQty}

                          <Button
                            size="small"
                            onClick={() =>
                              dispatch(
                                increaseQty({
                                  productId: item.productId,
                                  sizeId: item.sizeId,
                                }),
                              )
                            }
                          >
                            +
                          </Button>
                        </Box>

                        {item.availableQty < item.requestedQty && (
                          <Typography color="error" fontSize={13}>
                            Only {item.availableQty} available
                          </Typography>
                        )}

                        {item.stock === 0 && (
                          <Typography color="error" fontSize={13}>
                            Out of Stock
                          </Typography>
                        )}

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography sx={{ mt: 1 }}>
                            ₹ {item.price * item.availableQty}
                          </Typography>

                          <Typography
                            sx={{
                              mt: 1,
                              cursor: "pointer",
                              color: "red",
                              fontSize: 14,
                              textDecoration: "underline",
                            }}
                            onClick={() =>
                              dispatch(
                                removeFromCart({
                                  productId: item.productId,
                                  sizeId: item.sizeId,
                                }),
                              )
                            }
                          >
                            Remove
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                  </Box>
                ))}
              </Box>

              <Divider />

              <Box sx={{ mt: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography fontWeight="bold">Subtotal</Typography>
                  <Typography fontWeight="bold">₹ {subtotal}</Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  disabled={hasStockIssue || validatedCart.length === 0}
                  sx={{
                    bgcolor: "black",
                    "&:hover": { bgcolor: "black" },
                  }}
                  onClick={() => {
                    if (validatedCart.length === 0) return;

                    setCheckoutStep("address");
                  }}
                >
                  BUY NOW
                </Button>
              </Box>
            </>
          ))}

        {checkoutStep === "address" && (
          <Box mt={2}>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Shipping Address
            </Typography>

            <TextField
              fullWidth
              label="Address"
              sx={{ mb: 2 }}
              value={address.addressLine1}
              onChange={(e) =>
                setAddress({ ...address, addressLine1: e.target.value })
              }
            />

            <TextField
              fullWidth
              sx={{ mt: 1 }}
              label="Pincode"
              value={address.pincode}
              onChange={(e) => handlePincodeChange(e.target.value)}
              inputProps={{
                maxLength: 6,
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
            />

            <Box display="flex" gap={2} mt={3}>
              <TextField
                fullWidth
                label="City"
                value={address.city}
                // onChange={(e) =>
                //   setAddress({ ...address, city: e.target.value })
                // }
                aria-readonly
                disabled
              />
              <TextField
                fullWidth
                label="State"
                value={address.state}
                // onChange={(e) =>
                //   setAddress({ ...address, state: e.target.value })
                // }
                aria-readonly
                disabled
              />
            </Box>

            <Box display="flex" gap={2} mt={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setCheckoutStep("cart")}
              >
                Back
              </Button>

              <Button
                fullWidth
                variant="contained"
                onClick={async () => {
                  const error = await validateAddress();

                  if (error) {
                    setAddressError(error);
                    return;
                  }

                  setAddressError("");
                  setCheckoutStep("payment");
                }}
              >
                Continue
              </Button>
            </Box>

            {addressError && (
              <Typography color="error" mt={2}>
                {addressError}
              </Typography>
            )}
          </Box>
        )}

        {checkoutStep === "payment" && (
          <Box mt={2}>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Payment Options
            </Typography>

            <Button
              fullWidth
              variant="contained"
              sx={{ mb: 2 }}
              onClick={handlePayment}
            >
              Pay Online
            </Button>

            {isBallia && (
              <Button
                fullWidth
                variant="outlined"
                disabled={loading}
                onClick={handleCOD}
                sx={{
                  py: 1.5,
                  color: "#3B2416",
                  borderColor: "#3B2416",
                  "&:hover": {
                    borderColor: "#3B2416",
                    backgroundColor: "rgba(59,36,22,0.05)",
                  },
                }}
              >
                {loading ? <CircularProgress size={22} /> : "Cash On Delivery"}
              </Button>
            )}

            <Button
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => setCheckoutStep("address")}
            >
              Back
            </Button>
          </Box>
        )}
      </Drawer>

      <Backdrop
        open={processing || verifyingPincode}
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 2000,
          backdropFilter: "blur(4px)",
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default Navbar;
