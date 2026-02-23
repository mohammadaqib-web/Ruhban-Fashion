import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Avatar,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Backdrop } from "@mui/material";

const Categories = () => {
  const token = useSelector((state) => state.auth.token);

  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    image: null,
  });

  // ================= FETCH CATEGORIES =================
  const fetchCategories = async () => {
    try {
      setFetching(true);

      const res = await axios.get(
        `${import.meta.env.VITE_APP_API}/categories/admin`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setCategories(res.data.categories);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });

      if (file) {
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData({ ...formData, name: e.target.value });
    }
  };

  // ================= OPEN DIALOG =================
  const handleOpen = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, image: null });
      setPreview(category.image?.url); // show existing image
    } else {
      setEditingCategory(null);
      setFormData({ name: "", image: null });
      setPreview(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPreview(null);
  };

  // ================= CREATE / UPDATE =================
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const data = new FormData();
      data.append("name", formData.name);
      if (formData.image) {
        data.append("image", formData.image);
      }

      if (editingCategory) {
        await axios.put(
          `${import.meta.env.VITE_APP_API}/categories/${editingCategory._id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        toast.success("Category updated");
      } else {
        await axios.post(`${import.meta.env.VITE_APP_API}/categories`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Category created");
      }

      fetchCategories();
      handleClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      setLoading(true);

      await axios.delete(`${import.meta.env.VITE_APP_API}/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Category deleted");
      fetchCategories();
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Categories</Typography>
        <Button
          variant="contained"
          onClick={() => handleOpen()}
          disabled={loading}
        >
          Add Category
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {categories.map((cat) => (
            <TableRow key={cat._id}>
              <TableCell>
                <Avatar src={cat.image?.url} />
              </TableCell>
              <TableCell>{cat.name}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleOpen(cat)} disabled={loading}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(cat._id)}
                  disabled={loading}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ================= DIALOG ================= */}
      <Dialog
        open={open}
        onClose={() => !loading && handleClose()}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            width: { xs: "90%", sm: 420 },
            maxWidth: 420,
          },
        }}
      >
        <DialogTitle>
          {editingCategory ? "Edit Category" : "Add Category"}
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Category Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          {preview && (
            <Box
              mt={5}
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ height: 140 }}
            >
              <img
                src={preview}
                alt="Preview"
                style={{
                  maxWidth: 200,
                  maxHeight: 200,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                }}
              />
            </Box>
          )}

          <Button component="label" sx={{ mt: preview ? 4 : 2 }}>
            Upload Image
            <input hidden type="file" name="image" onChange={handleChange} />
          </Button>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{
          color: "black",
          zIndex: (theme) => theme.zIndex.drawer + 999,
          backdropFilter: "blur(3px)", // smooth freeze effect
        }}
        open={loading || fetching}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Paper>
  );
};

export default Categories;
