
import mongoose from "mongoose";

const websiteDailySummarySchema = new mongoose.Schema(
  {
    // Company reference
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
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

    // Date of activity (UTC day start)
    date: {
      type: Date,
      required: true,
    },

    // Website domain
    domain: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    // Total active browser time
    totalActiveMs: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Total background tab open time
    totalBackgroundOpenMs: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Total number of visits
    totalVisits: {
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

// One summary per employee, website and date
websiteDailySummarySchema.index(
  {
    organization: 1,
    employee: 1,
    date: 1,
    domain: 1,
  },
  {
    unique: true,
  }
);

// Organization-wise daily analytics
websiteDailySummarySchema.index({
  organization: 1,
  date: -1,
});

// Employee-wise daily reports
websiteDailySummarySchema.index({
  organization: 1,
  employee: 1,
  date: -1,
});

const WebsiteDailySummary = mongoose.model(
  "WebsiteDailySummary",
  websiteDailySummarySchema
);

export default WebsiteDailySummary;
