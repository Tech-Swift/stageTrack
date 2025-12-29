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
 * Normalize incoming role value to canonical role name used in ROLE_ORDER
 */
function normalizeRoleName(role) {
  if (!role || typeof role !== "string") return null;
  const r = role.trim().toLowerCase();

  // explicit mappings / fallbacks for legacy or custom role names
  if (r === "sacco_admin" || r === "sacco-admin") return "admin";
  if (r === "admin") return "admin";
  if (r.includes("super")) return "super_admin";
  if (r.includes("stage_marshal")) return "stage_marshal";
  if (r.includes("vehicle_owner")) return "vehicle_owner";
  if (r.includes("driver")) return "driver";
  if (r.includes("conductor")) return "conductor";
  if (r.includes("manager")) return "manager";
  if (r.includes("director")) return "director";

  // unknown mapping -> return raw lowercase (will be filtered out later)
  return r;
}

/**
 * Returns the highest role from an array of role names
 */
function highestRole(roleNames = []) {
  const valid = roleNames
    .map(normalizeRoleName)
    .filter((r) => r && ROLE_ORDER.includes(r));

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
        console.log("requireRole: No user found on request");
        return res.status(401).json({ message: "Unauthenticated" });
      }

      // ✅ Super admin bypass
      if (req.user.system_roles?.includes("super_admin")) {
        console.log(`requireRole: Super admin bypass for user ${req.user.id}`);
        return next();
      }

      // Normalize roles from req.user.roles or req.user.role
     let roleNames = [];

      // ✅ PRIMARY SOURCE: system roles
      if (Array.isArray(req.user.system_roles) && req.user.system_roles.length > 0) {
        roleNames = req.user.system_roles;
      }
      // fallback (legacy / compatibility)
      else if (Array.isArray(req.user.roles) && req.user.roles.length > 0) {
        roleNames = req.user.roles.map((r) =>
          typeof r === "string" ? r : r?.name || ""
        );
      } else if (typeof req.user.role === "string" && req.user.role.trim()) {
        roleNames = [req.user.role];
      }

      console.log(`requireRole: user ${req.user.id} roles detected`, roleNames);

      const top = highestRole(roleNames);
      console.log(`requireRole: highest role determined for user ${req.user.id}:`, top);

      if (!top) {
        return res.status(403).json({
          message: "No roles assigned",
          rolesFound: roleNames,
          userId: req.user.id,
        });
      }

      if (!ROLE_ORDER.includes(minRole)) {
        return res
          .status(500)
          .json({ message: `Server misconfig: unknown minRole '${minRole}'` });
      }

      if (ROLE_ORDER.indexOf(top) < ROLE_ORDER.indexOf(minRole)) {
        return res.status(403).json({
          message: "Insufficient role privileges",
          userHighestRole: top,
          requiredRole: minRole,
        });
      }

      req.user.highestRole = top;
      console.log(`requireRole: user ${req.user.id} passed role check`);

      next();
    } catch (err) {
      console.error("requireRole error:", err);
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  };
}

