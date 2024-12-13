// Login.js
import React, { useState } from 'react';
import { useDispatch , useSelector } from 'react-redux';
import { loginWithFirebase, signupWithEmail , signupWithGoogle } from '../features/auth/authSlice';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const auth = useSelector((state)=>state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Email and password are required");
    }
    dispatch(loginWithFirebase({ email, password }))
      .unwrap()
      .then(() => {
        toast.success('Login Successful');
        navigate('/')
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleGoogleLogin = async () => {
    dispatch(signupWithGoogle())
    .then((user)=>{
      toast.success(`Welcome, ${user.name}`);
      navigate('/')
    })
    .catch((error) => { toast.error(error.message);
    })
  };

  return (
    <Container 
      maxWidth="xs" 
      className="flex items-center justify-center min-h-screen" // Flexbox classes for centering
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
          <Button type="submit" variant="contained" color="primary" fullWidth className="mt-4">
            Login
          </Button>
        </form>
        <div className="flex justify-center mt-4">
          <Button variant="outlined" onClick={handleGoogleLogin} className="w-full">
            Login with Google
          </Button>
        </div>
      </Paper>
    </Container>
  );
};

export default Login;