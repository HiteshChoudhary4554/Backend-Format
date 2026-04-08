import Joi from "joi";
import baseDto from "../../../common/dto/base.dto.js";

class loginDto extends baseDto {
  static schema = Joi.object({
    email: Joi.string().trim().email().lowercase().required(),
    password: Joi.string().trim().min(6).max(8).required(),
  });
}

export { loginDto };
