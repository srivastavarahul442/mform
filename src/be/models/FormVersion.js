import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },

    label: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "text",
        "textarea",
        "number",
        "email",
        "phone",
        "date",
        "datetime",
        "radio",
        "checkbox",
        "select",
        "multiselect",
        "file",
        "rating",
        "signature",
      ],
    },

    placeholder: String,

    required: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
    },

    options: [
      {
        label: String,
        value: String,
      },
    ],

    validations: {
      minLength: Number,
      maxLength: Number,
      min: Number,
      max: Number,
      regex: String,
    },

    visibilityRules: [
      {
        fieldId: String,

        operator: {
          type: String,
          enum: [
            "equals",
            "not_equals",
            "contains",
            "greater_than",
            "less_than",
          ],
        },

        value: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  { _id: false },
);

const sectionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: String,

    order: {
      type: Number,
      default: 0,
    },

    fields: {
      type: [fieldSchema],
      default: [],
    },
  },
  { _id: false },
);

const formVersionSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },

    version: {
      type: Number,
      required: true,
    },

    sections: {
      type: [sectionSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

formVersionSchema.index(
  {
    formId: 1,
    version: 1,
  },
  {
    unique: true,
  },
);

formVersionSchema.index({
  companyId: 1,
});

export default mongoose.models.FormVersion ||
  mongoose.model("FormVersion", formVersionSchema);
