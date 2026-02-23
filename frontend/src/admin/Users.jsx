import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useSelector } from "react-redux";

const Users = () => {
  const token = useSelector((state) => state.auth.token);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API}/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBlockUser = async (user) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_API}/users/${user._id}`,
        { isActive: !user.isActive },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_APP_API}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" mb={2}>
        All Users
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>

              <TableCell>{user.number}</TableCell>

              <TableCell>
                <Chip
                  label={user.role}
                  color={user.role === "admin" ? "primary" : "default"}
                />
              </TableCell>

              <TableCell>
                <Chip
                  label={user.isActive ? "Active" : "Blocked"}
                  color={user.isActive ? "success" : "error"}
                />
              </TableCell>

              <TableCell align="right">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => toggleBlockUser(user)}
                  sx={{ mr: 1 }}
                >
                  {user.isActive ? "Block" : "Unblock"}
                </Button>

                <Button
                  size="small"
                  color="error"
                  onClick={() => deleteUser(user._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default Users;
