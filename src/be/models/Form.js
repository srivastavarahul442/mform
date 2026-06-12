import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
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

    title: {
      type: String,
      required: true,
      trim: true,
    },
    allowMultipleSubmissions: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      default: "",
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    activeVersion: {
      type: Number,
      default: 1,
    },
    latestVersion: {
      type: Number,
      default: 1,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Form || mongoose.model("Form", formSchema);
