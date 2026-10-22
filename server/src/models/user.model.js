
import mongoose from "mongoose";
import argon2 from "argon2";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      maxlength: [254, "Email is too long"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },

    tokenVersion: {
      type: Number,
      default: 0,
      min: 0,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_doc, ret) {
        delete ret.passwordHash;
        delete ret.tokenVersion;
        return ret;
      },
    },
    toObject: {
      transform(_doc, ret) {
        delete ret.passwordHash;
        delete ret.tokenVersion;
        return ret;
      },
    },
  }
);

// Unique index: duplicate emails are prevented by MongoDB.
// Ensure indexes are created successfully during deployment.
userSchema.index({ email: 1 }, { unique: true });

// Centralized password hashing with Argon2id.
userSchema.statics.hashPassword = async function (password) {
  if (typeof password !== "string" || password.length === 0) {
    throw new Error("A valid password is required");
  }

  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
};

// Verify a plain password against its stored hash.
userSchema.methods.verifyPassword = async function (password) {
  if (typeof password !== "string" || !this.passwordHash) {
    return false;
  }

  try {
    return await argon2.verify(this.passwordHash, password);
  } catch {
    return false;
  }
};

const User = mongoose.model("User", userSchema);

export default User;
