// user input
const eName = document.querySelector("input[name='expense-name']");
const eLocation = document.querySelector("input[name='expense-location']");
const eAmount = document.querySelector("input[name='expense-amount']");
const eDate = document.querySelector("input[name='expense-date']");
const eOut = document.querySelector("input[name='expense-out']");
const eIn = document.querySelector("input[name='expense-in']");
const actionsTableBody = document.querySelector(".actions tbody");
const totalAmount = document.querySelector(".total-amount");


// create expenses array
let eArray = [];

function getData() {
	fetch('/expenses', {
		method: 'get'
	}).then((res) => {
		return res.json();
	}).then((json) => {
		eArray = json;
		eDocumentWriteIn(eArray);
	});
}

getData();

// put total to 0
totalAmount.textContent = "0$";

// focus on Expense Name
window.onload = () => {
	eName.focus();
};

eIn.addEventListener("click", createNewExpense);
eOut.addEventListener("click", createNewExpense);

function createNewExpense() {
	let actionType = this.getAttribute('data-type');
	// validate data
	if (eName.value.trim() !== "" && eLocation.value.trim() !== "" && eAmount.value.trim() !== "" && eDate.value.trim() !== "" && !isNaN(eAmount.value)) {
		// add data to an array
		addEToDb(eName.value, eLocation.value, eAmount.value, eDate.value, actionType);
		// clear inputs
		clearInputs();
		// focus on Expense Name
		eName.focus();
	}
}


function clearInputs() {
	eName.value = "";
	eLocation.value = "";
	eAmount.value = "";
	eDate.value = "";
}

function addEToDb(eN, eL, eA, eD, eT) {
	// add expense to the db
	fetch('/expenses', {
		method: 'post',
		body: JSON.stringify(createExpenseObject(eN, eL, eA, eD, eT)),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	getData();
}

function createExpenseObject(eN, eL, eA, eD, eT) {
	const expense = {
		name: eN,
		location: eL,
		amount: +eA,
		date: eD,
		type: eT
	};
	return expense;
}

function eDocumentWriteIn(eArray) {
	// clear table body
	actionsTableBody.innerHTML = "";
	// clear total
	totalAmount.textContent = "0";
	eArray.forEach((e) => {
		// create table data
		let eTr = document.createElement("tr");
		eTr.setAttribute("id", e._id);
		let eNTd = document.createElement("td");
		let eLTd = document.createElement("td");
		let eATd = document.createElement("td");
		let eDTd = document.createElement("td");
		let eActionsTd = document.createElement("td");
		eActionsTd.classList.add("actions");
		let updateButton = document.createElement('button');
		updateButton.classList.add("update");
		updateButton.textContent = "Update";
		updateButton.addEventListener("click", initUpdate);
		let deleteButton = document.createElement('button');
		deleteButton.classList.add("delete");
		deleteButton.textContent = "Delete";
		deleteButton.addEventListener("click", deleteExpense);
		// get eTotal
		actionsTableBody.prepend(eTr);
		eTr.append(eNTd);
		eNTd.textContent = e.ActionName;
		eTr.append(eLTd);
		eLTd.textContent = e.ActionLocation;
		eTr.append(eATd);
		if (e.ActionType == "out") {
			var eAmount = -e.ActionAmount;
		} else {
			var eAmount = e.ActionAmount;
		}
		eATd.textContent = `${eAmount}$`;
		// check in or out
		if (e.ActionType == "out") {
			eATd.className = "out";
		} else {
			eATd.className = "in";
		}
		eTr.append(eDTd);
		eDTd.textContent = e.ActionDate;
		eTr.append(eActionsTd);
		eActionsTd.append(updateButton);
		eActionsTd.append(deleteButton);
		// calculate total
		totalAmount.textContent = +totalAmount.textContent + +eAmount;
	});
	// add $ to total
	totalAmount.textContent += "$";
}

function initUpdate() {
	eName.value = this.parentElement.parentElement.children[0].textContent;
	eLocation.value = this.parentElement.parentElement.children[1].textContent;
	eAmount.value = Math.abs(parseInt(this.parentElement.parentElement.children[2].textContent));
	eDate.value = this.parentElement.parentElement.children[3].textContent;

	eOut.removeEventListener("click", createNewExpense);
	eIn.removeEventListener("click", createNewExpense);

	eOut.addEventListener("click", updateExpense);
	eOut.setAttribute("data-id", this.parentElement.parentElement.id);
	eIn.addEventListener("click", updateExpense);
	eIn.setAttribute("data-id", this.parentElement.parentElement.id);
}

function updateExpense(evt) {
	let actionType = evt.currentTarget.getAttribute('data-type');
	let expenseId = evt.currentTarget.getAttribute('data-id');
	eIn.setAttribute("data-id", "");
	eOut.setAttribute("data-id", "");

	// validate data
	if (eName.value.trim() !== "" && eLocation.value.trim() !== "" && eAmount.value.trim() !== "" && eDate.value.trim() !== "" && !isNaN(eAmount.value)) {
		// add data to an array
		updateEFromDb(eName.value, eLocation.value, eAmount.value, eDate.value, actionType, expenseId);
		// clear inputs
		clearInputs();
		// focus on Expense Name
		eName.focus();
	}
}

function updateEFromDb(eN, eL, eA, eD, eT, eId) {
	fetch(`/expenses/${eId}`, {
		method: 'PATCH',
		body: JSON.stringify(createExpenseObject(eN, eL, eA, eD, eT)),
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(() => {
		eOut.addEventListener("click", createNewExpense);
		eIn.addEventListener("click", createNewExpense);

		eOut.removeEventListener("click", updateExpense);
		eIn.removeEventListener("click", updateExpense);
		getData();
	});
}

function deleteExpense() {
	fetch(`/expenses/${this.parentElement.parentElement.id}`, {
		method: "delete"
	}).then(() => {
		getData();
	});
}
