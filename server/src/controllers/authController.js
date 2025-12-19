import {
  registerUser,
  loginUser,
  getUsers,
  getUserById
} from "../services/authService.js";

export async function register(req, res) {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function login(req, res) {
  try {
    const { identifier, password } = req.body;
    const result = await loginUser(identifier, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}

export async function listUsers(req, res) {
  try {
    const saccoId = req.user?.sacco_id; // optional: only show SACCO users
    const users = await getUsers(saccoId);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getUser(req, res) {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}