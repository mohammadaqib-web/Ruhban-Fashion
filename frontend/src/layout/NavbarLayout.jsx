import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import Footer from "../components/Footer";

const NavbarLayout = () => {
  const [categories, setCategories] = useState([]);

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const res = await axios.get(
  //         `${import.meta.env.VITE_APP_API}/categories`,
  //       );
  //       setCategories(res.data.categories);
  //     } catch (error) {
  //       console.error("Error fetching categories", error);
  //     }
  //   };

  //   fetchCategories();
  // }, []);

  return (
    <>
      <Navbar />
      <Outlet
      // context={{ categories }}
      />
      <Footer />
    </>
  );
};

export default NavbarLayout;
