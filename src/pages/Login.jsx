import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginWithEmail } from '../features/auth/authSlice';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import GoogleLogin from '../component/GoogleLogin';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Email and password are required');
    }
    try {
      await dispatch(loginWithEmail({ email, password })).unwrap();
      toast.success('Login Successful');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error || 'Invalid email or password');
    }
  };

//   const handleGoogleLogin = () => {
//     const clientId = 701398278417-ccrbntcmhs72n0opv85mv1jp4i3atjfg.apps.googleusercontent.com;
//     const redirectUri = "http://localhost:3000/auth/google/callback";
//     const scope = "email profile";
//     const responseType = "code";
  
//     window.location.href = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
// };

// useEffect(()=>{
//   const params = new URLSearchParams(window.location.search);
//   const authToken = params.get("token");
 

//   if (authToken) {
//     // Store token in localStorage
//     localStorage.setItem("token", authToken);
//     setToken(authToken);


//     // Remove token from URL (for cleaner UI)
//     window.history.replaceState({}, document.title, window.location.pathname);
//     navigate('/dashboard'); 
// }else{
//   navigate('/login'); 
// }

// },[])





  return (
    <Container 
      maxWidth="xs" 
      className="flex items-center justify-center min-h-screen"
    >
      <Paper elevation={3} className="p-6">
        <Typography variant="h4" component="h2" className="mb-4 text-center">
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="mt-4"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <div className="flex justify-center mt-4">
        {/* <button onClick={handleGoogleLogin} className="bg-red-500 text-white px-4 py-2 rounded">
            Login with Google
        </button> */}
        </div>
        <p className="text-center mt-4">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-500">
            Register
          </a>
        </p>
      </Paper>
    </Container>
  );
};

export default Login;
