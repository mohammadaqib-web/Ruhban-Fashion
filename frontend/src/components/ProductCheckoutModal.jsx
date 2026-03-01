import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import userTokenValidity from "../utils/UserTokenValidity";
import { useSelector } from "react-redux";
import { Stepper, Step, StepLabel } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

const API = import.meta.env.VITE_APP_API;

const ProductCheckoutModal = ({
  open,
  onClose,
  product,
  selectedSize,
  qty,
}) => {
  const { token } = useSelector((state) => state.auth);
  const isTokenValid = userTokenValidity();
  const navigate = useNavigate();

  const [step, setStep] = useState("address"); // address | payment
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const finalPrice = selectedSize.discountPrice || selectedSize.price;
  const totalAmount = finalPrice * qty;

  const orderItems = [
    {
      product: product._id,
      name: product.name,
      size: selectedSize.size,
      quantity: qty,
      price: finalPrice,
    },
  ];

  const validateAddress = () => {
    if (!address.city || !address.pincode) {
      return "City and Pincode required";
    }

    if (!/^[1-9][0-9]{5}$/.test(address.pincode)) {
      return "Invalid pincode";
    }

    return null;
  };

  const handlePayment = async () => {
    if (!token || !isTokenValid) {
      navigate("/auth");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Create Razorpay Order
      const { data } = await axios.post(
        `${API}/orders/razorpay/create`,
        { amount: totalAmount },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount,
        currency: "INR",
        order_id: data.id,

        handler: async function (response) {
          try {
            // 2️⃣ Verify Payment
            await axios.post(
              `${API}/orders/razorpay/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } },
            );

            // 3️⃣ Create Final Order
            await axios.post(
              `${API}/orders`,
              {
                orderItems,
                totalAmount,
                shippingAddress: address,
                payment: {
                  paymentMethod: "razorpay",
                  paymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                },
              },
              { headers: { Authorization: `Bearer ${token}` } },
            );

            toast.success("Order placed successfully 🎉");
            handleClose();
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCOD = async () => {
    if (address.city?.toLowerCase() !== "ballia") {
      toast.warning("Cash on Delivery available only in Ballia");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${API}/orders`,
        {
          orderItems,
          totalAmount,
          shippingAddress: address,
          payment: {
            paymentMethod: "cod",
          },
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Order placed successfully 🎉");
      handleClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep("address");
      setLoading(false);
    }, 200);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 1,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 1,
        }}
      >
        {step === "address" ? "Checkout" : "Payment"}

        <IconButton
          onClick={handleClose}
          sx={{
            color: "grey.600",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.05)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* 🔹 STEP INDICATOR */}
        <Stepper
          activeStep={step === "address" ? 0 : 1}
          alternativeLabel
          sx={{
            mb: 2,
            "& .MuiStepLabel-label": {
              fontSize: 13,
              fontWeight: 500,
            },
            "& .MuiStepIcon-root": {
              fontSize: 20,
            },
            "& .MuiStepIcon-root.Mui-active": {
              color: "black",
            },
            "& .MuiStepIcon-root.Mui-completed": {
              color: "black",
            },
            "& .MuiStepConnector-line": {
              borderTopWidth: 2,
            },
          }}
        >
          <Step>
            <StepLabel>Shipping</StepLabel>
          </Step>
          <Step>
            <StepLabel>Payment</StepLabel>
          </Step>
        </Stepper>

        {/* 🔹 PRODUCT SUMMARY */}
        <Box
          sx={{
            background: "#f9f9f9",
            borderRadius: 3,
            p: 2,
            mb: 0,
          }}
        >
          <Typography fontWeight={600}>{product.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedSize.size} × {qty}
          </Typography>
          <Typography fontWeight={700} mt={1}>
            Total: <span style={{ fontWeight: "bold" }}>₹ {totalAmount}</span>
          </Typography>
        </Box>

        {/* ---------------- ADDRESS STEP ---------------- */}
        {step === "address" && (
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Address"
              fullWidth
              variant="outlined"
              value={address.addressLine1}
              onChange={(e) =>
                setAddress({ ...address, addressLine1: e.target.value })
              }
            />

            {/* <TextField
              label="Address Line 2"
              fullWidth
              variant="outlined"
              value={address.addressLine2}
              onChange={(e) =>
                setAddress({ ...address, addressLine2: e.target.value })
              }
            /> */}

            <Box display="flex" gap={2}>
              <TextField
                label="City"
                fullWidth
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
              />
              <TextField
                label="State"
                fullWidth
                value={address.state}
                onChange={(e) =>
                  setAddress({ ...address, state: e.target.value })
                }
              />
            </Box>

            <TextField
              label="Pincode"
              fullWidth
              value={address.pincode}
              onChange={(e) =>
                setAddress({ ...address, pincode: e.target.value })
              }
            />

            <Button
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 3,
                backgroundColor: "black",
              }}
              onClick={() => {
                const error = validateAddress();
                if (error) {
                  toast.error(error);
                  return;
                }
                setStep("payment");
              }}
            >
              Continue to Payment
            </Button>
          </Box>
        )}

        {/* ---------------- PAYMENT STEP ---------------- */}
        {step === "payment" && (
          <Box>
            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mb: 2,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 600,
                backgroundColor: "black",
              }}
              disabled={loading}
              onClick={handlePayment}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Pay Online"
              )}
            </Button>

            {address.city?.toLowerCase() === "ballia" && (
              <Button
                fullWidth
                variant="outlined"
                size="large"
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                }}
                disabled={loading}
                onClick={handleCOD}
              >
                {loading ? <CircularProgress size={22} /> : "Cash on Delivery"}
              </Button>
            )}

            <Button
              fullWidth
              variant="text"
              sx={{ mt: 2, color: "black" }}
              onClick={() => {
                if (!loading) setStep("address");
              }}
            >
              ← Back
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductCheckoutModal;
