export function validateSubmission(sections, answers) {
  const errors = [];

  const answerMap = {};

  answers.forEach((answer) => {
    answerMap[answer.fieldId] = answer.value;
  });

  for (const section of sections) {
    for (const field of section.fields) {
      const value = answerMap[field.id];

      // Required

      if (
        field.required &&
        (value === undefined || value === null || value === "")
      ) {
        errors.push(`${field.label} is required`);

        continue;
      }

      // Skip if empty

      if (value === undefined || value === null || value === "") {
        continue;
      }

      // Email

      if (field.type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) {
          errors.push(`${field.label} must be a valid email`);
        }
      }

      // Number

      if (field.type === "number") {
        if (isNaN(Number(value))) {
          errors.push(`${field.label} must be a number`);
        }
      }

      // Select

      if (["select", "radio"].includes(field.type)) {
        const options = field.options.map((o) => o.value);

        if (!options.includes(value)) {
          errors.push(`${field.label} has invalid value`);
        }
      }

      // Min Length

      if (
        field.validations?.minLength &&
        value.length < field.validations.minLength
      ) {
        errors.push(
          `${field.label} minimum length is ${field.validations.minLength}`,
        );
      }

      // Max Length

      if (
        field.validations?.maxLength &&
        value.length > field.validations.maxLength
      ) {
        errors.push(
          `${field.label} maximum length is ${field.validations.maxLength}`,
        );
      }
    }
  }

  return errors;
}
