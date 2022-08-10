require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;

db.on('error', (error) => console.error(error));
db.once('open', () => console.log("connected to db"));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use(express.json());

const expensesRouter = require('./routes/expenses');

app.get('/', (req, res) => {
	res.render('index');
});

app.use('/expenses', expensesRouter);

app.listen(3000, () => {
	console.log("3000");
});