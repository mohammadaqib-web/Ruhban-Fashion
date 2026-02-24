import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useNavigate } from "react-router-dom";

const Footer = ({ categories = [] }) => {
  const navigate = useNavigate();
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
                Company
              </Typography>
              <FooterLink text="About Us" onClick={() => navigate("/about")} />
              <FooterLink
                text="Contact Us"
                onClick={() => navigate("/contact")}
              />
            </Grid>

            {/* Customer Service */}
            <Grid
              // size={{ xs: 12, md: 4 }}
              item
              xs={12}
              md={4}
            >
              <Typography variant="h5" sx={{ mb: 2 }}>
                Products
              </Typography>
              <FooterLink
                text={categories?.categories[0]?.name.toUpperCase()}
                onClick={() =>
                  navigate(
                    `/products/${categories.categories[0].name}/${categories.categories[0]._id}`,
                  )
                }
              />
              <FooterLink
                text={categories?.categories[1]?.name.toUpperCase()}
                onClick={() =>
                  navigate(
                    `/products/${categories.categories[0].name}/${categories.categories[0]._id}`,
                  )
                }
              />
              <FooterLink
                text={categories?.categories[2]?.name.toUpperCase()}
                onClick={() =>
                  navigate(
                    `/products/${categories.categories[0].name}/${categories.categories[0]._id}`,
                  )
                }
              />
              <FooterLink
                text={categories?.categories[3]?.name.toUpperCase()}
                onClick={() =>
                  navigate(
                    `/products/${categories.categories[0].name}/${categories.categories[0]._id}`,
                  )
                }
              />
            </Grid>

            {/* Contact */}
            <Grid
              // size={{ xs: 12, md: 4 }}
              item
              xs={12}
              md={4}
              textAlign={"center"}
            >
              <Typography variant="h5" sx={{ mb: 2 }}>
                Follow Us On
              </Typography>
              {/* <FooterLink text="Ballia" /> */}
              <IconButton
                component="a"
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "#fff" }}
              >
                <InstagramIcon />
              </IconButton>
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

const FooterLink = ({ text, onClick }) => (
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
    onClick={onClick}
  >
    {text}
  </Typography>
);

export default Footer;
