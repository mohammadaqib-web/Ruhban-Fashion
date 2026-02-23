import { Box, Typography, Button, Grid } from "@mui/material";
import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
    title: 'Dunk High "Green Satin" Sneakers',
    price: 180,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db",
    title: "Air Force 1 Shadow",
    price: 150,
    oldPrice: 200,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
    title: "Air Max 90",
    price: 210,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
    title: "Jordan 1 Retro",
    price: 250,
  },
];

export default function FreshDrops() {
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
          FRESH DROPS
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

      {/* Products */}
      <Grid container spacing={4} justifyContent={"center"}>
        {products.map((product) => (
          <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <ProductCard {...product} />
          </Grid>
        ))}
      </Grid>

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
