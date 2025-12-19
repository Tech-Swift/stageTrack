// src/services/roleService.js
import User from "../models/User/User.js";
import Role from "../models/User/Role.js";
import UserRole from "../models/User/user_role.js";

/**
 * Get all roles sorted by hierarchy_level (highest first)
 */
export async function getAllRoles() {
  const roles = await Role.findAll({
    order: [["hierarchy_level", "DESC"]],
    attributes: ["id", "name", "description", "hierarchy_level", "created_at", "updated_at"]
  });
  return roles;
}

/**
 * Assign a role to a user
 * @param {Object} currentUser - The user performing the assignment
 * @param {string} userId - ID of the user to assign the role to
 * @param {string} roleId - ID of the role to assign
 */

export async function assignRole(currentUserPayload, userId, roleId) {
  // Fetch currentUser as a Sequelize instance
  const currentUser = await User.findByPk(currentUserPayload.id, {
    include: { model: Role, as: "roles" } // include roles
  });
  if (!currentUser) throw new Error("Current user not found");

  // Get highest hierarchy level of currentUser
  const currentHierarchy = currentUser.roles.length
    ? Math.max(...currentUser.roles.map(r => r.hierarchy_level))
    : 0;

  // Fetch target role
  const targetRole = await Role.findByPk(roleId);
  if (!targetRole) throw new Error("Role does not exist");

  if (currentHierarchy <= targetRole.hierarchy_level) {
    throw new Error("You cannot assign a role equal to or higher than your own");
  }

  // Fetch the target user
  const targetUser = await User.findByPk(userId);
  if (!targetUser) throw new Error("Target user not found");

  // Check if already assigned
  const existingAssignment = await UserRole.findOne({
    where: { user_uuid: userId, role_id: roleId }
  });
  if (existingAssignment) {
    return { message: "User already has this role" };
  }

  // Assign role
  const newAssignment = await UserRole.create({
    user_uuid: userId,
    role_id: roleId,
    assigned_by_uuid: currentUser.id,
    assigned_at: new Date()
  });

  return { message: "Role assigned successfully", assignment: newAssignment };
}

/**
 * Get all roles assigned to a user
 */
export async function getRolesForUser(userId) {
  const user = await User.findByPk(userId, {
    include: [
      {
        model: Role,
        as: "roles",
        through: { attributes: [] }, // don't include UserRole in the result
        attributes: ["id", "name", "description", "hierarchy_level"]
      }
    ]
  });

  if (!user) throw new Error("User not found");

  return user.roles;
}
