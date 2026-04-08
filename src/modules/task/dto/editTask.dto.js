import Joi from "joi";
import baseDto from "../../../common/dto/base.dto.js";
import { category } from "../../../constant.js";
import { status } from "../../../constant.js";

class editTaskDto extends baseDto {
  static schema = Joi.object({
    title: Joi.string().min(10).max(100).trim().required(),
    slug: Joi.string().trim().required(),
    description: Joi.string().min(10).max(500),
    category: Joi.string()
      .valid(...category)
      .required(),
    status: Joi.string()
      .valid(...status)
      .required(),
    dueDate: Joi.date().required(),
  });
}

export { editTaskDto };
