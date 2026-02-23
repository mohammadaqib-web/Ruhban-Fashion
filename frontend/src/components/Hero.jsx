import { Box, Typography, Button, Container } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59",
    title: "Elevate Your Wardrobe",
    subtitle:
      "Upgrade your style game with our 2026 Collection — where every piece promises to elevate your look.",
  },
  {
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e",
    title: "Premium Street Style",
    subtitle:
      "Discover bold designs crafted for modern confidence and timeless appeal.",
  },
  {
    image: "https://images.unsplash.com/photo-1520975916090-3105956dac38",
    title: "Exclusive Collection",
    subtitle: "Redefine fashion with curated pieces made for the trendsetters.",
  },
];

const Hero = () => {
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
