// Signup.js
import React, { useEffect, useState } from 'react';
import { useDispatch , useSelector } from 'react-redux';
import { signupWithEmail  } from '../features/auth/authSlice';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import GoogleLogin from '../component/GoogleLogin';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

 const navigate = useNavigate();

  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await dispatch(signupWithEmail({ email, password, name })).unwrap();
      toast.success('Signup Successful');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Something went wrong during signup');
    }
  };
//   const handleGoogleLogin = () => {
//     window.location.href = 'http://localhost:3000/auth/google';
// };

// useEffect(()=>{
//   const params = new URLSearchParams(window.location.search);
//   const authToken = params.get("token");
//   const navigate = useNavigate();

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
         <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="mt-4"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
        <div className="flex justify-center mt-4">
        {/* <button onClick={handleGoogleLogin} className="bg-red-500 text-white px-4 py-2 rounded">
            Login with Google
        </button> */}
        </div>
        <p className="text-center mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500">
            Login
          </a>
        </p>
      </Paper>
    </Container>
  );
};

export default Signup;