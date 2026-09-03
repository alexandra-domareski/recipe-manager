import RecipeLogo from "../assets/images/logo.png";
import { Link, useLocation } from "react-router-dom";
import { Plus, LogOut, User, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <nav className="flex flex-wrap items-center justify-between gap-y-3 bg-[#F7F2F1] p-4 rounded-xl shadow-md">
      <Link to="/">
        <img src={RecipeLogo} alt="Recipe Book Logo" className="h-14 sm:h-20 w-auto" />
      </Link>

      <div className="flex items-center gap-2 sm:gap-4">
        {isAuthenticated ? (
          <>
            <span className="hidden sm:flex text-sm text-[#3A2A1A] items-center gap-2">
              <User size={16} />
              {user?.name || user?.email}
            </span>
            <Link to="/recipes/new">
              <button className="cursor-pointer flex items-center gap-2 whitespace-nowrap rounded-md bg-[#D28625] px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-[#AB9983] transition">
                <Plus size={16} /> Add Recipe
              </button>
            </Link>
            <button
              onClick={logout}
              className="cursor-pointer flex items-center gap-2 whitespace-nowrap rounded-md border border-[#D4C8BE] bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[#3A2A1A] hover:bg-[#D4C8BE] transition"
            >
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : isLoginPage ? (
          <Link to="/register">
            <button className="cursor-pointer flex items-center gap-2 whitespace-nowrap rounded-md border border-[#D28625] bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[#D28625] hover:bg-[#F7F2F1] transition">
              <UserPlus size={16} /> Register
            </button>
          </Link>
        ) : (
          <Link to="/login">
            <button className="cursor-pointer flex items-center gap-2 whitespace-nowrap rounded-md bg-[#D28625] px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-[#AB9983] transition">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
