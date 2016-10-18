process.stdin.setEncoding('utf-8');
const fs = require('fs');

//Read todo from file and display them
let todos = getTodosFromFile();
displayTodos(todos);


process.stdin.on('data', (text)=>{
	let textAsArray = text.split(' ');
	let command = textAsArray[0];

	switch(command){
		case 'quit\n':
			// We're done, let's kill the process
			exit();
			break;
		case 'create': 
			// Get todo text and update todos.txt
			let todoText = textAsArray.slice(1).join(' ');
			fs.appendFileSync('todos.txt', '|' + todoText);
			let todos = getTodosFromFile();
			displayTodos(todos);
			break;
		case 'update':
			//get index and the text of the todo
			//control index is a number
			let indexUpdate = textAsArray[1];
			let newTodoText = textAsArray.slice(2).join(' ');
			if(typeof parseInt(indexUpdate) !== 'number'){
				console.log('You must enter the index of the todo you want to update.');
			}else{
				updateTodo(indexUpdate, newTodoText);
			}
			break;
		case 'delete':
			//get index, control it is a number
			let indexDelete = textAsArray[1];
			if(typeof parseInt(indexDelete) !== 'number'){
				console.log('You must enter the index of the todo you want to delete.');
			}else{
				deleteTodo(indexDelete);
			}
			break;
		default:
			//Any other command, print the instructions
			console.log('Unknown command.');
			displayInstructions();
			break;
	}
});

function exit(){
	console.log('Good Bye');
	process.exit();
}

function getTodosFromFile(){
	let todos = fs.readFileSync('todos.txt', {encoding: 'utf-8'});
	return todos.split('|');
}

function displayTodos(todosArray){
	console.log('\n\nHere are your todos: \n\n');
	for(let i = 0; i < todosArray.length; i++){
		console.log(i + ') ' + todosArray[i]);
	}
	console.log('\n');
	displayInstructions();
	console.log('\n');
}

function displayInstructions(){
	console.log('Type quit to exit. Type create <todo> to add a new todo.\n',
			'Type update <index> <todo> to update a todo.\n',
			'Type delete <index> to delete a todo.');
}

function updateTodo(index, todo){
	// Get todos in case it changed since we launched the program
	let todos = getTodosFromFile();
	//Update todo
	todos[index] = todo;
	let updatedTodos = todos.join('|');
	//Update the file
	fs.writeFileSync('todos.txt', updatedTodos);
	let newTodos = getTodosFromFile();
	console.log('\nTodo Updated! \n ');
	displayTodos(newTodos);
}

function deleteTodo(index){
	let todos = getTodosFromFile();
	todos.splice(index, 1);
	let updatedTodos = todos.join('|');
	fs.writeFileSync('todos.txt', updatedTodos);
	let newTodos = getTodosFromFile();
	displayTodos(newTodos);
}