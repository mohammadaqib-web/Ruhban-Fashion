import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Button,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
// import bgPattern from "../assets/bg.webp";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const sections = ["Profile", "Orders", "Change Password", "Logout"];
import { useSelector } from "react-redux";
import axios from "axios";

const ProfileSection = ({ user }) => (
  <>
    <Typography variant="h6" fontWeight={700} mb={3}>
      Profile Information
    </Typography>

    <Divider sx={{ backgroundColor: "#fff", borderWidth: 1, mt: -3, mb: 3 }} />

    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Info label="Full Name" value={user?.name || "Not added"} />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Info label="Phone Number" value={user?.number || "Not added"} />
      </Grid>
    </Grid>
  </>
);

const Info = ({ label, value }) => (
  <Box>
    <Typography fontSize={13} color="gray">
      {label}
    </Typography>
    <Typography fontWeight={600}>{value}</Typography>
  </Box>
);

const OrdersSection = ({ orders }) => (
  <>
    <Typography variant="h6" fontWeight={700} mb={3}>
      My Orders
    </Typography>

    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      {orders?.map((order) =>
        order.orderItems.map((item) => {
          const statusStyles = {
            pending: {
              bg: "rgba(255, 193, 7, 0.15)",
              color: "#FFC107",
            },
            processing: {
              bg: "rgba(33, 150, 243, 0.15)",
              color: "#2196F3",
            },
            shipped: {
              bg: "rgba(156, 39, 176, 0.15)",
              color: "#9C27B0",
            },
            delivered: {
              bg: "rgba(76, 175, 80, 0.15)",
              color: "#4CAF50",
            },
          };

          const currentStatus =
            statusStyles[order.status] || statusStyles.pending;

          return (
            <Box sx={{ width: { xs: "100%", sm: 185 } }} key={item._id}>
              <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={3} alignItems="center">
                  {/* IMAGE LEFT */}
                  <Grid size={{ xs: 12 }}>
                    <Box
                      component="img"
                      src={item.product?.images[0]?.url}
                      alt={item.product?.name}
                      sx={{
                        width: "100%",
                        minHeight: "200px",
                        maxHeight: "200px",
                        borderRadius: 2,
                        objectFit: "contain",
                      }}
                    />
                  </Grid>

                  {/* DETAILS RIGHT */}
                  <Grid size={{ xs: 12 }} sx={{ mt: -2 }}>
                    <Typography
                      fontWeight={600}
                      sx={{
                        mb: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.product?.name}
                    </Typography>

                    <Box mt={1}>
                      <Typography
                        fontSize={13}
                        sx={{ color: "black", fontWeight: "bold" }}
                      >
                        Order ID:{" "}
                        <span style={{ color: "black", fontWeight: "normal" }}>
                          #{order._id.slice(-6)}
                        </span>
                      </Typography>

                      <Typography
                        fontSize={13}
                        sx={{ color: "black", mt: 0.5, fontWeight: "bold" }}
                      >
                        Amount:{" "}
                        <span style={{ color: "black", fontWeight: "normal" }}>
                          ₹{order.totalAmount}
                        </span>
                      </Typography>

                      <Typography
                        fontSize={13}
                        sx={{ color: "black", mt: 0.5, fontWeight: "bold" }}
                      >
                        Payment:{" "}
                        <span style={{ color: "black", fontWeight: "normal" }}>
                          {order.payment?.paymentMethod?.toUpperCase() !== "COD"
                            ? "Online"
                            : "COD"}
                        </span>
                      </Typography>

                      <Box display="flex" mt={0.5} alignItems="center" gap={1}>
                        <Typography
                          fontSize={13}
                          sx={{ color: "black", fontWeight: "bold" }}
                        >
                          Status:
                        </Typography>

                        <Typography
                          fontSize={13}
                          fontWeight={600}
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            backgroundColor: currentStatus.bg,
                            color: currentStatus.color,
                            textTransform: "capitalize",
                          }}
                        >
                          {order.status}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          );
        }),
      )}
    </Box>
  </>
);

const ChangePassword = ({
  showPassword,
  setShowPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handleChangePassword,
}) => (
  <>
    <Typography variant="h6" fontWeight={700} mb={3}>
      Change Password
    </Typography>

    <Grid container spacing={3} maxWidth={500}>
      <Grid size={{ xs: 12, md: 8 }}>
        <TextField
          fullWidth
          // label="New Password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          type={showPassword ? "text" : "password"}
          variant="outlined"
          sx={{ backgroundColor: "#fff", borderRadius: 1 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <TextField
          fullWidth
          // label="Re-enter New Password"
          placeholder="Re-enter New Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          sx={{ backgroundColor: "#fff", borderRadius: 1 }}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#fff",
            color: "#000",
            fontWeight: 600,
            px: 4,
            "&:hover": {
              backgroundColor: "#fff",
            },
          }}
          onClick={handleChangePassword}
        >
          Update Password
        </Button>
      </Grid>
    </Grid>
  </>
);

const Account = () => {
  const [active, setActive] = useState("Profile");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const [orders, setOrders] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (active === "Orders") {
      fetchOrders();
    }
  }, [active]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/orders/my`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_APP_API}/auth/change-password`,
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.log({ err });
      toast.error(err.response?.data?.message || "Error updating password");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* LEFT SIDEBAR */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper sx={{ backgroundColor: "black", color: "#fff" }}>
              <Box sx={{ p: 2 }}>
                <Typography fontWeight={700}>{user?.name}</Typography>
                <Typography fontSize={13} color="#ccc">
                  {user?.number}
                </Typography>
              </Box>

              <Divider />

              <List>
                {sections.map((item) => (
                  <ListItemButton
                    key={item}
                    selected={active === item}
                    onClick={() => {
                      if (item !== "Logout") setActive(item);
                      else {
                        dispatch(logout());
                        toast.success("You are logged out!");
                        navigate("/auth");
                      }
                    }}
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "#fff",
                        color: "#000",
                      },
                      "&:hover": {
                        backgroundColor: "#fff",
                        color: "#000",
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "#fff",
                        color: "#000",
                      },
                    }}
                  >
                    <ListItemText primary={item} />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* RIGHT CONTENT */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Paper sx={{ p: 4, backgroundColor: "black", color: "#fff" }}>
              {active === "Profile" && <ProfileSection user={user} />}
              {active === "Orders" && <OrdersSection orders={orders} />}
              {active === "Change Password" && (
                <ChangePassword
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  newPassword={newPassword}
                  setNewPassword={setNewPassword}
                  confirmPassword={confirmPassword}
                  setConfirmPassword={setConfirmPassword}
                  handleChangePassword={handleChangePassword}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Account;
