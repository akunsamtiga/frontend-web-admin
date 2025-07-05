// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://management.mgc.bot/api', 
});

export default api;
