//joi is used for schema validation
//joi is a server side validation schema , its not a moongose schema
const Joi = require('joi');

const listingSchema = Joi.object({
    listings : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        image : Joi.string().required().allow("",null),
        price : Joi.number().required().min(0),
        location : Joi.string().required(),
        country : Joi.string().required(),
    }).required()
});

module.exports = {listingSchema};