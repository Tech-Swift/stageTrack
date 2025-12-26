import bcrypt from "bcrypt";
import { Op } from "sequelize";
import User from "../models/User/User.js";
import SaccoUser from "../models/Sacco/SaccoUser.js";
import Role from "../models/User/Role.js";
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
  const user = await User.findOne({
    where: { [Op.or]: [{ email: identifier }, { phone: identifier }] },
    include: [
      { model: Role, as: "roles", through: { attributes: [] }, attributes: ["id", "name", "hierarchy_level"] },
      {
        model: SaccoUser,
        as: "sacco_memberships",
        attributes: ["role", "sacco_id"],
        where: { status: "active" },
        required: false
      },
      "roles",
      "sacco",
      "stage"
    ]
  });

  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) throw new Error("Invalid credentials");

  // Get the first active SACCO membership (adjust if multiple)
  const saccoMembership = user.sacco_memberships?.[0];

  const token = signToken({
    id: user.id,
    email: user.email,
    role: saccoMembership?.role || null, // ✅ attach SACCO role
    sacco_id: saccoMembership?.sacco_id || null,
    stage_id: user.stage_id
  });

  return {
    user: {
      ...user.toJSON(),
      roles: saccoMembership ? [saccoMembership.role] : [],
      sacco_id: saccoMembership?.sacco_id || null
    },
    token
  };
}



export async function assignRolesToUser(userId, roleIds, assignedBy) {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  // Fetch roles
  const roles = await Role.findAll({
    where: { id: roleIds }
  });
  if (roles.length === 0) throw new Error("No valid roles found");

  // Assign roles (this will replace existing roles)
  await user.setRoles(roles, { through: { assigned_by_uuid: assignedBy, assigned_at: new Date() } });

  return { message: "Roles updated successfully" };
}

/**
 * Get all users (optionally filter by SACCO)
 */
export async function getUsers(saccoId = null) {
  const where = saccoId ? { sacco_id: saccoId } : {};
  return User.findAll({
    where,
    include: [
      { model: Role, as: "roles", through: { attributes: [] }, attributes: ["id", "name", "hierarchy_level"] },
      "sacco",
      "stage"
    ]
  });
}
/**
 * Get single user by ID
 */
 export async function getUserById(userId) {
  return User.findByPk(userId, {
    include: [
      { model: Role, as: "roles", through: { attributes: [] }, attributes: ["id", "name", "hierarchy_level"] },
      "sacco",
      "stage"
    ]
  });
}

