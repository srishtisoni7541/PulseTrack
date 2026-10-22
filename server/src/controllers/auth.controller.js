
import {
  registerUser,
  loginUser,
} from "../services/auth.service.js";

function formatUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export async function register(req, res, next) {
  try {
    const result = await registerUser(req.body);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user: formatUser(result.user),
        accessToken: result.accessToken,
        tokenType: "Bearer",
        expiresIn: 900,
      },
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const result = await loginUser(req.body);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: formatUser(result.user),
        accessToken: result.accessToken,
        tokenType: "Bearer",
        expiresIn: 900,
      },
    });
  } catch (error) {
    return next(error);
  }
}
