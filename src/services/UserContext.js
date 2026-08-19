import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                try {
                    const res = await api.get('/user/user');
                    if (res && res.data) {
                        setUser({ ...res.data, token: accessToken }); // Include token in user state
                    }
                } catch (err) {
                    console.error('Error during HTTP request:', err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };        
        fetchUser();
    }, []);

    const login = async (credentials) => {
        try {
            const res = await api.post('/auth/login', credentials, { withCredentials: true }); 
            if (res && res.data) {
                setUser({ ...res.data.user, token: res.data.accessToken }); // Add token to user state
                localStorage.setItem('accessToken', res.data.accessToken); // Store in local storage
            }
        } catch (err) {
            console.error('Error during login:', err);
            throw err; 
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null); // clearing the user state on logout
            localStorage.removeItem('accessToken'); // removing the token from local storage
        } catch (err) {
            console.error('Error during logout:', err);
        }
    };

    const refreshUser = useCallback(async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          try {
            const res = await api.get('/user/user');
            if (res && res.data) {
              setUser({ ...res.data, token: accessToken });
            }
          } catch (err) {
            console.error('Error refreshing user data:', err);
          }
        }
    }, []);

    // Add the updateUserProfile function
    const updateUserProfile = (updatedUser) => {
        setUser(updatedUser); // Update the user state
    };

    return (
        <UserContext.Provider value={{ user, setUser, loading, login, logout, updateUserProfile, refreshUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);