import { Grid, CircularProgress, Box } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import StatsCard from "../components/admin/StatsCard";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_API}/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStats(res.data);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [token]);

  if (loading) {
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <StatsCard title="Total Products" value={stats.totalProducts} />
      </Grid>

      <Grid item xs={12} md={3}>
        <StatsCard title="Total Orders" value={stats.totalOrders} />
      </Grid>

      <Grid item xs={12} md={3}>
        <StatsCard title="Total Users" value={stats.totalUsers} />
      </Grid>

      <Grid item xs={12} md={3}>
        <StatsCard
          title="Total Revenue"
          value={`₹ ${stats.totalRevenue}`}
        />
      </Grid>
    </Grid>
  );
};

export default Dashboard;