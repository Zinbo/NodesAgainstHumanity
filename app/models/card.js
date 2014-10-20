// app/models/card.js
// grab the mongoose module
var mongoose = require('mongoose'), Schema = mongoose.Schema;

//Create the card and expansion schema, using a double-sided many to one mapping.
var cardSchema = Schema({
	description 	: String,
	isWhite			: Boolean,
	noOfResponses	: Number,
	expansion		: { type: Schema.Types.ObjectId, ref: 'Expansion' }
});

//Adding these to exports exposes them to other js files
module.exports = mongoose.model('Card', cardSchema);