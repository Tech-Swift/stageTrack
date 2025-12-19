 import bcrypt from "bcrypt";
import { Op } from "sequelize";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js"; // your JWT helper

/**
 * Register a new user
 */
export async function registerUser({
  full_name,
  email,
  phone,
  password,
  role = "user",
  sacco_id,
  stage_id
}) {
  // Check required fields
  if (!full_name || !email || !phone || !password) {
    throw new Error("Full name, email, phone, and password are required");
  }

  // Check duplicates
  const existing = await User.findOne({
    where: { [Op.or]: [{ email }, { phone }] }
  });
  if (existing) throw new Error("Email or phone already in use");

  // Hash password
  const password_hash = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    full_name,
    email,
    phone,
    password_hash,
    role,
    sacco_id,
    stage_id,
    status: "active"
  });

  // Generate JWT
  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
    sacco_id: user.sacco_id,
    stage_id: user.stage_id
  });

  return { user, token };
}

/**
 * Login user
 */
export async function loginUser(identifier, password) {
  // identifier = email or phone
  const user = await User.findOne({
    where: { [Op.or]: [{ email: identifier }, { phone: identifier }] },
    include: ["sacco", "stage"]
  });
  if (!user) throw new Error("Invalid credentials");

  // Check password
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) throw new Error("Invalid credentials");

  // Generate JWT
  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
    sacco_id: user.sacco_id,
    stage_id: user.stage_id
  });

  return { user, token };
}

/**
 * Get all users (optionally filter by SACCO)
 */
export async function getUsers(saccoId = null) {
  const where = saccoId ? { sacco_id: saccoId } : {};
  return User.findAll({ where, include: ["sacco", "stage"] });
}

/**
 * Get single user by ID
 */
export async function getUserById(userId) {
  return User.findByPk(userId, { include: ["sacco", "stage"] });
}
