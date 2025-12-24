import User from "../models/User/User.js";
import SaccoUser from "../models/Sacco/SaccoUser.js";
import { verifyToken } from "../utils/jwt.js";

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);

    const user = await User.findByPk(payload.sub);
    if (!user || user.status !== "active") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Fetch SACCO membership (if any)
    const saccoMembership = await SaccoUser.findOne({
      where: { user_id: user.id, status: "active" },
    });

    req.user = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: saccoMembership?.role || null,   // ✅ attach SACCO role
      sacco_id: saccoMembership?.sacco_id || null  // ✅ attach SACCO ID
    };

    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
}

export default authenticate;
