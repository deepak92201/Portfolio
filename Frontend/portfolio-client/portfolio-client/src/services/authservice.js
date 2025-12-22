import api from './api';

export const login = async (username, password) => {
  const response = await api.post('/api/auth/login', {
    username,
    password,
  });

  // Store JWT token
  localStorage.setItem('token', response.data.token);

  return response.data;
};
