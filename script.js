let runningTotal = 0;
let buffer = '0';
let previousOperator;
let calcs = [];
let calculated = false;
let opBlocked = false;
let maxVisibleInScreen = 13;

const buttons = document.querySelector('.calc-buttons');
const upperscreen = document.querySelector('.upperscreen');
const screen = document.querySelector('.screen');
const arrowButton = document.getElementById('arrow-button');
const operationButtons = document.getElementsByClassName('operator');

function buttonClick(value) {
	if (value === 'C') {
		reset();
		return;
	}
	if (isNaN(value)) {
		handleSymbol(value);
	}
	else {
		if (buffer.length > maxVisibleInScreen) {
			return;
		}
		restoreOperations()
		handleNumber(value);
	}
	
	let text = buffer.toString();
	if (text.length > maxVisibleInScreen +1) {
		text = text.substr(0, maxVisibleInScreen);
		text += 'E';
		blockOperations();
	}
	screen.innerText = text;
}

function handleSymbol(symbol) {
	printSymbolInUpperscreen(symbol);
	switch (symbol) {
		case '=':
		if (previousOperator === null) {
			return;
		}
		flushOperation(parseFloat(buffer));
		calculated = true;
		arrowButton.disabled = true;
		previousOperator = null;
		buffer = runningTotal;
		printNumberInUpperscreen(runningTotal.toString());
		runningTotal = 0;
		if (buffer.toString() === 'Infinity') {
			blockOperations();
		}
		break;
		case '←':
		if (buffer.length === 1) {
			buffer = '0';
		}
		else {
			buffer = buffer.substring(0, buffer.length -1);
		}
		break;
		case '+':
		case '−':
		case '×':
		case '÷':
		if (calculated === true) {
			calculated = false;
			arrowButton.disabled = false;
		}
		blockOperations();
		handleMath(symbol);
		break;
	}
}

function handleMath(symbol) {
	const intBuffer = parseFloat(buffer);
	
	if (runningTotal === 0) {
		runningTotal = intBuffer;
	}
	else {
		flushOperation(intBuffer);
	}
	previousOperator = symbol;
	buffer = '0';
}

function flushOperation(intBuffer) {
	if (previousOperator === '+') {
		runningTotal += intBuffer;
	}
	else if (previousOperator === '−') {
		runningTotal -= intBuffer;
	}
	else if (previousOperator === '×') {
		runningTotal *= intBuffer;
	}
	else if (previousOperator === '÷') {
		runningTotal /= intBuffer;
	}
}

function handleNumber(numberString) {
	if (calculated == true) {
		reset();
	}
	printNumberInUpperscreen(numberString);
	if (buffer === '0') {
		buffer = numberString;
	}
	else {
		buffer += numberString;
	}
}

function printSymbolInUpperscreen(symbol) {
	if (isNaN(calcs[calcs.length -1])) {
		return;
	}
	if (symbol === '=' && previousOperator === null) {
		return;
	}
	if (symbol === '←') {
		calcs.splice(calcs.length -1, 1);
	}
	if (previousOperator != null && symbol != '=') {
		symbol = ' ' + symbol;
	}
	if (symbol === '=') {
		symbol = '= ';
	}
	if (symbol != '←') calcs.push(symbol);
	printCalcs();
}


function printNumberInUpperscreen(number) {
	if (isNaN(parseFloat(number)) && number.toString() != "Infinity") {
		calcs.push("errore");
		blockOperations();
		upperscreen.innerText = calcs.toString().replaceAll(',', '');
		return;
	}
	calcs.push(number);
	printCalcs();
}

function printCalcs() {
	let text = calcs.toString().replaceAll(',', '');
	if (text === '') {
		text = '-';
	}
	if (text.length > 34) {
		text = text.substr(text.length -34);
	}
	
	upperscreen.innerText = text;
}

function reset() {
	if (opBlocked = true) {
		restoreOperations(); 
	}
	calcs = [];
	runningTotal = 0;
	buffer = '0';
	previousOperator = null;
	screen.innerText = buffer;
	upperscreen.innerText = '-';
	calculated = false;
	arrowButton.disabled = false;
}

function blockOperations() {
	opBlocked = true;
	for (var i = 0; i < operationButtons.length; i++) {
		operationButtons[i].disabled = true;
	}
	arrowButton.disabled = true;
}

function restoreOperations() {
	opBlocked = false;
	for (var i = 0; i < operationButtons.length; i++) {
		operationButtons[i].disabled = false;
	}
	arrowButton.disabled = false;
}

function init(){
	buttons.addEventListener('click', function(event){
		buttonClick(event.target.innerText);
	})
}

init();