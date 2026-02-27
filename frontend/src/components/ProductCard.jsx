import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";

export default function ProductCard({
  id,
  image,
  title,
  brand,
  price,
  oldPrice,
  badge,
}) {
  const navigate = useNavigate();
  
  return (
    <Card
      sx={{
        width: "100%",
        // minWidth: 320,
        maxWidth: 320,
        mx: "auto",
        borderRadius: "28px",
        p: 2,
        background: "#f5f5f5",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
          cursor: "pointer",
        },
        minHeight: "450px",
        maxHeight: "450px",
      }}
      onClick={() => navigate(`/product/${id}`)}
    >
      {/* Badge + Wishlist */}
      {/* <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        {badge && (
          <Chip
            label={badge}
            size="small"
            sx={{
              borderRadius: "20px",
              background: "#e0e0e0",
              fontWeight: 500,
            }}
          />
        )}

        <IconButton>
          <FavoriteBorderIcon />
        </IconButton>
      </Box> */}

      {/* Image */}
      <CardMedia
        component="img"
        image={image}
        alt={title}
        sx={{
          borderRadius: "20px",
          background: "#fff",
          // p: 3,
          objectFit: "cover",
          height: 260,
        }}
      />

      {/* Content */}
      <CardContent sx={{ px: 1 }}>
        {/* <Typography variant="body2" sx={{ color: "#4caf50", fontWeight: 500 }}>
          {brand}
        </Typography> */}

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Typography>

        <Box sx={{ mt: 1, mb: 2 }}>
          <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
            ₹{price}
          </Typography>

          {oldPrice && oldPrice > price && (
            <Typography
              component="span"
              sx={{
                ml: 1,
                textDecoration: "line-through",
                color: "#9e9e9e",
              }}
            >
              ₹{oldPrice}
            </Typography>
          )}
        </Box>

        <Button
          fullWidth
          sx={{
            background: "#000",
            color: "#fff",
            borderRadius: "25px",
            py: 1.2,
            fontWeight: 500,
            "&:hover": {
              background: "#333",
            },
          }}
        >
          See Product
        </Button>
      </CardContent>
    </Card>
  );
}
