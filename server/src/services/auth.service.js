
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { env } from "../config/env.js";

const ACCESS_TOKEN_EXPIRY = "15m";

function createAccessToken(user) {
  return jwt.sign(
    {
      role: user.role,
    },
    
    "secret",
    {
      subject: user._id.toString(),
      expiresIn: "7d",
      algorithm: "HS256",
    }
  );
}

function createAuthError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

// Register a new user
export async function registerUser({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw createAuthError(
      "Unable to register with these details",
      409
    );
  }

  const passwordHash = await User.hashPassword(password);

  let user;

  try {
    user = await User.create({
      name,
      email: normalizedEmail,
      passwordHash,
      // Never accept role or isActive from public registration input.
    });
  } catch (error) {
    // Handles concurrent registration attempts for the same email.
    if (error?.code === 11000) {
      throw createAuthError(
        "Unable to register with these details",
        409
      );
    }

    throw error;
  }

  const accessToken = createAccessToken(user);

  return {
    user,
    accessToken,
  };
}

// Authenticate an existing user
export async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+passwordHash");

  // Use the same response for an unknown email and wrong password.
  if (!user || !user.isActive) {
    throw createAuthError("Invalid email or password", 401);
  }

  const passwordIsValid = await argon2.verify(
    user.passwordHash,
    password
  );

  if (!passwordIsValid) {
    throw createAuthError("Invalid email or password", 401);
  }

  const accessToken = createAccessToken(user);

  return {
    user,
    accessToken,
  };
}
