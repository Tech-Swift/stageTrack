// src/controllers/roleController.js
import {
  getAllRoles,
  assignRole,
  getRolesForUser
} from "../services/roleService.js";

/**
 * GET /api/roles
 * Return all roles sorted by hierarchy
 */
export async function listRoles(req, res) {
  try {
    const roles = await getAllRoles();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/**
 * POST /api/roles/assign
 * Assign a role to a user
 * Body: { userId, roleId }
 */
export async function assignUserRole(req, res) {
  try {
    const currentUser = req.user; // populated from auth middleware
    const { userId, roleId } = req.body;

    const result = await assignRole(currentUser, userId, roleId);
    res.json(result);
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
}

/**
 * GET /api/roles/user/:id
 * Get all roles assigned to a specific user
 */
export async function getUserRoles(req, res) {
  try {
    const userId = req.params.id;
    const roles = await getRolesForUser(userId);
    res.json(roles);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}
