import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Orders = () => {
  const token = useSelector((state) => state.auth.token);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_API}/orders/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Order status changed");
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const handlePaymentStatusChange = async (orderId, newStatus) => {
    try {
      setLoading(true);

      await axios.put(
        `${import.meta.env.VITE_APP_API}/orders/${orderId}/payment-status`,
        { paymentStatus: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Payment status updated");
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" mb={2}>
        All Orders
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ textAlign: "center" }}>Order ID</TableCell>
            <TableCell sx={{ textAlign: "center" }}>Customer</TableCell>
            <TableCell sx={{ textAlign: "center" }}>Address</TableCell>
            <TableCell sx={{ textAlign: "center" }}>Products</TableCell>
            <TableCell sx={{ textAlign: "center" }}>Total</TableCell>
            <TableCell sx={{ textAlign: "center" }}>Payment</TableCell>
            <TableCell sx={{ textAlign: "center" }}>Delivery</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order._id.slice(-6)}</TableCell>

              <TableCell>
                {order.user?.name} <br />
                <Typography variant="caption">{order.user?.number}</Typography>
              </TableCell>

              <TableCell sx={{ maxWidth: 180 }}>
                <Typography fontWeight={500} fontSize={13}>
                  {order.shippingAddress?.city}
                </Typography>

                <Typography variant="caption" display="block">
                  {order.shippingAddress?.addressLine1}
                </Typography>

                <Typography variant="caption" display="block">
                  {order.shippingAddress?.state} -{" "}
                  {order.shippingAddress?.pincode}
                </Typography>
              </TableCell>

              <TableCell sx={{ maxWidth: 220 }}>
                {order.orderItems.map((item) => (
                  <Box
                    key={item._id}
                    sx={{
                      mb: 1,
                      p: 1,
                      borderRadius: 2,
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <Typography fontWeight={500} fontSize={14}>
                      {item.name}
                    </Typography>

                    <Typography variant="caption" display="block">
                      Size: {item.size}
                    </Typography>

                    <Typography variant="caption" display="block">
                      Qty: {item.quantity}
                    </Typography>

                    <Typography variant="caption" display="block">
                      ₹ {item.price}
                    </Typography>
                  </Box>
                ))}
              </TableCell>

              <TableCell sx={{ textAlign: "center" }}>
                ₹ {order.totalAmount}
              </TableCell>

              <TableCell>
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={1}
                  alignItems={"center"}
                >
                  {/* Payment Status Chip */}
                  <Chip
                    label={order.payment?.paymentStatus}
                    size="small"
                    sx={{
                      // alignSelf: "flex-start",
                      fontWeight: 600,
                      textTransform: "capitalize",
                      backgroundColor:
                        order.payment?.paymentStatus === "paid"
                          ? "#2e7d32"
                          : order.payment?.paymentStatus === "failed"
                            ? "#d32f2f"
                            : "#ed6c02",
                      color: "#fff",
                    }}
                  />

                  {/* Payment Method Text */}
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, letterSpacing: 0.5 }}
                  >
                    {order.payment?.paymentMethod?.toUpperCase()}
                  </Typography>

                  {/* Optional: Payment Status Dropdown (if you want editable) */}
                  <Select
                    value={order.payment?.paymentStatus}
                    size="small"
                    sx={{ minWidth: 120 }}
                    onChange={(e) =>
                      handlePaymentStatusChange(order._id, e.target.value)
                    }
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="paid">Paid</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                  </Select>
                </Box>
              </TableCell>

              <TableCell>
                <Select
                  value={order.status}
                  size="small"
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default Orders;
