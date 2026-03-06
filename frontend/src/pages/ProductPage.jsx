import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Paper,
  Rating,
  TextField,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import userTokenValidity from "../utils/UserTokenValidity";
import { CircularProgress, Fade, Slide } from "@mui/material";
import { toast } from "react-toastify";
import SuggestedProducts from "../components/SuggestedProducts";
import ProductCheckoutModal from "../components/ProductCheckoutModal";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/auth/cartSlice";

const ProductPage = () => {
  const location = useLocation();
  const { id } = useParams();
  const validateUser = userTokenValidity();
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product
        const productRes = await axios.get(
          `${import.meta.env.VITE_APP_API}/products/${id}`,
        );

        setProduct(productRes.data.product);

        setSelectedImage(productRes.data.product?.images?.[0]?.url);
        setSize(productRes.data.product?.sizes?.[0]?.size || "");

        // Fetch reviews separately
        const reviewRes = await axios.get(
          `${import.meta.env.VITE_APP_API}/reviews/${id}`,
        );

        setReviews(reviewRes.data.reviews || []);
      } catch (err) {
        console.error(err);

        if (err.response?.status === 404) {
          setError("Product not found");
        } else {
          setError("Something went wrong");
        }
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }
    };

    fetchData();
  }, [id]);

  const submitReviewHandler = async () => {
    if (!reviewRating) {
      toast.error("Please provide rating");
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(
        `${import.meta.env.VITE_APP_API}/reviews/${id}`,
        {
          rating: reviewRating,
          comment: reviewText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Review submitted successfully 🎉");

      // Refresh product (for rating update)
      const productRes = await axios.get(
        `${import.meta.env.VITE_APP_API}/products/${id}`,
      );

      setProduct(productRes.data.product);
      setSelectedImage(productRes.data.product?.images?.[0]?.url);

      // Refresh reviews
      const reviewRes = await axios.get(
        `${import.meta.env.VITE_APP_API}/reviews/${id}`,
      );

      setReviews(reviewRes.data.reviews || []);

      setReviewText("");
      setReviewRating(0);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedSize = product?.sizes?.find((s) => s.size === size);
  const discountPercent = selectedSize
    ? Math.round(
        ((selectedSize.price - selectedSize.discountPrice) /
          selectedSize.price) *
          100,
      )
    : 0;

  useEffect(() => {
    if (selectedSize && quantity > selectedSize.stock) {
      setQuantity(1);
    }
  }, [selectedSize, quantity]);

  if (loading) {
    return (
      <Container
        sx={{
          height: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Fade in={loading} timeout={500}>
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress size={50} thickness={4} />
            <Typography sx={{ mt: 2 }} color="text.secondary">
              Loading product...
            </Typography>
          </Box>
        </Fade>
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        sx={{
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {error}
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          The product you are looking for does not exist or may have been
          removed.
        </Typography>

        <Button variant="contained" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Fade in={!loading} timeout={600}>
      <Box>
        <Slide in={!loading} direction="up" timeout={1000}>
          <Container sx={{ py: 6 }}>
            <Grid container spacing={6}>
              {/* LEFT - Product Image */}
              <Grid size={{ xs: 12, md: 6 }} mt={{ xs: -4, md: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexDirection: { xs: "column", md: "row" }, // 👈 switch layout
                  }}
                >
                  {/* MAIN IMAGE */}
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: 4,
                      overflow: "hidden",
                      p: 2,
                      flex: 1,
                      order: { xs: 1, md: 2 }, // 👈 main image first on mobile
                    }}
                  >
                    <Box
                      component="img"
                      src={selectedImage}
                      alt="Product"
                      sx={{
                        width: "100%",
                        borderRadius: 3,
                        objectFit: "contain",
                        maxHeight: { xs: 350, md: 450 },
                      }}
                    />
                  </Paper>

                  {/* THUMBNAILS */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexDirection: { xs: "row", md: "column" }, // 👈 row for mobile
                      overflowX: { xs: "auto", md: "visible" },
                      order: { xs: 2, md: 1 }, // 👈 thumbnails bottom on mobile
                    }}
                  >
                    {product?.images?.map((img, index) => (
                      <Box
                        key={index}
                        component="img"
                        src={img.url}
                        onClick={() => setSelectedImage(img.url)}
                        sx={{
                          width: { xs: 70, md: 70 },
                          height: { xs: 90, md: 90 },
                          objectFit: "cover",
                          borderRadius: 2,
                          cursor: "pointer",
                          border:
                            selectedImage === img.url
                              ? "2px solid black"
                              : "1px solid #ddd",
                          flexShrink: 0,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>

              {/* RIGHT - Product Info */}
              <Grid size={{ xs: 12, md: 6 }} sx={{ mt: { xs: -3, md: 0 } }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {product?.name}
                </Typography>

                <Typography variant="h6" sx={{ mb: 2 }}>
                  ₹{selectedSize?.discountPrice || selectedSize?.price}
                  {selectedSize?.discountPrice && (
                    <span
                      style={{
                        fontSize: 14,
                        color: "gray",
                        marginLeft: "5px",
                        position: "relative",
                      }}
                    >
                      {selectedSize.price}
                      <span
                        style={{
                          position: "absolute",
                          left: -3,
                          right: 0,
                          top: "40%",
                          height: "1px",
                          backgroundColor: "gray",
                          transform: "rotate(-15deg)",
                          width: "125%",
                        }}
                      />
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span
                      style={{
                        marginLeft: 20,
                        fontWeight: 600,
                        color: "red",
                      }}
                    >
                      {discountPercent}% OFF
                    </span>
                  )}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: showFullDesc ? "unset" : 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {product?.description}
                  </Typography>

                  <Typography
                    onClick={() => setShowFullDesc(!showFullDesc)}
                    sx={{
                      mt: 1,
                      cursor: "pointer",
                      fontWeight: 600,
                      color: "#545454",
                      width: "fit-content",
                    }}
                  >
                    {showFullDesc ? "Show Less" : "Read More"}
                  </Typography>
                </Box>

                {/* Sizes */}
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 1 }}
                >
                  Select Size
                </Typography>

                <ToggleButtonGroup
                  value={size}
                  exclusive
                  onChange={(e, newSize) => newSize && setSize(newSize)}
                  sx={{ mb: 3 }}
                >
                  {[...(product?.sizes || [])]
                    .sort((a, b) => {
                      const order = ["XS", "S", "M", "L", "XL", "XXL"];

                      const aVal = a.size?.toUpperCase();
                      const bVal = b.size?.toUpperCase();

                      // Numeric sizes
                      if (!isNaN(aVal) && !isNaN(bVal)) {
                        return Number(aVal) - Number(bVal);
                      }

                      // Standard letter sizes
                      if (order.includes(aVal) && order.includes(bVal)) {
                        return order.indexOf(aVal) - order.indexOf(bVal);
                      }

                      return aVal.localeCompare(bVal);
                    })
                    .map((s) => (
                      <ToggleButton
                        key={s.size}
                        value={s.size}
                        // disabled={s.stock === 0}
                        // sx={{
                        //   opacity: s.stock === 0 ? 0.8 : 1,
                        // }}
                      >
                        {s.size.toUpperCase()}
                      </ToggleButton>
                    ))}
                </ToggleButtonGroup>

                {/* Quantity */}
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 1 }}
                >
                  Quantity
                </Typography>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  >
                    -
                  </Button>
                  <Typography sx={{ ml: 2, mr: 2 }}>{quantity}</Typography>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      if (
                        selectedSize?.stock &&
                        quantity < selectedSize.stock
                      ) {
                        setQuantity(quantity + 1);
                      }
                    }}
                  >
                    +
                  </Button>
                </Box>

                <Typography
                  sx={{
                    mt: -1,
                    mb: 3,
                    color:
                      selectedSize?.stock > 5
                        ? "green"
                        : selectedSize?.stock > 0
                          ? "orange"
                          : "red",
                    fontWeight: 600,
                  }}
                >
                  {selectedSize?.stock > 5 &&
                    `In Stock (${selectedSize.stock} available)`}
                  {selectedSize?.stock > 0 &&
                    selectedSize?.stock <= 5 &&
                    `Only ${selectedSize.stock} left! Hurry 🔥`}
                  {selectedSize?.stock === 0 && "Out of Stock"}
                </Typography>

                {/* Buttons */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ p: 1.5, borderRadius: 24 }}
                    disabled={!selectedSize || selectedSize.stock === 0}
                    onClick={() => {
                      dispatch(
                        addToCart({
                          productId: product._id,
                          name: product.name,
                          image: product.images[0]?.url,
                          sizeId: selectedSize._id,
                          size: selectedSize.size,
                          price:
                            selectedSize.discountPrice || selectedSize.price,
                          stock: selectedSize.stock,
                          quantity,
                        }),
                      );

                      // toast.success("Added to cart 🛒");
                    }}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ p: 1.5, borderRadius: 24 }}
                    disabled={!selectedSize || selectedSize.stock === 0}
                    onClick={() => {
                      if (validateUser) {
                        setCheckoutOpen(true);
                      } else {
                        navigate(`/auth?redirect=${location.pathname}`);
                      }
                    }}
                  >
                    Buy Now
                  </Button>
                </Box>
              </Grid>
            </Grid>

            {/* REVIEWS SECTION */}
            <Box sx={{ mt: 8 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Ratings & Reviews
              </Typography>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <Typography variant="h2" fontWeight="bold">
                  {product?.averageRating || 0}
                </Typography>
                <Rating
                  value={product?.averageRating || 0}
                  precision={0.5}
                  readOnly
                />
              </Box>

              {validateUser && (
                <>
                  <Divider sx={{ my: 4 }} />

                  <Typography variant="h6" gutterBottom>
                    Write a Review
                  </Typography>

                  <Box sx={{ maxWidth: 500 }}>
                    <Rating
                      value={reviewRating}
                      onChange={(event, newValue) => setReviewRating(newValue)}
                      sx={{ mb: 2 }}
                    />

                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="Write your review here..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      sx={{ mb: 2 }}
                    />

                    <Button
                      variant="contained"
                      onClick={submitReviewHandler}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <CircularProgress size={20} sx={{ color: "#fff" }} />
                      ) : (
                        "Submit Review"
                      )}
                    </Button>
                  </Box>
                </>
              )}

              <Divider sx={{ my: 4 }} />

              <Typography variant="h6" gutterBottom>
                Customer Reviews
              </Typography>

              <Box sx={{ mt: 2 }}>
                {reviews.length === 0 ? (
                  <Typography>No reviews yet.</Typography>
                ) : (
                  reviews.map((review, index) => (
                    <Paper
                      key={index}
                      sx={{
                        p: 3,
                        mb: 2,
                        borderRadius: 3,
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography fontWeight="bold">
                          {review.user?.name || "User"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>

                      <Rating
                        value={review.rating}
                        readOnly
                        size="small"
                        sx={{ my: 1 }}
                      />

                      <Typography variant="body2" color="text.secondary">
                        {review.comment}
                      </Typography>
                    </Paper>
                  ))
                )}
              </Box>
            </Box>

            <SuggestedProducts productId={id} />

            <ProductCheckoutModal
              open={checkoutOpen}
              onClose={() => setCheckoutOpen(false)}
              product={product}
              selectedSize={selectedSize}
              qty={quantity}
            />
          </Container>
        </Slide>
      </Box>
    </Fade>
  );
};

export default ProductPage;
