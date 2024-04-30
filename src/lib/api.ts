import axios, { AxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000",
});

export interface ErrorMessages {
  [status: string]: string;
}

export const TOKEN_KEY = "token";
export const ROLE_KEY = "role";

export const getAuthRequestConfig = (): AxiosRequestConfig => {
  const token = getToken();
  return { headers: { Authorization: `Bearer ${token ? token : "no-content"}` } };
};

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) return token;
  return token;
};

export const getRole = () => {
  const role = localStorage.getItem(ROLE_KEY);
  if (role) return role;
  return role
};

export const setRole = (role: string) => {
  localStorage.setItem(ROLE_KEY, role);
};
