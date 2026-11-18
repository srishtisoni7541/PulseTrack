
import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    // Company reference
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    // Admin who performed the action
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Action performed
    action: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    // Type of resource affected
    targetType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    // ID of the affected resource
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    // Additional action details
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Request information
    ipAddress: {
      type: String,
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Organization-wise audit history
auditLogSchema.index({
  organization: 1,
  createdAt: -1,
});

// Admin-wise activity history
auditLogSchema.index({
  organization: 1,
  actor: 1,
  createdAt: -1,
});

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;
