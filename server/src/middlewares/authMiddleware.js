import User from "../models/User/User.js";
import { Role } from "../models/index.js";
import SaccoUser from "../models/Sacco/SaccoUser.js";
import { verifyToken } from "../utils/jwt.js";

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);

    // Fetch user from DB
    const user = await User.findByPk(payload.sub, {
      include: [
        { model: Role, as: 'roles', attributes: ['id', 'name', 'hierarchy_level'], through: { attributes: [] } }
      ]
    });

    if (!user || user.status !== "active") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Fetch SACCO membership (if any)
    const saccoMembership = await SaccoUser.findOne({
      where: { user_id: user.id, status: "active" },
    });

    // Attach all necessary info to req.user
    req.user = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      system_roles: user.roles?.map(r => r.name) || [],  // ✅ global system roles
      sacco_role: saccoMembership?.role || null,        // ✅ SACCO role
      sacco_id: saccoMembership?.sacco_id || null       // ✅ SACCO ID
    };

    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
}

export default authenticate;