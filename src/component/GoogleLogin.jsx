import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            localStorage.setItem('authToken', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            navigate('/dashboard');  // Redirect to a protected page
        } else {
            navigate('/login');
        }
    }, [navigate]);

    return <h2>Authenticating...</h2>;
};

export default AuthRedirect;
