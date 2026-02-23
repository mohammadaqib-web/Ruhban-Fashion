import { Box, Typography, Container } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const categories = [
  {
    title: "MINIMAL",
    subtitle: "Clean & effortless style",
    image:
      "https://images.unsplash.com/photo-1738247999596-6d586d23e723?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "EVERYDAY",
    subtitle: "Essential wardrobe picks",
    image:
      "https://images.unsplash.com/photo-1635205383325-aa3e6fb5ba55?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "STREET",
    subtitle: "Urban & bold statements",
    image:
      "https://images.unsplash.com/photo-1616114615615-f4e9253e9cd1?q=80&w=665&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "TRENDY",
    subtitle: "Trending right now",
    image:
      "https://images.unsplash.com/photo-1646321571711-5ddcebcba35b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function MenFashionCategories() {
  return (
    <Box
      sx={{
        background: "linear-gradient(180deg,#0f0f0f,#1a1a1a)",
        py: 15,
        overflow: "hidden",
        pb: -10,
      }}
    >
      <Container maxWidth="xl" sx={{ ml: 5, mr: 5 }}>
        {categories.map((item, index) => (
          <MotionBox
            key={index}
            initial={{ opacity: 0, y: 120 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1, delay: index * 0.2 }}
            sx={{
              position: "relative",
              mb: 18,
              cursor: "pointer",
            }}
          >
            {/* Large Background Title */}
            <Typography
              sx={{
                position: "absolute",
                fontSize: { xs: "60px", md: "140px" },
                fontWeight: 900,
                color: "transparent",
                WebkitTextStroke: "1px rgba(255,255,255,0.08)",
                top: -40,
                left: 0,
                zIndex: 0,
                userSelect: "none",
              }}
            >
              {item.title}
            </Typography>

            {/* Content */}
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  md: index % 2 === 0 ? "row" : "row-reverse",
                },
                alignItems: "center",
                gap: 8,
                position: "relative",
                zIndex: 2,
              }}
            >
              {/* Image */}
              <MotionBox
                component="img"
                src={`${item.image}?auto=format&fit=crop&w=900&q=80`}
                whileHover={{ scale: 1.07 }}
                transition={{ duration: 0.6 }}
                // initial={{ rotate: 0 }}
                sx={{
                  width: { xs: "50%", md: "50%" },
                  height: 300,
                  objectFit: "cover",
                  borderRadius: "20px",
                  boxShadow: "0 40px 80px rgba(92, 91, 91, 0.24)",
                  mt: { xs: 1.5, md: 12 },
                  ml: index % 2 == 0 ? { xs: 10, md: 15 } : 0,
                  mr: index % 2 != 0 ? { xs: 30, md: 15 } : 0,
                }}
              />

              {/* Text Content */}
              <Box sx={{ width: { xs: "100%", md: "40%" } }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    color: "#fff",
                    letterSpacing: 2,
                    mt: -3,
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    // mt: 3,
                    fontSize: 20,
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  {item.subtitle}
                </Typography>
              </Box>
            </Box>
          </MotionBox>
        ))}
      </Container>
    </Box>
  );
}
