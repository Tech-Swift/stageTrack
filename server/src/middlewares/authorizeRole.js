import UserRole from "../models/User/user_role.js"; // correct file name
import Role from "../models/User/Role.js";

const ROLE_ORDER = [
  "conductor",
  "driver",
  "vehicle_owner",
  "stage_marshal",
  "manager",
  "director",
  "admin",
  "super_admin"
];

function highestRole(roles) {
  return roles.sort(
    (a, b) => ROLE_ORDER.indexOf(b) - ROLE_ORDER.indexOf(a)
  )[0];
}

export function requireRole(minRole) {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      const assignments = await UserRole.findAll({
        where: { user_uuid: userId },
        include: [
          {
            model: Role,
            as: "role", // must match the alias in user_roles.js
            attributes: ["id", "name", "hierarchy_level"]
          }
        ]
      });

      if (!assignments.length) {
        return res.status(403).json({ message: "No roles assigned" });
      }

      const roleNames = assignments.map(r => r.role.name); // lowercase 'role'
      const userHighest = highestRole(roleNames);

      if (ROLE_ORDER.indexOf(userHighest) < ROLE_ORDER.indexOf(minRole)) {
        return res.status(403).json({ message: "Insufficient role privileges" });
      }

      req.user.highestRole = userHighest;
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
}
