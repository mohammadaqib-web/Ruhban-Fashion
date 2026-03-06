import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Box } from "@mui/material";

const whatsappNumber = import.meta.env.VITE_APP_WA_NUMBER;
const message = encodeURIComponent(
  "Hi, I want to know more about your services",
);

const FloatingWhatsApp = () => {
  return (
    <Box
      component="a"
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        backgroundColor: "#25D366",
        color: "#fff",
        width: 56,
        height: 56,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        zIndex: 1000,
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#1ebe5d",
        },
      }}
    >
      <WhatsAppIcon fontSize="large" />
    </Box>
  );
};

export default FloatingWhatsApp;
