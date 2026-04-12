import api from "./axios";

// GET all users
export const getUsers = () => api.get("/users");

// GET user by id
export const getUserById = (id) => api.get(`/users/${id}`);

// Note sini
// GET user by email (for login)
// MockAPI supports query params: GET /users?email=xxx
export const getUserByEmail = (email) =>
  api.get("/users", { params: { email } });

// POST create user (register)
export const createUser = (data) => api.post("/users", data);

// PUT update user
export const updateUser = (id, data) => api.put(`/users/${id}`, data);

// DELETE user
export const deleteUser = (id) => api.delete(`/users/${id}`);

// LOGIN helper (client-side auth against MockAPI) ──────────────
// MockAPI has no built-in auth, so we filter by email + password
export const login = async (email, password) => {
  const res = await getUserByEmail(email);
  const users = res.data;
  const user = users.find(
    (u) => u.email === email && u.password === password
  );
  if (!user) throw new Error("Email atau password salah");
  return user;
};