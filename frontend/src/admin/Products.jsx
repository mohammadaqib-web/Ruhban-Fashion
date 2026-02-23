import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Paper,
  CircularProgress,
  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FormControlLabel, Checkbox } from "@mui/material";

const Products = () => {
  const token = useSelector((state) => state.auth.token);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    sizes: [{ size: "", price: "", discountPrice: "", stock: "" }],
    colors: "",
    isFeatured: false,
    isActive: true,
    images: [],
  });

  const [previewImages, setPreviewImages] = useState([]);

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    try {
      setFetching(true);
      const res = await axios.get(`${import.meta.env.VITE_APP_API}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data.products);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setFetching(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_API}/categories`);
      setCategories(res.data.categories);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "images") {
      const fileArray = Array.from(files);
      setFormData({ ...formData, images: fileArray });

      const previews = fileArray.map((file) => URL.createObjectURL(file));
      setPreviewImages(previews);
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSizeChange = (index, field, value) => {
    const updated = [...formData.sizes];
    updated[index][field] = value;
    setFormData({ ...formData, sizes: updated });
  };

  const addSizeRow = () => {
    setFormData({
      ...formData,
      sizes: [
        ...formData.sizes,
        { size: "", price: "", discountPrice: "", stock: "" },
      ],
    });
  };

  const removeSizeRow = (index) => {
    if (formData.sizes.length === 1) return;

    const updated = formData.sizes.filter((_, i) => i !== index);
    setFormData({ ...formData, sizes: updated });
  };

  // ================= OPEN DIALOG =================
  const handleOpen = (product = null) => {
    if (product) {
      setEditingProduct(product);

      setFormData({
        name: product.name,
        description: product.description,
        category: product.category?._id || "",
        sizes:
          product.sizes?.length > 0
            ? product.sizes
            : [{ size: "", price: "", discountPrice: "", stock: "" }],
        colors: product.colors?.join(", ") || "",
        isFeatured: product.isFeatured,
        isActive: product.isActive,
        images: [],
      });

      setPreviewImages(product.images?.map((img) => img.url) || []);
    } else {
      setEditingProduct(null);

      setFormData({
        name: "",
        description: "",
        category: "",
        sizes: [{ size: "", price: "", discountPrice: "", stock: "" }],
        colors: "",
        isFeatured: false,
        isActive: true,
        images: [],
      });

      setPreviewImages([]);
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPreviewImages([]);
  };

  // ================= SAVE PRODUCT =================
  const handleSave = async () => {
    try {
      setLoading(true);

      if (!formData.name || !formData.description || !formData.category) {
        toast.error("Required fields missing");
        setLoading(false);
        return;
      }

      // 🔥 Validate sizes
      for (let size of formData.sizes) {
        if (!size.size || !size.price || size.stock === "") {
          toast.error("Each size must have size, price and stock");
          setLoading(false);
          return;
        }
      }

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("category", formData.category);

      // 🔥 Convert numbers properly
      const normalizedSizes = formData.sizes.map((s) => ({
        size: s.size,
        price: Number(s.price),
        discountPrice: s.discountPrice ? Number(s.discountPrice) : undefined,
        stock: Number(s.stock),
      }));

      data.append("sizes", JSON.stringify(normalizedSizes));

      const colorsArray = formData.colors
        ? formData.colors.split(",").map((c) => c.trim())
        : [];

      data.append("colors", JSON.stringify(colorsArray));

      data.append("isFeatured", formData.isFeatured);
      data.append("isActive", formData.isActive);

      formData.images.forEach((file) => {
        data.append("images", file);
      });

      if (editingProduct) {
        await axios.put(
          `${import.meta.env.VITE_APP_API}/products/${editingProduct._id}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        toast.success("Product updated");
      } else {
        await axios.post(`${import.meta.env.VITE_APP_API}/products`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product created");
      }

      fetchProducts();
      handleClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE PRODUCT =================
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${import.meta.env.VITE_APP_API}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted");
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 3,
      }}
    >
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Products</Typography>
        <Button variant="contained" onClick={() => handleOpen()}>
          Add Product
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Variants</TableCell>
            <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
              Total Stock
            </TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {fetching ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                No products found
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => {
              const minPrice = product.sizes?.length
                ? Math.min(...product.sizes.map((s) => s.price))
                : 0;

              const totalStock = product.sizes?.reduce(
                (acc, s) => acc + Number(s.stock),
                0,
              );

              return (
                <TableRow
                  key={product._id}
                  hover
                  sx={{ "&:last-child td": { borderBottom: 0 } }}
                >
                  <TableCell>
                    <Avatar
                      src={product.images?.[0]?.url}
                      variant="rounded"
                      sx={{ width: 60, height: 60 }}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography fontWeight="600">{product.name}</Typography>

                    <Typography variant="body2" color="text.secondary">
                      ₹ {minPrice}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {product.category?.name}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box>
                      {product.sizes?.map((s, i) => (
                        <Typography key={i} variant="body2">
                          {s.size} — ₹{s.price} ({s.stock})
                        </Typography>
                      ))}
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Typography fontWeight="600">{totalStock}</Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ mr: 1 }}
                      onClick={() => handleOpen(product)}
                    >
                      Edit
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {/* CREATE / UPDATE DIALOG */}
      <Dialog
        open={open}
        onClose={() => !loading && handleClose()}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {editingProduct ? "Edit Product" : "Add Product"}
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />
          <Typography sx={{ mt: 3, mb: 1 }}>Sizes & Pricing</Typography>

          {formData.sizes.map((sizeObj, index) => (
            <Box
              key={index}
              display="grid"
              gridTemplateColumns="1fr 1fr 1fr 1fr auto"
              gap={2}
              mb={2}
            >
              {" "}
              <TextField
                label="Size"
                value={sizeObj.size}
                onChange={(e) =>
                  handleSizeChange(index, "size", e.target.value)
                }
              />
              <TextField
                label="Price"
                type="number"
                value={sizeObj.price}
                onChange={(e) =>
                  handleSizeChange(index, "price", e.target.value)
                }
              />
              <TextField
                label="Discount"
                type="number"
                value={sizeObj.discountPrice}
                onChange={(e) =>
                  handleSizeChange(index, "discountPrice", e.target.value)
                }
              />
              <TextField
                label="Stock"
                type="number"
                value={sizeObj.stock}
                onChange={(e) =>
                  handleSizeChange(index, "stock", e.target.value)
                }
              />
              <Button color="error" onClick={() => removeSizeRow(index)}>
                Remove
              </Button>
            </Box>
          ))}

          <Button variant="outlined" onClick={addSizeRow}>
            Add Size
          </Button>

          {/* <TextField
            fullWidth
            label="Colors (comma separated)"
            name="colors"
            value={formData.colors}
            onChange={handleChange}
            sx={{ mt: 2 }}
          /> */}

          <TextField
            select
            fullWidth
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            sx={{ mt: 2 }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>

          {/* <FormControlLabel
            control={
              <Checkbox
                checked={formData.isFeatured}
                onChange={handleChange}
                name="isFeatured"
              />
            }
            label="Featured Product"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isActive}
                onChange={handleChange}
                name="isActive"
              />
            }
            label="Active"
          /> */}
          <br />
          <Box display="flex" gap={2} mt={2} flexWrap="wrap">
            {previewImages.map((img, index) => (
              <Avatar
                key={index}
                src={img}
                variant="rounded"
                sx={{ width: 70, height: 70 }}
              />
            ))}
          </Box>
          <Button component="label" sx={{ mt: 2 }}>
            Upload Images
            <input
              hidden
              type="file"
              name="images"
              multiple
              accept="image/*"
              onChange={handleChange}
            />
          </Button>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {loading ? <CircularProgress size={20} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        open={loading}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 999 }}
      >
        <CircularProgress />
      </Backdrop>
    </Paper>
  );
};

export default Products;
