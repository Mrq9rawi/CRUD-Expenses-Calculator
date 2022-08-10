const express = require('express');
const router = express.Router();
const Expenses = require('../models/expensesData');

// Getting all
router.get('/', async (req, res) => {
	try {
		const expense = await Expenses.find();
		res.json(expense);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Creating one
router.post('/', async (req, res) => {
	const expense = new Expenses({
		ActionName: req.body.name,
		ActionLocation: req.body.location,
		ActionAmount: req.body.amount,
		ActionDate: req.body.date,
		ActionType: req.body.type
	});

	try {
		const newExpenses = await expense.save();
		res.status(201).json(expense);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// Updating one
router.patch('/:id', getExpense, async (req, res) => {
	console.log(req.body);
	if (req.body.name != null) {
		res.expense.ActionName = req.body.name;
		res.expense.ActionLocation = req.body.location;
		res.expense.ActionAmount = req.body.amount;
		res.expense.ActionDate = req.body.date;
		res.expense.ActionType = req.body.type;
	}
	try {
		console.log(res.expense.ActionName);
		const updatedExpense = await res.expense.save();
		res.json(updatedExpense);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// Deleting One
router.delete('/:id', getExpense, async (req, res) => {
	try {
		await res.expense.remove();
		res.json({ message: 'Deleted Expense' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

async function getExpense(req, res, next) {
	try {
		expense = await Expenses.findById(req.params.id);
		if (expense == null) {
			return res.status(404).json({ message: "cannot find expense" });
		}
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
	res.expense = expense;
	next();
}

module.exports = router;