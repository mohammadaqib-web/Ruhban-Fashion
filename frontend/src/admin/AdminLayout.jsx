import { Box } from "@mui/material";
import { useState } from "react";
import Sidebar from "../components/admin/SidebarComponent";
import Topbar from "../components/admin/Topbar";
import { Outlet } from "react-router-dom";

const drawerWidth = 240;

const AdminLayout = () => {
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Topbar handleDrawerToggle={handleDrawerToggle} />

      <Sidebar open={open} drawerWidth={drawerWidth} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: open ? `${drawerWidth}px` : "0px",
          transition: "margin 0.3s ease",
          backgroundColor: "#f4f6f8",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;