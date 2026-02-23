import { Box, Typography, Grid, Container } from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LockIcon from "@mui/icons-material/Lock";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const features = [
  {
    icon: <FlightIcon sx={{ fontSize: 40, color: "white" }} />,
    title: "Swift as the wind",
    desc: "Parcels delivered promptly via air",
  },
  {
    icon: <LocationOnIcon sx={{ fontSize: 40, color: "white" }} />,
    title: "Fast Delivery",
    desc: "Shipping parcels to every corner of India",
  },
  {
    icon: <LockIcon sx={{ fontSize: 40, color: "white" }} />,
    title: "Secure Payment",
    desc: "We accept all payment methods",
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 40, color: "white" }} />,
    title: "Support",
    desc: "Get expert assistance anytime: 10-hour availability for chat, calls, and emails",
  },
];

const FeaturesSection = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: "black" }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {features.map((item, index) => (
            <Grid size={{ xs: 6, md: 3 }} key={index}>
              <Box
                sx={{
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {/* Icon */}
                <Box>{item.icon}</Box>

                {/* Title */}
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "18px", md: "22px" },
                    letterSpacing: 1,
                    color: "#ffffffcb",
                  }}
                >
                  {item.title}
                </Typography>

                {/* Description */}
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "#878787",
                    lineHeight: 1.6,
                  }}
                >
                  {item.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
