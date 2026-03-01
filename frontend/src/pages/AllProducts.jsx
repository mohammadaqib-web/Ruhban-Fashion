import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Drawer,
  IconButton,
  Button,
  Pagination,
  Slider,
  Checkbox,
  FormControlLabel,
  useMediaQuery,
  Grid,
  Divider,
  Card,
  CardMedia,
  Chip,
  CardContent,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { CircularProgress } from "@mui/material";
import ScrollToTop from "../utils/ScrollToTop";

const API = import.meta.env.VITE_APP_API;

const AllProducts = () => {
  const { categories } = useOutletContext();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const { category, id } = useParams();
  const isMobile = useMediaQuery("(max-width:900px)");
  const [openFilter, setOpenFilter] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = parseInt(searchParams.get("page")) || 1;
  const minParam = parseInt(searchParams.get("minPrice")) || 0;
  const maxParam = parseInt(searchParams.get("maxPrice")) || 7500;
  const inStockParam = searchParams.get("inStock");

  const [page, setPage] = useState(pageParam);
  const [price, setPrice] = useState([minParam, maxParam]);
  const [tempPrice, setTempPrice] = useState([minParam, maxParam]);

  useEffect(() => {
    fetchProducts();
  }, [searchParams, id]);

  const FilterContent = () => (
    <Box sx={{ p: 3, width: 280 }}>
      <Typography fontWeight={700} mb={2} sx={{ color: "black" }}>
        FILTER
      </Typography>
      <Divider sx={{ borderColor: "grey", mt: -1, borderWidth: 1 }} />
      <Typography
        fontSize={16}
        fontWeight={600}
        mt={3}
        sx={{ textTransform: "uppercase", color: "black" }}
      >
        Price
      </Typography>
      <Slider
        value={tempPrice}
        onChange={(e, newValue) => {
          if (!Array.isArray(newValue)) return;
          setTempPrice(newValue);
        }}
        onChangeCommitted={(e, newValue) => {
          if (!Array.isArray(newValue)) return;
          setPrice(newValue);
        }}
        min={0}
        max={7500}
        step={500}
        valueLabelDisplay="auto"
        sx={{
          color: "black",
          width: "90%",
        }}
      />
      <Typography sx={{ mt: 0 }}>
        Price: ₹ {tempPrice[0]} – ₹ {tempPrice[1]}
      </Typography>

      <Typography
        fontSize={16}
        fontWeight={600}
        mt={4}
        sx={{ textTransform: "uppercase", color: "black" }}
      >
        Availability
      </Typography>

      <FormControlLabel
        control={
          <Checkbox
            checked={searchParams.get("inStock") === "true"}
            sx={{
              color: "black",
              "&.Mui-checked": { color: "black" },
            }}
            onChange={() => {
              const params = new URLSearchParams(searchParams);

              if (searchParams.get("inStock") === "true") {
                params.delete("inStock");
              } else {
                params.set("inStock", "true");
              }

              params.set("page", 1);

              setSearchParams(params);
            }}
          />
        }
        label="In Stock"
      />

      {!id && (
        <>
          <Typography
            fontSize={16}
            fontWeight={600}
            mt={3}
            sx={{ textTransform: "uppercase", color: "black" }}
          >
            Category
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
            {categories?.map((cat) => (
              <FormControlLabel
                key={cat._id}
                control={
                  <Checkbox
                    checked={searchParams.get("category") === cat._id}
                    sx={{
                      color: "black",
                      "&.Mui-checked": {
                        color: "black",
                      },
                    }}
                    onChange={() => {
                      const params = new URLSearchParams(searchParams);
                      const currentCategory = searchParams.get("category");

                      if (currentCategory === cat._id) {
                        params.delete("category");
                      } else {
                        params.set("category", cat._id);
                      }

                      params.set("page", 1);

                      setSearchParams(params);
                    }}
                  />
                }
                label={cat.name
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              />
            ))}
          </Box>
        </>
      )}

      <Button
        fullWidth
        onClick={() => {
          const params = new URLSearchParams(searchParams);

          params.set("page", 1);
          params.set("minPrice", tempPrice[0]);
          params.set("maxPrice", tempPrice[1]);

          setSearchParams(params);
          setOpenFilter(false);
        }}
        sx={{
          mt: 3,
          backgroundColor: "black",
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        Apply
      </Button>
    </Box>
  );

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const pageParam = searchParams.get("page") || 1;
      const minParam = searchParams.get("minPrice") || 0;
      const maxParam = searchParams.get("maxPrice") || 7500;
      const categoryParam = searchParams.get("category");
      const inStockParam = searchParams.get("inStock");

      let url = "";

      if (id) {
        url = `${API}/products/category/${id}?page=${pageParam}&limit=9&minPrice=${minParam}&maxPrice=${maxParam}`;

        if (inStockParam === "true") {
          url += `&inStock=true`;
        }
      } else {
        url = `${API}/products/user?page=${pageParam}&limit=9&minPrice=${minParam}&maxPrice=${maxParam}`;

        if (categoryParam) {
          url += `&category=${categoryParam}`;
        }

        if (inStockParam === "true") {
          url += `&inStock=true`;
        }
      }

      const { data } = await axios.get(url);

      setProducts(data.products);
      setTotalPages(data.totalPages);
      setPage(Number(pageParam));
      setPrice([Number(minParam), Number(maxParam)]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <ScrollToTop />
      <Box
        display={"flex"}
        justifyContent={"center"}
        flexDirection={"column"}
        // position={"fixed"}
      >
        <Typography variant={"h4"} p={2} textAlign={"center"}>
          {id
            ? categories?.find((cat) => cat._id === id)?.name.toUpperCase()
            : // || "Category"
              "ALL PRODUCTS"}
        </Typography>
        <Divider
          sx={{
            borderColor: "#d8d8d8",
            borderWidth: 2,
          }}
        />
      </Box>
      <Box sx={{ position: "relative", zIndex: 1 }} mt={0}>
        <Container maxWidth="xl" sx={{ py: 6 }}>
          <Grid container spacing={4}>
            {/* DESKTOP SIDEBAR */}
            {!isMobile && (
              <Grid size={{ md: 2.5 }}>
                <Box
                  sx={{
                    // position: "sticky",
                    top: 100, // distance from top (adjust according to navbar height)
                    height: "fit-content",
                  }}
                >
                  <Paper elevation={3}>
                    <FilterContent />
                  </Paper>
                </Box>
              </Grid>
            )}

            <Grid size={{ xs: 12, md: 9.5 }} mt={-2}>
              <Box sx={{ position: "relative", minHeight: "100vh" }}>
                {/* LOADER OVERLAY */}
                {loading && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(255,255,255,0.7)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 5,
                      borderRadius: 2,
                    }}
                  >
                    <CircularProgress sx={{ color: "black" }} />
                  </Box>
                )}

                {/* Mobile Filter Button */}
                {isMobile && (
                  <Box display="flex" justifyContent="flex-end" mb={2}>
                    <Button
                      startIcon={<FilterListIcon />}
                      onClick={() => setOpenFilter(true)}
                      sx={{ color: "black" }}
                    >
                      Filter
                    </Button>
                  </Box>
                )}

                {/* PRODUCTS GRID */}
                <Grid container spacing={3}>
                  {products?.map((product) => {
                    const minEffectivePrice = Math.min(
                      ...product.sizes.map((size) =>
                        size.discountPrice ? size.discountPrice : size.price,
                      ),
                    );

                    const minOriginalPrice = Math.max(
                      ...product.sizes.map((size) => size.price),
                    );

                    return (
                      <Grid key={product._id} size={{ xs: 6, md: 4 }}>
                        <ProductCard
                          id={product?._id}
                          image={product.images[0]?.url}
                          title={product.name}
                          price={minEffectivePrice}
                          oldPrice={
                            minOriginalPrice > minEffectivePrice
                              ? minOriginalPrice
                              : null
                          }
                        />
                      </Grid>
                    );
                  })}
                </Grid>

                {/* PAGINATION */}
                <Box display="flex" justifyContent="center" mt={5}>
                  {!loading && (
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={(e, value) => {
                        const params = new URLSearchParams(searchParams);
                        params.set("page", value);
                        params.set("minPrice", price[0]);
                        params.set("maxPrice", price[1]);

                        setSearchParams(params);

                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }}
                      sx={{
                        "& .Mui-selected": {
                          backgroundColor: "black !important",
                          color: "#fff",
                        },
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* MOBILE DRAWER FILTER */}
          <Drawer
            anchor="right"
            open={openFilter}
            onClose={() => setOpenFilter(false)}
          >
            <Box display="flex" justifyContent="end" mr={1}>
              {/* <Typography fontWeight={700}>Filter</Typography> */}
              <IconButton onClick={() => setOpenFilter(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box mt={-5}>
              <FilterContent />
            </Box>
          </Drawer>
        </Container>
      </Box>
    </Box>
  );
};

export default AllProducts;
