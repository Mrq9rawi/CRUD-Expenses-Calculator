const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const expensesSchema = new Schema({
	ActionName: String,
	ActionLocation: String,
	ActionAmount: String,
	ActionDate: String,
	ActionType: String
},
	{
		timestamps: true
	});


module.exports = mongoose.model('expensesData', expensesSchema);
