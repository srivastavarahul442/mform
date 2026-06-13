import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // Store a hash of the key, never the raw key
    keyHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // Store a short prefix so users can identify which key is which (e.g. "mfk_sk_XXXXXX...")
    keyPrefix: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastUsedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ApiKey || mongoose.model("ApiKey", apiKeySchema);
