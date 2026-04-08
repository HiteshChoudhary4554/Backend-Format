import Joi from "joi";

class baseDto {
  static schema = Joi.object({});

  static schemaValidate(data) {
    const { error, value } = this.schema.validate(data, {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove unknown properties
      errors: {
        wrap: {
          label: false, // Don't wrap error labels
        },
      },
    });

    return { error, value };
  }
}

export default baseDto;
