import {
  registerUser,
  loginUser,
  assignRolesToUser,
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

export async function updateUserRoles(req, res) {
  try {
    const userId = req.params.id;
    const { roles } = req.body; // array of role IDs
    const assignedBy = req.user.id; // super admin performing the update

    const result = await assignRolesToUser(userId, roles, assignedBy);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function listUsers(req, res) {
  try {
    const users = await getUsers(req.user); // pass the logged-in user
    res.json(users);
  } catch (err) {
    console.error("listUsers error:", err);
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