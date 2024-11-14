// src/components/Auth.js
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const APIURL = import.meta.env.VITE_API_URL;


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const login = async (email, password) => {
        const response = await fetch(`${APIURL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);
            navigate('/home');
        } else {
            throw new Error('Login failed');
        }
    };

    const signup = async (email, password, name) => {
        const response = await fetch(`${APIURL}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name })
        });
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);
            navigate('/home');
        } else {
            throw new Error('Signup failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ token, user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
