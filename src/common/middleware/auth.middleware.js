import { authenticate } from "../../modules/auth/auth.middleware.js";

// auth middleware is used in auth.routes.js and task.routes.js, so we can move it to common middleware to avoid circular dependency

export { authenticate };