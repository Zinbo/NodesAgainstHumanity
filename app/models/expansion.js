// app/models/card.js
// grab the mongoose module
var mongoose = require('mongoose'), Schema = mongoose.Schema;

var expansionSchema = Schema({
	name : String,
	cards : [{ type: Schema.Types.ObjectId, ref: 'Card' }]
});

//Adding these to exports exposes them to other js files
module.exports = mongoose.model('Expansion', expansionSchema);