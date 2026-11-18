
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      organizationId: user.organization.toString(),
      role: user.role,
      tokenVersion: user.tokenVersion,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
      algorithm: "HS256",
    }
  );
};

export default generateToken;
