import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

const Sidebar = ({ open, drawerWidth }) => {
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "black",
          color: "#fff",
          mt: { xs: 6, md: 8 },
        },
      }}
    >
      <List>
        <ListItemButton component={Link} to="/admin">
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton component={Link} to="/admin/categories">
          <ListItemText primary="Categories" />
        </ListItemButton>

        <ListItemButton component={Link} to="/admin/products">
          <ListItemText primary="Products" />
        </ListItemButton>

        <ListItemButton component={Link} to="/admin/orders">
          <ListItemText primary="Orders" />
        </ListItemButton>

        <ListItemButton component={Link} to="/admin/users">
          <ListItemText primary="Users" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
