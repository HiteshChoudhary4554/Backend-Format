import Joi from "joi";
import baseDto from "../../../common/dto/base.dto.js";

class forgotPasswordDto extends baseDto {
  static schema = Joi.object({
    email: Joi.string().trim().email().lowercase().required(),
  });
}

export { forgotPasswordDto };
