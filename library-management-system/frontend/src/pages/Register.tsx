import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  MenuItem,
  CircularProgress,
  Stack,
  Divider,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";

import { register, selectAuthLoading } from "../redux/slices/authSlice";
import { AppDispatch } from "../redux/store";
import { RegisterRequest, Role } from "../types";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectAuthLoading);

  const [formData, setFormData] = useState<RegisterRequest>({
    username: "",
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    role: Role.MEMBER,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(register(formData)).unwrap();
      navigate("/dashboard");
    } catch (error) {}
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        overflow: "hidden", // 🚀 prevents outer scroll
      }}
    >
      <Container maxWidth="md">
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            maxHeight: "90vh", // 🚀 key fix
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent
            sx={{
              p: 3,
              overflowY: "auto", 
              scrollbarWidth: "thin",
              "&::-webkit-scrollbar": {
                width: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,0,0,0.2)",
                borderRadius: "4px",  
              }
            }}
          >
            {/* HEADER */}
            <Box textAlign="center" mb={4}>
              <MenuBookIcon
                sx={{
                  fontSize: 50,
                  color: "#2a5298",
                  mb: 1,
                }}
              />
              <Typography variant="h5" fontWeight={700}>
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Join our library community 📚
              </Typography>
            </Box>

            {/* FORM */}
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* BASIC INFO */}
                <Box>
                  <Typography variant="subtitle2" mb={0.5}>
                    Basic Information
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Username"
                        size="small"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                {/* CONTACT INFO */}
                <Box>
                  <Typography variant="subtitle2" mb={0.5}>
                    Contact Details
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Phone Number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        size="small"
                        fullWidth
                        select
                        label="Role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                      >
                        <MenuItem value={Role.MEMBER}>Member</MenuItem>
                        <MenuItem value={Role.LIBRARIAN}>Librarian</MenuItem>
                        <MenuItem value={Role.ADMIN}>Admin</MenuItem>
                      </TextField>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Address"
                        name="address"
                        multiline
                        rows={2}
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* SUBMIT */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="medium"
                  disabled={loading}
                  sx={{
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: "none",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : "Create Account"}
                </Button>

                {/* FOOTER */}
                <Typography variant="body2" align="center">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    style={{
                      color: "#2a5298",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
