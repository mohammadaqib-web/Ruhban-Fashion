import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import logo from "../assets/logo-removebg.png";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#0c0f0f",
        // backgroundImage: `url(${logo})`,
        color: "#fff",
      }}
    >
      <Box
        sx={{
          backdropFilter: "blur(50px)",
          WebkitBackdropFilter: "blur(50px)",
          pt: 6,
          pb: 4,
        }}
      >
        <Container maxWidth="lg">
          {/* Links Section */}
          <Grid container spacing={4} sx={{ justifyContent: "space-between" }}>
            {/* About */}
            <Grid
              item
              xs={12}
              md={4}
              // size={{ xs: 12, md: 4 }}
            >
              <Typography variant="h5" sx={{ mb: 2 }}>
                About Us
              </Typography>
              <FooterLink text="Our Story" />
              <FooterLink text="Our Process" />
              <FooterLink text="Press" />
              <FooterLink text="Store Locator" />
            </Grid>

            {/* Customer Service */}
            <Grid
              // size={{ xs: 12, md: 4 }}
              item
              xs={12}
              md={4}
            >
              <Typography variant="h5" sx={{ mb: 2 }}>
                Customer Service
              </Typography>
              <FooterLink text="Privacy Policy" />
              <FooterLink text="Terms of Use" />
              <FooterLink text="Shipping & Returns" />
              <FooterLink text="Contact" />
            </Grid>

            {/* Contact */}
            <Grid
              // size={{ xs: 12, md: 4 }}
              item
              xs={12}
              md={4}
            >
              <Typography variant="h5" sx={{ mb: 2 }}>
                Contact Us
              </Typography>
              <FooterLink text="Ballia" />
              <FooterLink text="+91 9876543210" />
              <FooterLink text="customercare@rf.com" />
            </Grid>
          </Grid>

          {/* Bottom */}
          <Box
            sx={{
              textAlign: "center",
              mt: 6,
              pt: 3,
              borderTop: "1px solid #222",
              fontSize: 14,
              color: "#aaa",
            }}
          >
            © {new Date().getFullYear()} Ruhban Fashion. Developed by{" "}
            <span
              style={{ color: "white", cursor: "pointer" }}
              onClick={() => window.open("https://www.codnexa.in")}
            >
              Codnexa
            </span>
            .
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

const FooterLink = ({ text }) => (
  <Typography
    sx={{
      mb: 1,
      cursor: "pointer",
      color: "#ccc",
      transition: "0.3s",
      "&:hover": {
        color: "#fff",
        transform: "translateX(5px)",
      },
    }}
  >
    {text}
  </Typography>
);

export default Footer;
