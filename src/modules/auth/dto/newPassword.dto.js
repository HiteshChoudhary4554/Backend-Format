import Joi from "joi";
import baseDto from "../../../common/dto/base.dto.js";

class newPasswordDto extends baseDto {
  static schema = Joi.object({
    resetToken: Joi.string().required(),
    newPassword: Joi.string().trim().min(6).max(8).required(),
  });
}

export { newPasswordDto };
