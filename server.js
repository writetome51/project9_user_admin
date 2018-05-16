const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');

let app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.get('/', (req, res) => {
	fs.readFile('./users.json', (err, data) => {
		if (err) {
			res.writeHead(404);
			res.end(JSON.stringify(err));
			return;
		}
		data = JSON.parse(data.toString());

		res.render('user-manager', {
			title: 'Users',
			users: data
		});
	});
});


app.get('/delete/:id', (req, res) => {
	deleteUserFromFile(req.params.id);
	res.redirect('/');
});


app.get('/users/:id', (req, res) => {
	res.render('user-view', {userName: req.params.id});
});


app.get('/form', (req, res) => {
	res.render('form', {user: req.user});
});

app.post('/create', (req, res) => {
	let user = {
		name: req.body.name,
		email: req.body.email
	};

	res.end(`Name: ${user.name}\nEmail: ${user.email}`);
});

app.listen(3000);

console.log('listening on port 3000');


function deleteUserFromFile(id){
	readFile_changeData_writeDataToFile((data)=>{
		for (let index in data){
			if (data[index].id === Number(id)){
				data.splice(index, 1); // removes user.
			}
		}
		return data;
	});
}


function addUserToFile(newUser){
	readFile_changeData_writeDataToFile((data)=>{
		data.push(newUser);
		return data;
	});
}


function readFile_changeData_writeDataToFile(changeData){
	fs.readFile('./users.json', (err, data) => {
		if (err) {
			console.log('Could not read users file. Unexpected error.');
			return;
		}
		data = JSON.parse(data.toString());

		data = changeData(data);

		data = JSON.stringify(data);
		fs.writeFile('./users.json', data, (err)=>{
			if (!err){
				console.log('file was successfully rewritten.');
			}
		});
	});
}
