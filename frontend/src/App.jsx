import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import NavbarLayout from "./layout/NavbarLayout";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import Products from "./admin/Products";
import Orders from "./admin/Orders";
import Users from "./admin/Users";
import Categories from "./admin/Categories";
import ScrollToTop from "./utils/ScrollToTop";
import Auth from "./pages/Auth";
import PublicRoute from "./layout/PublicRoute";
import AdminProtectedRoute from "./utils/AdminProtectedRoute";
import AllProducts from "./pages/AllProducts";
import ProductPage from "./pages/ProductPage";
import Account from "./pages/Account";
import Contact from "./pages/Contact";
import About from "./pages/About";
// import { Box, Typography } from "@mui/material";
// import QR from "./assets/qr.jpeg";

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route element={<NavbarLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route element={<PublicRoute />}>
            <Route path="/auth" element={<Auth />} />
          </Route>
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category/:id" element={<AllProducts />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/profile" element={<Account />} />
        </Route>

        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
            <Route path="categories" element={<Categories />} />
          </Route>
        </Route>
      </Routes>
      {/* <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100dvh",
          backgroundColor: "black",
        }}
      >
        <img src={QR} alt="QR Code" width={"300px"} />
        <Typography variant="h4" sx={{ color: "white", mt: 5 }}>
          Clear the remaining amount on this QR to unlock your website
        </Typography>
      </Box> */}
    </>
  );
}

export default App;
