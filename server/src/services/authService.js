import bcrypt from "bcrypt";
import { Op } from "sequelize";
import User from "../models/User/User.js";
import SaccoUser from "../models/Sacco/SaccoUser.js";
import Role from "../models/User/Role.js";
import StageAssignment from "../models/Stage/StageAssignment.js";
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
  console.log("LOGIN FUNCTION VERSION: SYSTEM + SACCO ROLES");

  const user = await User.findOne({
    where: { [Op.or]: [{ email: identifier }, { phone: identifier }] },
    include: [
      {
        model: Role,
        as: "roles",
        through: { attributes: [] },
        attributes: ["id", "name", "hierarchy_level"]
      },
      {
        model: SaccoUser,
        as: "sacco_memberships",
        attributes: ["role", "sacco_id"],
        where: { status: "active" },
        required: false
      },
      "sacco",
      "stage"
    ]
  });

  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) throw new Error("Invalid credentials");

  // Detect if user has super_admin system role
  const isSuperAdmin = user.roles?.some(r => r.name === "super_admin");

  // Assign system_roles accordingly
  const systemRoles = isSuperAdmin ? ["super_admin"] : user.roles?.map(r => r.name) || [];

  // Get first active SACCO membership (for non-super_admin local users)
  const saccoMembership = isSuperAdmin ? null : user.sacco_memberships?.[0];

  // Sign JWT
  const token = signToken({
    id: user.id,
    email: user.email,
    system_roles: systemRoles,                 // global roles
    sacco_role: saccoMembership?.role || null, // local SACCO role
    sacco_id: saccoMembership?.sacco_id || null,
    stage_id: user.stage_id || null
  });

  return {
    user: {
      ...user.toJSON(),
      system_roles: systemRoles,
      sacco_role: saccoMembership?.role || null,
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
export async function getUsers() {
  return User.findAll({
    include: [
      {
        model: Role,
        as: "roles",
        through: { attributes: [] },
        attributes: ["id", "name", "hierarchy_level"],
        required: false
      }
    ]
  });
}

/**
 * Get single user by ID
 */
export async function getUserById(userId) {
  return User.findByPk(userId); // just return the user record
}


