import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  Button,
  IconButton,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PeopleIcon from "@mui/icons-material/People";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import WarningIcon from "@mui/icons-material/Warning";
import { useAuth } from "../components/hooks/useAuth";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { LibraryStats } from "@/types";
import { bookService } from "@/services/bookService";
import Header from "@/components/organisms/Header";

const StatCard = ({ title, value, icon, color }: any) => (
  <Paper
    sx={{
      p: 3,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "100%",
    }}
  >
    <Box>
      <Typography color="text.secondary" variant="body2" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h3" fontWeight="bold">
        {value}
      </Typography>
    </Box>
    <Box sx={{ color, fontSize: 60 }}>{icon}</Box>
  </Paper>
);

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [stats, setStats] = useState<LibraryStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  // GET LIBRARY STATS
  useEffect(() => {
    fetchStats();
  }, []);
  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await bookService.getLibraryStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
       <Header activeTab="dashboard" />

      {/* Dashboard Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.username}!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Role: <strong>{user?.role}</strong>
        </Typography>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Books"
              value={loading ? "Loading..." : stats.totalBooks || 0}
              icon={<MenuBookIcon />}
              color="primary.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Available Books"
              value={loading ? "Loading..." : stats.availableBooks || 0}
              icon={<LibraryBooksIcon />}
              color="success.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Borrows"
              value={loading ? "Loading..." : stats.borrowedBooks || 0}
              icon={<PeopleIcon />}
              color="info.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Overdue Books"
              value={loading ? "Loading..." : stats.dueBooks || 0}
              icon={<WarningIcon />}
              color="error.main"
            />
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <Typography color="text.secondary">
            Recent borrowing activity will be displayed here...
          </Typography>
        </Paper>

        {/* Quick Actions */}
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button variant="contained" onClick={() => navigate("/books")}>
              Browse Books
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/borrow-records")}
            >
              View Borrow Records
            </Button>
            {user?.role === "ADMIN" && (
              <Button variant="outlined" onClick={() => navigate("/users")}>
                Manage Users
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
