//joi is used for schema validation
//joi is a server side validation schema , its not a moongose schema
const Joi = require('joi');
const Review = require('./models/review');

const listingSchema = Joi.object({
    listings : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        image : Joi.object({
            url : Joi.string().required(),
            filename : Joi.string().required(),
        }),
        price : Joi.number().required().min(0),
        location : Joi.string().required(),
        country : Joi.string().required(),
    }).required()
});

const reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().min(1).max(5),
        comment : Joi.string().required()
    })
});

module.exports = {listingSchema , reviewSchema};