import { Box, Typography, Container, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import "swiper/css";
import "swiper/css/navigation";

const categories = [
  {
    title: "SHIRT",
    image:
      "https://images.unsplash.com/photo-1740711152088-88a009e877bb?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "T-SHIRT",
    image:
      "https://images.unsplash.com/photo-1516177609387-9bad55a45194?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "JEANS",
    image:
      "https://images.unsplash.com/photo-1511196044526-5cb3bcb7071b?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "UNDER GARMENTS",
    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d",
  },
  {
    title: "SHOES",
    image:
      "https://plus.unsplash.com/premium_photo-1670983858132-c2f3c4dbf08c?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "ATTAR",
    image:
      "https://images.unsplash.com/photo-1612784642053-15614e602ed7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "PERFUMES",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f",
  },
  {
    title: "WATCHES",
    image:
      "https://images.unsplash.com/photo-1751437715301-4030182f4606?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "LOWERS",
    image:
      "https://images.unsplash.com/photo-1687376020738-423299939b18?q=80&w=695&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "COTTON PANT",
    image:
      "https://images.unsplash.com/photo-1661352754488-4776516fcf31?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "FORMAL PANT",
    image:
      "https://plus.unsplash.com/premium_photo-1769131129681-3f5e1a931e44?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "BELT",
    image:
      "https://images.unsplash.com/photo-1664286074240-d7059e004dff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "KOREAN PANT",
    image:
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcS5a8YGop429MmlTRhhqJOjXANBAYYXm6k2pDCHqPZ-7g0gvu6oESza9DoXUIZ_2wGecM9UnosZjM3cgwPZYRmIQGUjMU7KFx8eIR4RI6Uf",
  },
  // {
  //   title: "CODESET",
  //   image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
  // },
];

const CategoriesSection = () => {
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
    >
      <Box
        component="img"
        src={item.image}
        alt={item.title}
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
          {item.title}
        </Typography>
      </Box>
    </Box>
  );
};

export default CategoriesSection;
