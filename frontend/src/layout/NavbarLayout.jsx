import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";

const NavbarLayout = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_API}/categories`,
        );
        // console.log(res.data.categories);
        setCategories(res.data.categories);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <Navbar categories={{ categories }} />
      <Outlet context={{ categories }} />
      <Footer categories={{ categories }} />
    </>
  );
};

export default NavbarLayout;
