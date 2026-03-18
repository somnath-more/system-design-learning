import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Stack,
  Skeleton,
} from "@mui/material";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import PeopleIcon from "@mui/icons-material/People";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import WarningIcon from "@mui/icons-material/Warning";

import { useAuth } from "../components/hooks/useAuth";
import { LibraryStats } from "@/types";
import { bookService } from "@/services/bookService";
import Header from "@/components/organisms/Header";


// 🔥 Reusable Stat Card
const StatCard = ({ title, value, icon, color, loading }: any) => (
  <Paper
    sx={{
      p: 3,
      borderRadius: 3,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      transition: "0.3s",
      boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      },
    }}
  >
    <Box>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>

      {loading ? (
        <Skeleton width={60} height={40} />
      ) : (
        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>
      )}
    </Box>

    <Box
      sx={{
        bgcolor: `${color}.light`,
        color: `${color}.main`,
        p: 1.5,
        borderRadius: 2,
        display: "flex",
      }}
    >
      {icon}
    </Box>
  </Paper>
);

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<LibraryStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await bookService.getLibraryStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Header activeTab="dashboard" />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        
        {/* HEADER */}
        <Box mb={4}>
          <Typography variant="h5" fontWeight={700}>
            Welcome back, {user?.username} 👋
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Here’s what’s happening in your library today
          </Typography>
        </Box>

        {/* STATS */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Books"
              value={stats.totalBooks || 0}
              icon={<MenuBookIcon />}
              color="primary"
              loading={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Available Books"
              value={stats.availableBooks || 0}
              icon={<LibraryBooksIcon />}
              color="success"
              loading={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Borrows"
              value={stats.borrowedBooks || 0}
              icon={<PeopleIcon />}
              color="info"
              loading={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Overdue Books"
              value={stats.dueBooks || 0}
              icon={<WarningIcon />}
              color="error"
              loading={loading}
            />
          </Grid>
        </Grid>

        {/* CONTENT GRID */}
        <Grid container spacing={3} mt={1}>
          
          {/* RECENT ACTIVITY */}
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
              }}
            >
              <Typography variant="h6" fontWeight={600} mb={2}>
                Recent Activity
              </Typography>

              <Typography color="text.secondary">
                Borrowing history and activity will appear here...
              </Typography>
            </Paper>
          </Grid>

          {/* QUICK ACTIONS */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" fontWeight={600} mb={2}>
                Quick Actions
              </Typography>

              <Stack spacing={2}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate("/books")}
                >
                  Browse Books
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/borrow-records")}
                >
                  Borrow Records
                </Button>

                {user?.role === "ADMIN" && (
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate("/users")}
                  >
                    Manage Users
                  </Button>
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
}