import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Posts", href: "/posts" },
  { name: "Search", href: "/search" },
  { name: "Profile", href: "/profile" },
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <header className="bg-[#4A2343] w-full px-8 py-4 flex items-center justify-between shadow-md min-h-[48px]">
        {/* Logo and Title */}
        <div className="flex items-center gap-2 sm:gap-4">
          <img src="/stud-collab1.png" alt="Logo" className="h-10 w-10 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain" />
          <span className="text-white font-bold uppercase text-lg sm:text-2xl md:text-3xl tracking-wide">
            COLLABNEST
    </span>
        </div>
        {/* Navigation Tabs */}
        <nav className="flex-1 flex items-end justify-center">
          <ul className="flex gap-2 sm:gap-4 md:gap-8 items-end overflow-x-auto scrollbar-hide">
            {navLinks.map((link) => (
              <li key={link.name} className="flex items-end">
                <a
                  href={link.href}
                  className={`font-bold text-base sm:text-lg md:text-xl px-2 sm:px-3 md:px-4 py-1 transition-all duration-200
                    ${
                      (link.name === 'Home' && (location.pathname === '/' || location.pathname.startsWith('/post/')))
                        || location.pathname === link.href
                        ? 'bg-white text-[#4A2343] rounded-t-lg md:rounded-t-xl shadow-md border-b-2 border-b-white'
                        : 'text-white hover:underline hover:decoration-2 hover:decoration-white/80'
                    }
                  `}
                  style={{
                    boxShadow:
                      (link.name === 'Home' && (location.pathname === '/' || location.pathname.startsWith('/post/')))
                        || location.pathname === link.href
                        ? '0 1px 4px 0 #4A234322'
                        : undefined,
                    position: 'relative',
                    zIndex:
                      (link.name === 'Home' && (location.pathname === '/' || location.pathname.startsWith('/post/')))
                        || location.pathname === link.href
                        ? 2
                        : 1
                  }}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="ml-2 sm:ml-4 bg-white text-[#4A2343] font-bold text-sm sm:text-base md:text-lg px-3 sm:px-5 py-1 sm:py-2 rounded-md sm:rounded-lg shadow hover:bg-gray-100 transition cursor-pointer"
        >
          Logout
        </button>
  </header>
    </>
);
};

export default Header;