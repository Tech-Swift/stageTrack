import { registerUser, loginUser } from "../services/authService.js";


export async function register(req, res) {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function login(req, res) {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const result = await loginUser(identifier, password);
    res.json(result);

  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}

export async function me(req, res) {
  res.json(req.user);
}
