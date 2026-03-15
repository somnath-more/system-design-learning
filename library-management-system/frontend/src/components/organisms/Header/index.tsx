import { useAuth } from "@/components/hooks/useAuth";
import { logout } from "@/redux/slices/authSlice";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Header: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  return (
    <AppBar
      position="static"
      sx={{
        background: "transparent",
        boxShadow: "none",
        px: 2,
        mt: 2,
      }}
    >
      <Toolbar
        sx={{
          borderRadius: "40px",
          bgcolor: "white",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          px: 3,
          py: 1,
          maxWidth: "1200px",
          mx: "auto",
        }}
      >
        <MenuBookIcon sx={{ mr: 2, color: "primary.main" }} />

        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            color: "text.primary",
          }}
        >
          Library Management System
        </Typography>

        <Button
          onClick={() => navigate("/dashboard")}
          variant={activeTab === "dashboard" ? "contained" : "text"}
          sx={{
            mx: 1,
            backgroundColor: activeTab === "dashboard" ? "#f5f5f5" : "",
            color: activeTab === "dashboard" ? "text.primary" : "primary.main",
            "&:hover": {
              backgroundColor: activeTab === "dashboard" ? "#f5f5f5" : "",
            },
          }}
        >
          Dashboard
        </Button>

        <Button
          onClick={() => navigate("/books")}
          variant={activeTab === "books" ? "contained" : "text"}
          sx={{
            mx: 1,
            backgroundColor: activeTab === "books" ? "#f5f5f5" : "",
            color: activeTab === "books" ? "text.primary" : "primary.main",
            "&:hover": {
              backgroundColor: activeTab === "books" ? "#f5f5f5" : "",
            },
          }}
        >
          Books
        </Button>

        <Button
          onClick={() => navigate("/borrow-records")}
          //   variant={activeTab === "borrow-records" ? "contained" : "text"}
          sx={{
            mx: 1,
            backgroundColor: activeTab === "borrow-records" ? "#f5f5f5" : "",
            color:
              activeTab === "borrow-records" ? "text.primary" : "primary.main",
            "&:hover": {
              backgroundColor: activeTab === "borrow-records" ? "#f5f5f5" : "",
            },
          }}
        >
          Borrow Records
        </Button>

        {(user?.role === "ADMIN" || user?.role === "LIBRARIAN") && (
          <Button
            onClick={() => navigate("/users")}
            variant={activeTab === "users" ? "contained" : "text"}
            sx={{
              mx: 1,
              backgroundColor: activeTab === "users" ? "#f5f5f5" : "",
              color: activeTab === "users" ? "text.primary" : "primary.main",
              "&:hover": {
                backgroundColor: activeTab === "users" ? "#f5f5f5" : "",
              },
            }}
          >
            Users
          </Button>
        )}

        <IconButton
          title={"Click to logout"}
          onClick={handleLogout}
          sx={{ ml: 2, color: "text.primary" }}
        >
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
