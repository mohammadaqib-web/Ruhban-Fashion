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
} from "@mui/material";
import { useSelector } from "react-redux";

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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      fetchOrders();
    } catch (error) {
      console.log(error);
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
            <TableCell>Order ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Payment</TableCell>
            <TableCell>Delivery</TableCell>
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

              <TableCell>₹ {order.totalAmount}</TableCell>

              <TableCell>
                <Chip
                  label={order.payment?.paymentStatus}
                  color={
                    order.payment?.paymentStatus === "paid"
                      ? "success"
                      : order.payment?.paymentStatus === "failed"
                        ? "error"
                        : "warning"
                  }
                />
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
