import mongoose from "mongoose";

const formInviteSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
      index: true,
    },
    versionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FormVersion",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetUser: {
      name: { type: String, default: null },
      phone: { type: String, required: true, trim: true },
      email: { type: String, default: null, lowercase: true, trim: true },
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.FormInvite || mongoose.model("FormInvite", formInviteSchema);
