
import mongoose from "mongoose";

const browserSessionSchema = new mongoose.Schema(
  {
    // Organization reference
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    // Extension installation reference
    installation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BrowserInstallation",
      required: true,
      index: true,
    },

    // Employee reference
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Browser session start time
    startedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    // Browser session end time
    endedAt: {
      type: Date,
      default: null,
    },

    // Session status
    status: {
      type: String,
      enum: ["active", "ended", "interrupted"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Employee-wise session history
browserSessionSchema.index({
  organization: 1,
  employee: 1,
  startedAt: -1,
});

// Prevent multiple active sessions for one installation
browserSessionSchema.index(
  { installation: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: "active",
    },
  }
);

const BrowserSession = mongoose.model(
  "BrowserSession",
  browserSessionSchema
);

export default BrowserSession;
