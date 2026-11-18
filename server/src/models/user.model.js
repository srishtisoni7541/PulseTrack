
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Company reference
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    // Basic user information
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    // Hashed password
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    // User roles
    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
      required: true,
    },

    // Employee information
    employeeCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
    },

    department: {
      type: String,
      trim: true,
      default: null,
    },

    jobTitle: {
      type: String,
      trim: true,
      default: null,
    },

    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },

    // JWT session invalidation
    tokenVersion: {
      type: Number,
      default: 0,
      select: false,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Globally unique email
userSchema.index(
  { email: 1 },
  { unique: true }
);

// Employee code unique within organization
userSchema.index(
  { organization: 1, employeeCode: 1 },
  {
    unique: true,
    partialFilterExpression: {
      employeeCode: { $type: "string" },
    },
  }
);

// Organization-wise user filtering
userSchema.index({
  organization: 1,
  role: 1,
  isActive: 1,
});

const User = mongoose.model("User", userSchema);

export default User;
