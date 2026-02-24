import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PantFeature = ({ pantCat }) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        backgroundColor: "#111",
        color: "#fff",
        py: { xs: 6, md: 10 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: { xs: 4, md: 8 },
          }}
        >
          {/* LEFT IMAGE */}
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1697909624670-1fd857ad25cb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Pants Collection"
            sx={{
              width: { xs: "100%", md: "45%" },
              borderRadius: 2,
              objectFit: "cover",
              height: "400px",
            }}
          />

          {/* RIGHT CONTENT */}
          <Box sx={{ width: { xs: "100%", md: "55%" } }}>
            {/* <Typography
              variant="subtitle2"
              sx={{
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "#aaa",
                mb: 2,
              }}
            >
              Stride In Style: Explore Our Pant Collection!
            </Typography> */}

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                lineHeight: 1.2,
                mb: 3,
              }}
            >
              Upgrade Your Bottoms with Our Pants
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#ccc",
                mb: 4,
                maxWidth: "500px",
              }}
            >
              Step up your fashion game with our versatile pants collection.
              From tailored fits to relaxed styles, we have the perfect pair for
              every occasion. Crafted with quality materials for comfort and
              durability.
            </Typography>

            <Button
              variant="outlined"
              sx={{
                color: "#fff",
                borderColor: "#fff",
                px: 4,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "#fff",
                  color: "#000",
                  borderColor: "#fff",
                },
              }}
              onClick={() =>
                pantCat
                  ? navigate(`/products/${pantCat.name}/${pantCat._id}`)
                  : navigate(`/products`)
              }
            >
              Shop Now
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default PantFeature;
