import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    fieldId: {
      type: String,
      required: true,
    },

    value: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    _id: false,
  },
);

const submissionSchema = new mongoose.Schema(
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

    answers: {
      type: [answerSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["submitted"],
      default: "submitted",
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

submissionSchema.index({
  formId: 1,
  createdAt: -1,
});

export default mongoose.models.Submission ||
  mongoose.model("Submission", submissionSchema);
