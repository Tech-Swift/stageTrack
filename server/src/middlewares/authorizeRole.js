const ROLE_ORDER = [
  "conductor",
  "driver",
  "vehicle_owner",
  "stage_marshal",
  "manager",
  "director",
  "admin",
  "super_admin",
];

/**
 * Returns the highest role from an array of roles
 */
function highestRole(roles = []) {
  const valid = roles.filter((r) => ROLE_ORDER.includes(r));
  if (valid.length === 0) return null;

  return valid.reduce((best, curr) =>
    ROLE_ORDER.indexOf(curr) > ROLE_ORDER.indexOf(best) ? curr : best
  );
}

/**
 * Middleware: requireRole
 * @param {string} minRole - minimum role required (e.g., "admin")
 */
export function requireRole(minRole) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthenticated" });
      }

      // Use roles array from authenticate middleware
      const roles = Array.isArray(req.user.roles) ? req.user.roles : [];

      // Compute highest role
      const top = highestRole(roles);

      if (!top) {
        return res.status(403).json({ message: "No roles assigned" });
      }

      // Validate minRole exists
      if (!ROLE_ORDER.includes(minRole)) {
        return res.status(500).json({ message: `Server misconfig: unknown minRole '${minRole}'` });
      }

      // Hierarchy check: deny if user's highest role < minRole
      if (ROLE_ORDER.indexOf(top) < ROLE_ORDER.indexOf(minRole)) {
        return res.status(403).json({ message: "Insufficient role privileges" });
      }

      // Expose for downstream use
      req.user.highestRole = top;

      next();
    } catch (err) {
      console.error("requireRole error:", err);
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  };
}
