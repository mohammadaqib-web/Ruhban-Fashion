import { Box, Typography, Container, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import "swiper/css";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";

const CategoriesSection = ({ categories }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ py: { xs: 10, md: 20 }, backgroundColor: "#eae7e7" }}>
      <Container maxWidth="lg">
        {isMobile ? (
          /* 📱 MOBILE GRID */
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 3,
            }}
          >
            {categories.map((item, index) => (
              <CategoryCard key={index} item={item} />
            ))}
          </Box>
        ) : (
          /* 💻 DESKTOP SWIPER */
          <Box sx={{ position: "relative" }}>
            {/* LEFT ARROW */}
            <Box
              className="custom-prev"
              sx={{
                position: "absolute",
                top: "40%",
                left: -25,
                zIndex: 10,
                width: 45,
                height: 45,
                borderRadius: "50%",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#111",
                  color: "white",
                  transform: "scale(1.1)",
                },
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </Box>

            {/* RIGHT ARROW */}
            <Box
              className="custom-next"
              sx={{
                position: "absolute",
                top: "40%",
                right: -25,
                zIndex: 10,
                width: 45,
                height: 45,
                borderRadius: "50%",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#111",
                  color: "white",
                  transform: "scale(1.1)",
                },
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </Box>

            <Swiper
              modules={[Navigation]}
              navigation={{
                nextEl: ".custom-next",
                prevEl: ".custom-prev",
              }}
              spaceBetween={24}
              slidesPerView={4}
            >
              {categories.map((item, index) => (
                <SwiperSlide key={index}>
                  <CategoryCard item={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        )}
      </Container>
    </Box>
  );
};

const CategoryCard = ({ item }) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: "30px",
        overflow: "hidden",
        cursor: "pointer",
        display: "block",
        "&:hover img": { transform: "scale(1.08)" },
      }}
      onClick={() => navigate(`/products/${item.name}/${item._id}`)}
    >
      <Box
        component="img"
        src={item?.image?.url}
        alt={item.name}
        sx={{
          width: "100%",
          height: { xs: 250, sm: 320 },
          objectFit: "cover",
          transition: "transform 0.5s ease",
          display: "block",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#111",
          px: 4,
          py: 1.2,
          minWidth: 150,
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          {item.name.toUpperCase()}
        </Typography>
      </Box>
    </Box>
  );
};

export default CategoriesSection;
