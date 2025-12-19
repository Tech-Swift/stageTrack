import bcrypt from "bcrypt";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { Op } from "sequelize";


export async function registerUser({ full_name, email, phone, password }) {
  // Validate required fields
  if (!full_name || !email || !phone || !password) {
    throw new Error("All fields are required");
  }

  // Check for existing email or phone
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ email }, { phone }]
    }
  });

  if (existingUser) {
    throw new Error("Email or phone already in use");
  }

  // Hash password
  const password_hash = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    full_name,
    email,
    phone,
    password_hash,
    status: "active"
  });

  // Generate JWT
  const token = signToken(user);

  return {
    token,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone
    }
  };
}

export async function loginUser(identifier, password) {
  const user = await User.findOne({
    where: {
      status: "active",
      ...(identifier.includes("@")
        ? { email: identifier }
        : { phone: identifier })
    }
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const passwordValid = await bcrypt.compare(password, user.password_hash);

  if (!passwordValid) {
    throw new Error("Invalid credentials");
  }

  const token = signToken(user);

  return {
    token,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone
    }
  };
}
