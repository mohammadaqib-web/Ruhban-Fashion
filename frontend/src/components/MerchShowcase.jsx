import { Box, Typography, Button, Container } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const prod = [
  {
    image:
      "https://images.unsplash.com/photo-1573915160406-cf83c1cc8885?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    image:
      "https://plus.unsplash.com/premium_photo-1727942421317-382428c9ac44?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    image:
      "https://images.unsplash.com/photo-1580568287125-ae9bad4f0eef?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    image:
      "https://images.unsplash.com/photo-1761896904104-334cad0f5d3b?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function MerchShowcase() {
  const cardVariants = {
    hidden: (i) => ({
      opacity: 0,
      x: 150,
      rotate: i % 2 === 0 ? 15 : -15,
      scale: 0.9,
    }),
    visible: (i) => ({
      opacity: 1,
      x: 0,
      rotate: i % 2 === 0 ? 6 : -6,
      scale: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: [0.25, 0.8, 0.25, 1],
      },
    }),
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#0f0f0f",
        display: "flex",
        alignItems: "center",
        py: 10,
      }}
    >
      <Container maxWidth="lg">
        {/* SECTION WRAPPER (scroll trigger here) */}
        <MotionBox
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }} // triggers when 30% visible
          exit="hidden"
        >
          {/* Heading */}
          <MotionBox
            variants={{
              hidden: { opacity: 0, y: -60 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8 },
              },
            }}
            sx={{ textAlign: "center", mb: 8 }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: "#fff",
              }}
            >
              Featured Products
            </Typography>

            <Typography
              sx={{
                color: "#aaa",
                mt: 2,
                maxWidth: 600,
                mx: "auto",
              }}
            >
              Premium design meets minimal aesthetics.
            </Typography>
          </MotionBox>

          {/* Cards */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 4,
              flexWrap: "wrap",
            }}
          >
            {prod.map((item, index) => (
              <MotionBox
                key={index}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{
                  rotate: index % 2 === 0 ? 8 : -8,
                }}
                sx={{
                  width: 260,
                  height: 340,
                  borderRadius: "24px",
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <img
                  src={item.image}
                  width={260}
                  height={340}
                  style={{ objectFit: "cover", borderRadius: "24px" }}
                />
                {/* <Typography
                  variant="h6"
                  sx={{ color: "#fff", fontWeight: 600 }}
                >
                  Product {item}
                </Typography> */}
              </MotionBox>
            ))}
          </Box>

          {/* CTA */}
          <MotionBox
            variants={{
              hidden: { opacity: 0, y: 60 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { delay: 0.6, duration: 0.8 },
              },
            }}
            sx={{ textAlign: "center", mt: 10 }}
          >
            <Button
              variant="contained"
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: "50px",
                fontWeight: 600,
                background: "#fff",
                color: "#000",
                "&:hover": {
                  background: "#ddd",
                },
              }}
            >
              Shop Now
            </Button>
          </MotionBox>
        </MotionBox>
      </Container>
    </Box>
  );
}
