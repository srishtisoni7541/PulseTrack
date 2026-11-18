import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
      maxlength: 120,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
    },

    settings: {
      timezone: {
        type: String,
        default: "UTC",
      },

      browserActivityEnabled: {
        type: Boolean,
        default: true,
      },

      collectTabTitles: {
        type: Boolean,
        default: true,
      },

      retentionDays: {
        type: Number,
        default: 90,
        min: 1,
        max: 3650,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;
