
import mongoose from "mongoose";

const tabVisitSchema = new mongoose.Schema(
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

    // Browser session reference
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BrowserSession",
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

    // Unique visit and tab identifiers
    visitId: {
      type: String,
      required: true,
      trim: true,
    },

    tabSessionId: {
      type: String,
      required: true,
      trim: true,
    },

    // Website information
    domain: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    sanitizedTitle: {
      type: String,
      trim: true,
      maxlength: 300,
      default: null,
    },

    sanitizedPath: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },

    // Visit timing
    startedAt: {
      type: Date,
      required: true,
    },

    endedAt: {
      type: Date,
      default: null,
    },

    // Time spent in selected, focused tab
    activeDurationMs: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Time tab remained open in background
    backgroundOpenDurationMs: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Prevent duplicate visits from the same installation
tabVisitSchema.index(
  { installation: 1, visitId: 1 },
  { unique: true }
);

// Employee activity timeline
tabVisitSchema.index({
  organization: 1,
  employee: 1,
  startedAt: -1,
});

// Website-wise activity lookup
tabVisitSchema.index({
  organization: 1,
  domain: 1,
  startedAt: -1,
});

const TabVisit = mongoose.model("TabVisit", tabVisitSchema);

export default TabVisit;
