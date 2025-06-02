import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import users from '../../assets/users.json';

type User = {
  loginUser: string;
  role: 'admin' | 'user';
};

type AuthContextType = {
  user: User | null;
  login: (loginUser: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Проверка авторизации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        // Здесь можно добавить проверку токена через API
        setUser({ loginUser: 'admin', role: 'admin' });
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (loginUser: string, password: string) => {
    setIsLoading(true);
    const foundUser = users.find(u => u.login === loginUser && u.password === password);

    if (foundUser) {
      await AsyncStorage.setItem('authToken', 'fake-jwt-token');
      setUser({ 
        loginUser, 
        role: foundUser.role as 'admin' | 'user' });
      router.replace('/(app)/home');
    } else {
      alert('Неверный логин или пароль');
    }
    setIsLoading(false);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    setUser(null);
    router.replace('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};