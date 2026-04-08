import Joi from "joi";
import baseDto from "../../../common/dto/base.dto.js";

class registerDto extends baseDto {
  static schema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().trim().email().lowercase().required(),
    password: Joi.string().trim().min(6).max(8).required(),
  }); 
}

export { registerDto };
