import apiError from "../utils/api-error.js";

function validate(dtoClass) {
  return async (req, _, next) => {
    const { error, value } = await dtoClass.schemaValidate(req.body);
    if (!error) {
      ((req.body = value), next());
    } else {
      const errorDetails = error.details.map((detail) => ({
        path: detail.path.join("."),
        message: detail.message,
      }));
      throw apiError.badRequest("DTO data validation failed", errorDetails);
    }
  };
}

export { validate };
