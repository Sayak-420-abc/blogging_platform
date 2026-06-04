import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export const getAllPosts = () => API.get("/posts");
export const getPostById = (id) => API.get(`/posts/${id}`);
export const createPost = (data) => API.post("/posts", data);
export const updatePost = (id, data) => API.put(`/posts/${id}`, data);
export const deletePost = (id) => API.delete(`/posts/${id}`);
