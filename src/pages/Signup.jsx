// Signup.js
import React, { useState } from 'react';
import { useDispatch , useSelector } from 'react-redux';
import { signupWithEmail , signupWithGoogle } from '../features/auth/authSlice';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

 const navigate = useNavigate();

  const dispatch = useDispatch();
  const auth = useSelector((state)=>state.auth);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await dispatch(signupWithEmail({ email, password, name }));
      toast.success('Signup Successful');
    } catch (error) {
      toast.error(error.message || 'Something went wrong during signup');
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const user = await dispatch(signupWithGoogle());
      if (user) {
        console.log(user)
        toast.success(`Welcome, ${user.displayName}`);
        navigate('/')
      } else {
        toast.error('User signup failed');
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong with Google Signup');
    }
  };

  return (
    <Container maxWidth="xs" className="flex justify-center items-center min-h-screen">
      <Paper elevation={3} className="p-6">
        <Typography variant="h4" component="h2" className="mb-4 text-center">
          Signup
        </Typography>
        <form onSubmit={handleSignup}>
          <TextField
            label="Name"
            type="text"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            Sign Up
          </Button>
        </form>
        <div className="flex justify-center mt-4">
          <Button variant="outlined" onClick={handleGoogleSignup} className="w-full">
            Sign Up with Google
          </Button>
        </div>
      </Paper>
    </Container>
  );
};

export default Signup;