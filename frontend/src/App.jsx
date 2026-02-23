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

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route element={<NavbarLayout />}>
          <Route path="/" element={<Home />} />
          {/* <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} /> */}
          <Route element={<PublicRoute />}>
            <Route path="/auth" element={<Auth />} />
          </Route>
          {/* <Route path="/profile" element={<Account />} />
          <Route path="/allProducts" element={<AllProducts />} />
          <Route path="/:category/:id" element={<AllProducts />} />
          <Route path="/product/:id" element={<SingleProduct />} /> */}
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
    </>
  );
}

export default App;
