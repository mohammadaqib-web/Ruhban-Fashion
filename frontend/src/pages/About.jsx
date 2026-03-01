import {
  Box,
  Grid,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ bgcolor: "#f5f5f5", color: "#111" }}>
      {/* ================= HERO ================= */}
      <Grid container sx={{ minHeight: "100vh" }}>
        {/* LEFT TEXT */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            px: isMobile ? 4 : 12,
            py: isMobile ? 10 : 0,
          }}
        >
          <Typography
            sx={{
              fontSize: isMobile ? "3rem" : "7rem",
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: "-4px",
            }}
          >
            WE ARE
          </Typography>

          <Typography
            sx={{
              fontSize: isMobile ? "3rem" : "7rem",
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: "-4px",
            }}
          >
            RUHBAN
          </Typography>

          <Typography
            sx={{
              mt: 4,
              maxWidth: 500,
              fontSize: "0.95rem",
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: "#555",
            }}
          >
            A premium menswear label redefining modern masculinity. Structured
            silhouettes. Timeless essentials. Designed for confidence.
          </Typography>
        </Grid>

        {/* RIGHT IMAGE */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            component="img"
            src="https://plus.unsplash.com/premium_photo-1669688174622-0393f5c6baa2?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="model"
            sx={{
              width: "100%",
              // height: "100%",
              objectFit: "cover",
              filter: "grayscale(100%)",
              maxHeight: "100vh",
            }}
          />
        </Grid>
      </Grid>

      {/* ================= PHILOSOPHY ================= */}
      <Box sx={{ px: isMobile ? 4 : 20, py: 20 }}>
        <Typography
          sx={{
            fontSize: isMobile ? "2.5rem" : "5rem",
            fontWeight: 800,
            letterSpacing: "-2px",
            mb: 6,
            textAlign: "center",
          }}
        >
          EVERLASTING <br /> NEW STANDARD
        </Typography>

        <Typography
          sx={{
            // maxWidth: 800,
            fontSize: "1.1rem",
            lineHeight: 2,
            color: "#444",
            textAlign: "center",
          }}
        >
          Our collections are built around clean lines, strong tailoring, and
          intentional design. RUHBAN is not just clothing — it is identity,
          presence, and attitude. Every piece is engineered to make a statement
          without saying a word.
        </Typography>
      </Box>

      {/* ================= JOURNEY (DARK SECTION) ================= */}
      <Grid
        container
        sx={{ bgcolor: "#111", color: "#fff", maxHeight: "100vh" }}
      >
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            p: isMobile ? 6 : 16,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxHeight: "100vh",
          }}
        >
          <Typography
            sx={{
              fontSize: isMobile ? "2.5rem" : "5rem",
              fontWeight: 800,
              mb: 6,
            }}
          >
            THE JOURNEY
          </Typography>

          <Typography sx={{ mb: 4, color: "#bbb" }}>
            Founded with a mission to bring luxury minimalism to menswear,
            RUHBAN evolved from a curated capsule into a premium fashion
            destination.
          </Typography>

          <Typography sx={{ fontWeight: 600, mb: 1 }}>2023 — Launch</Typography>
          <Typography sx={{ color: "#aaa", mb: 3 }}>
            Capsule collection of elevated essentials.
          </Typography>

          <Typography sx={{ fontWeight: 600, mb: 1 }}>
            2024 — Expansion
          </Typography>
          <Typography sx={{ color: "#aaa" }}>
            Premium streetwear & statement tailoring.
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1687541160824-366bd3581699?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="journey"
            sx={{
              width: "100%",
              // height: "100%",
              objectFit: "cover",
              filter: "grayscale(100%) contrast(120%)",
              maxHeight: "100vh",
            }}
          />
        </Grid>
      </Grid>

      {/* ================= CTA ================= */}
      <Box
        sx={{
          textAlign: "center",
          py: 20,
          px: 4,
        }}
      >
        <Typography
          sx={{
            fontSize: isMobile ? "2.5rem" : "5rem",
            fontWeight: 900,
            letterSpacing: "-2px",
          }}
        >
          READY TO <br /> BE DIFFERENT?
        </Typography>

        <Button
          variant="contained"
          sx={{
            mt: 6,
            bgcolor: "#111",
            color: "#fff",
            px: 8,
            py: 2,
            borderRadius: 0,
            fontSize: "1rem",
            letterSpacing: "2px",
            "&:hover": {
              bgcolor: "#000",
            },
          }}
          onClick={() => navigate("/products")}
        >
          SHOP NOW
        </Button>
      </Box>
    </Box>
  );
};

export default About;
