import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

export default function SuggestedProducts({ productId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${import.meta.env.VITE_APP_API}/products/random?limit=4`,
        );

        if (res.data.success) {
          setProducts(res.data.products);
        }
      } catch (error) {
        console.error("Fetch Random Products Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productId]);

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, mt: 15, mb: 10, background: "#fafafa" }}>
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
          SUGGESTED PRODUCTS
        </Typography>
      </Box>

      {/* Loading */}
      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {products.map((product) => {
            const firstSize = product.sizes?.[0];

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product._id}>
                <ProductCard
                  id={product._id}
                  image={product.images?.[0]?.url}
                  title={product.name}
                  price={firstSize?.discountPrice || firstSize?.price}
                  oldPrice={firstSize?.price}
                />
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
