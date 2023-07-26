import React, { useState } from 'react';
import jwt_decode from 'jwt-decode';
import AuthContext from './auth-context';
import { useNavigate } from 'react-router-dom';

const AuthProvider = (props) => {
  const tokenKey = 'token';
  const walletKey = 'wallet';

  const retrieveToken = () => localStorage.getItem(tokenKey);
  const retrieveWallet = () => JSON.parse(localStorage.getItem(walletKey));

  const [wallet, setWallet] = useState(retrieveWallet);
  const [token, setToken] = useState(retrieveToken);
  const [isLoggedIn, setIsLoggedIn] = useState(wallet && token);
  const navigate = useNavigate();

  const login = (newToken, rememberDetails, newWallet) => {
    if (token === newToken) return;

    setToken(newToken);

    const wallet = newWallet ? newWallet : parseToken(newToken);
    setWallet(wallet);

    if (rememberDetails) {
      localStorage.setItem(tokenKey, newToken);
      localStorage.setItem(walletKey, JSON.stringify(wallet));
    } else {
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(walletKey);
    }

    setIsLoggedIn(true);
    navigate('/');
  };

  const parseToken = (token) => {
    var decoded = jwt_decode(token);

    return {
      id: decoded.id,
      name: decoded.name,
      logoURL: decoded.logo_url,
      createdAt: decoded.created_at,
      expiration: decoded.expiration,
      about: decoded.about,
    };
  };

  const logout = () => {
    setWallet(undefined);
    setToken(undefined);
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(walletKey);
    navigate('/login');
  };

  const value = {
    isLoggedIn,
    login,
    logout,
    wallet,
    token,
    ...props.value,
  };

  if (!wallet || !token) {
    const localToken = JSON.parse(localStorage.getItem(tokenKey));
    const localWallet = JSON.parse(localStorage.getItem(walletKey));

    if (localToken && localWallet) {
      login(localToken, true, localWallet);
    }
  }

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};

export default AuthProvider;
