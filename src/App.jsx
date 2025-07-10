import React, { useEffect } from 'react';
import { authAPI } from './services/api';
import { loginSuccess, logout } from './store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import PostDetailPage from './pages/PostDetail';
import PostsPage from './pages/PostsPage';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoginPage from './components/Auth/LoginPage';
import Header from "./components/Layout/Header";
import Navbar from "./components/Layout/Navbar";
import PostCard from "./components/Posts/PostCard";
import { fetchPostsSuccess } from './store/slices/postsSlice';
import Search from './pages/Search';

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const posts = useSelector(state => state.posts.posts);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const [authChecked, setAuthChecked] = React.useState(false);
  // Routes that should NOT have the Layout (no top bar)
  const noLayoutRoutes = ['/login', '/register', '/forgot-password'];
  const isNoLayout = noLayoutRoutes.includes(location.pathname);

  useEffect(() => {
    // On mount, verify token if present
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authAPI.getProfile();
          dispatch(loginSuccess({ user: res.data, token }));
        } catch (err) {
          dispatch(logout());
          window.location.href = '/login';
        }
      }
      setAuthChecked(true);
    };
    checkAuth();
    // eslint-disable-next-line
  }, [dispatch]);

  if (!authChecked) {
    // Optionally show a loading spinner here
    return null;
  }

  // If not authenticated and not on a no-layout route, redirect to login
  if (!isAuthenticated && !isNoLayout) {
    window.location.href = '/login';
    return null;
  }

  return isNoLayout ? (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  ) : (
    <div className="min-h-screen bg-[#fdfaf7] font-sans">
      <Header />
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostDetailPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        {/* Add other routes as needed */}
      </Routes>
    </div>
  );
}

export default App;
