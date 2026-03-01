import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import axios from "axios";
import dayjs from "dayjs";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const params = new URLSearchParams(location.search);
  const redirect = params.get("redirect");

  const [formData, setFormData] = useState({
    name: "",
    number: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
  };

  // ================= LOGIN =================
  const handleLogin = async () => {
    if (!formData.number || !formData.password) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_APP_API}/auth/login`,
        {
          number: formData.number,
          password: formData.password,
        },
      );

      dispatch(
        loginSuccess({
          user: res.data.user,
          token: res.data.token,
          loginTime: dayjs().valueOf(),
        }),
      );

      toast.success("Login Successful!");
      navigate(redirect || "/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= SIGNUP =================
  const handleSignup = async () => {
    if (!formData.name || !formData.number || !formData.password) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_APP_API}/auth/registerWithoutOTP`,
        formData,
      );

      dispatch(
        loginSuccess({
          user: res.data.user,
          token: res.data.token,
          loginTime: dayjs().valueOf(),
        }),
      );

      toast.success("Account created successfully!");
      navigate(redirect || "/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#111",
      }}
    >
      <Card
        sx={{
          width: 420,
          p: 2,
          m: 2,
          borderRadius: 3,
          backgroundColor: "#1c1c1c",
          boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={3}
            sx={{ color: "#fff" }}
          >
            {isLogin ? "LOGIN" : "CREATE ACCOUNT"}
          </Typography>

          {/* Name field (Register only) */}
          {!isLogin && (
            <TextField
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
              label="Full Name"
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#aaa" } }}
              sx={inputStyle}
            />
          )}

          <TextField
            fullWidth
            name="number"
            value={formData.number}
            onChange={handleChange}
            label="Phone Number"
            margin="normal"
            variant="outlined"
            InputLabelProps={{ style: { color: "#aaa" } }}
            sx={inputStyle}
          />

          <TextField
            fullWidth
            name="password"
            value={formData.password}
            onChange={handleChange}
            label="Password"
            type="password"
            margin="normal"
            variant="outlined"
            InputLabelProps={{ style: { color: "#aaa" } }}
            sx={inputStyle}
          />

          <Button
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.2,
              fontWeight: "bold",
              backgroundColor: "#fff",
              color: "#000",
              "&:hover": { backgroundColor: "#ddd" },
            }}
            onClick={isLogin ? handleLogin : handleSignup}
          >
            {loading ? (
              <CircularProgress size={22} sx={{ color: "#000" }} />
            ) : isLogin ? (
              "LOGIN"
            ) : (
              "SIGN UP"
            )}
          </Button>

          <Typography
            variant="body2"
            mt={3}
            textAlign="center"
            sx={{ color: "#aaa" }}
          >
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <Link
              component="button"
              underline="none"
              onClick={toggleAuthMode}
              sx={{
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
                "&:hover": { color: "#ccc" },
              }}
            >
              {isLogin ? "Create Account" : "Sign In"}
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    "& fieldset": { borderColor: "#444" },
    "&:hover fieldset": { borderColor: "#888" },
    "&.Mui-focused fieldset": { borderColor: "#fff" },
  },
  "& .MuiInputBase-input": { color: "#fff" },
};

export default Auth;
