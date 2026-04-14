import api from "./axios";

// GET all users
export const getUsers = () => api.get("/users");

// GET user by id
export const getUserById = (id) => api.get(`/users/${id}`);

// GET user by email — filter di client karena MockAPI tidak support query params
export const getUserByEmail = async (email) => {
  const res = await getUsers();
  return {
    ...res,
    data: res.data.filter((u) => u.email === email),
  };
};

// POST create user (register)
export const createUser = (data) => api.post("/users", data);

// PUT update user
export const updateUser = (id, data) => api.put(`/users/${id}`, data);

// DELETE user
export const deleteUser = (id) => api.delete(`/users/${id}`);

// LOGIN
export const login = async (email, password) => {
  const res = await getUsers();
  const user = res.data.find(
    (u) => u.email === email && u.password === password
  );
  if (!user) throw new Error("Email atau password salah");
  return user;
};