import { Box, Typography, Button, Grid, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

export default function FreshDrops({ category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!category?._id) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${import.meta.env.VITE_APP_API}/products/category/${category._id}?page=1&limit=4`
        );

        setProducts(res.data.products);
      } catch (error) {
        console.error("Fetch Fresh Drops Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, py: 10, background: "#fafafa" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", md: "space-between" },
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {category?.name?.toUpperCase() || "FRESH DROPS"}
        </Typography>

        <Button
          variant="outlined"
          sx={{
            borderRadius: "25px",
            borderColor: "#000",
            color: "#000",
            px: 3,
            display: { xs: "none", md: "block" },
          }}
        >
          Discover More
        </Button>
      </Box>

      {/* Loading */}
      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <ProductCard
                id={product._id}
                image={product.images?.[0]?.url}
                title={product.name}
                price={product.sizes?.[0]?.price}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Mobile Button */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          justifyContent: "center",
          mt: 6,
        }}
      >
        <Button
          variant="outlined"
          sx={{
            borderRadius: "25px",
            borderColor: "#000",
            color: "#000",
            px: 3,
          }}
        >
          Discover More
        </Button>
      </Box>
    </Box>
  );
}