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
		console.log(eArray);
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

eIn.addEventListener("click", () => {
	let actionType = "in";
	// validate data
	if (eName.value.trim() !== "" && eLocation.value.trim() !== "" && eAmount.value.trim() !== "" && eDate.value.trim() !== "" && !isNaN(eAmount.value)) {
		// add data to an array
		addEToDb(eName.value, eLocation.value, eAmount.value, eDate.value, actionType);
		// clear inputs
		clearInputs();
		// focus on Expense Name
		eName.focus();
	}
});

eOut.addEventListener("click", () => {
	let actionType = "out";
	// validate data
	if (eName.value.trim() !== "" && eLocation.value.trim() !== "" && eAmount.value.trim() !== "" && eDate.value.trim() !== "" && !isNaN(eAmount.value)) {
		// add data to an array
		addEToDb(eName.value, eLocation.value, eAmount.value, eDate.value, actionType);
		// clear inputs
		clearInputs();
		// focus on Expense Name
		eName.focus();
	}
});

function clearInputs() {
	eName.value = "";
	eLocation.value = "";
	eAmount.value = "";
	eDate.value = "";
}

function addEToDb(eN, eL, eA, eD, eT) {
	// create expense object
	const expense = {
		name: eN,
		location: eL,
		amount: +eA,
		date: eD,
		type: eT
	};
	// add expense to the db
	fetch('/expenses', {
		method: 'post',
		body: JSON.stringify(expense),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	getData();
}

function eDocumentWriteIn(eArray) {
	// clear table body
	actionsTableBody.innerHTML = "";
	// clear total
	totalAmount.textContent = "0";
	eArray.forEach((e) => {
		// create table data
		let eTr = document.createElement("tr");
		let eNTd = document.createElement("td");
		let eLTd = document.createElement("td");
		let eATd = document.createElement("td");
		let eDTd = document.createElement("td");
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
		totalAmount.textContent = +totalAmount.textContent + +eAmount;
		// calculate total
		eTr.append(eDTd);
		eDTd.textContent = e.ActionDate;
	});
	// add $ to total
	totalAmount.textContent += "$";

}
