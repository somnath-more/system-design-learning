import { useAuth } from "@/components/hooks/useAuth";
import { logout } from "@/redux/slices/authSlice";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import {
  AppBar,
  Box,
  Button,
  Chip,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Header: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // ✅ Reusable Nav Config
  const navItems = [
    { label: "Dashboard", path: "/dashboard", key: "dashboard" },
    { label: "Books", path: "/books", key: "books" },
    { label: "Borrow", path: "/borrow-records", key: "borrow-records" },
  ];

  if (user?.role === "ADMIN" || user?.role === "LIBRARIAN") {
    navItems.push({ label: "Users", path: "/users", key: "users" });
  }

  return (
    <AppBar
      position="static"
      sx={{
        background: "transparent",
        boxShadow: "none",
        mt: 2,
      }}
    >
      <Toolbar
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          width: "100%",
          px: 3,
          py: 1,
          borderRadius: "50px",
          backdropFilter: "blur(12px)",
          background: "rgba(255,255,255,0.85)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* LEFT SECTION */}
        <Box display="flex" alignItems="center" gap={1}>
          <MenuBookIcon sx={{ color: "#2a5298" }} />
          <Typography fontWeight={700}>
            Library
          </Typography>
        </Box>

        {/* CENTER NAV */}
        <Box display="flex" gap={1}>
          {navItems.map((item) => {
            const isActive = activeTab === item.key;

            return (
              <Button
                key={item.key}
                onClick={() => navigate(item.path)}
                sx={{
                  px: 2,
                  borderRadius: "20px",
                  textTransform: "none",
                  fontWeight: 500,
                  color: isActive ? "#fff" : "text.primary",
                  background: isActive
                    ? "linear-gradient(135deg, #667eea, #764ba2)"
                    : "transparent",
                  "&:hover": {
                    background: isActive
                      ? "linear-gradient(135deg, #667eea, #764ba2)"
                      : "rgba(0,0,0,0.05)",
                  },
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Box>

        {/* RIGHT SECTION */}
        <Box display="flex" alignItems="center" gap={2}>
          {/* User Info */}
          {/* <Box textAlign="right">
            <Typography fontSize={13} fontWeight={600}>
              {user?.username}
            </Typography>
            <Typography fontSize={11} color="text.secondary">
              {user?.role}
            </Typography>
          </Box> */}

          {/* Role Chip */}
          <Chip
            label={user?.role}
            size="small"
            sx={{
              textTransform: "capitalize",
              fontWeight: 500,
            }}
          />

          {/* Logout */}
          <IconButton
            onClick={handleLogout}
            sx={{
              bgcolor: "rgba(0,0,0,0.05)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.1)" },
            }}
          >
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;