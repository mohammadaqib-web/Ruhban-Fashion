import { Box, Typography, Button, Container } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useNavigate } from "react-router-dom";
import hero1 from "../assets/hero1.webp";
import hero2 from "../assets/hero2.webp";
import hero3 from "../assets/hero3.webp";

const slides = [
  {
    image: hero1,
    title: "Elevate Your Wardrobe",
    subtitle:
      "Upgrade your style game with our 2026 Collection — where every piece promises to elevate your look.",
  },
  {
    image: hero2,
    title: "Premium Street Style",
    subtitle:
      "Discover bold designs crafted for modern confidence and timeless appeal.",
  },
  {
    image: hero3,
    title: "Exclusive Collection",
    subtitle: "Redefine fashion with curated pieces made for the trendsetters.",
  },
];

const Hero = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%", height: { xs: "50vh", sm: "90vh" } }}>
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        loop
        style={{ height: "100%" }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: "50vh", sm: "100vh" },
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Dark Overlay */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.2))",
                }}
              />

              {/* Content */}
              <Container
                maxWidth="lg"
                sx={{
                  position: "relative",
                  zIndex: 2,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box sx={{ maxWidth: 500, color: "white" }}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      fontSize: { xs: "32px", md: "56px" },
                    }}
                  >
                    {slide.title}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      mb: 3,
                      fontSize: { xs: "14px", md: "18px" },
                      opacity: 0.9,
                    }}
                  >
                    {slide.subtitle}
                  </Typography>

                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "black",
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      "&:hover": {
                        backgroundColor: "#222",
                      },
                    }}
                    onClick={() => navigate("/products")}
                  >
                    Shop Now
                  </Button>
                </Box>
              </Container>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default Hero;
