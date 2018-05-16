const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const bodyParser = require("body-parser");

let app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({
	extended: true
}));


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


app.get('/edit/:id', (req, res) => {
	fs.readFile('./users.json', (err, data) => {
		if (err) {
			console.log('Could not read users file. Unexpected error.');
			return;
		}
		data = JSON.parse(data.toString());

		for (let index in data) {
			if (data[index].id === Number(req.params.id)) {
				res.render('edit-user', {user: data[index]});
			}
		}
	});
});


app.get('/user/:id', (req, res) => {
	fs.readFile('./users.json', (err, data) => {
		if (err) {
			console.log('Could not read users file. Unexpected error.');
			return;
		}
		data = JSON.parse(data.toString());

		for (let index in data) {
			if (data[index].id === Number(req.params.id)) {
				res.render('user-view', {user: data[index]});
			}
		}
	});
});


app.get('/add-user', (req, res) => {
	res.render('add-user', {});
});


app.post('/change-user', (req, res)=>{
	if (req.body.username && req.body.password &&
		req.body.email && req.body.age && req.body.id) {
		let newVersion = {
			id: Number(req.body.id),
			username: req.body.username,
			password: req.body.password,
			email: req.body.email,
			age: Number(req.body.age)
		};
		saveChangesToUser(req.body.id, newVersion);
	}
	res.redirect('/');
});


app.post('/create', (req, res) => {
	if (req.body.username && req.body.password && req.body.email && req.body.age) {
		let newUser = {
			username: req.body.username,
			password: req.body.password,
			email: req.body.email,
			age: req.body.age
		};
		addUserToFile(newUser);
	}
	res.redirect('/');
});

app.listen(3000);

console.log('listening on port 3000');


function deleteUserFromFile(id) {
	readFile_changeData_writeDataToFile((data) => {
		for (let index in data) {
			if (data[index].id === Number(id)) {
				data.splice(index, 1); // removes user.
			}
		}
		return data;
	});
}


function addUserToFile(newUser) {
	readFile_changeData_writeDataToFile((data) => {
		let lastUser = data[data.length - 1];
		let highestID = lastUser.id;
		newUser['id'] = highestID + 1;
		data.push(newUser);
		return data;
	});
}


function saveChangesToUser(id, newVersion){
	readFile_changeData_writeDataToFile((data)=>{
		for (let index in data) {
			if (data[index].id === Number(id)) {
				let changedUser = modifyObject(data[index], newVersion);
				data.splice(index, 1);
				data.splice(index, 0, changedUser);
				return data;
			}
		}
	});
}


function readFile_changeData_writeDataToFile(changeData) {
	fs.readFile('./users.json', (err, data) => {
		if (err) {
			console.log('Could not read users file. Unexpected error.');
			return;
		}
		data = JSON.parse(data.toString());

		data = changeData(data);

		data = JSON.stringify(data);
		fs.writeFile('./users.json', data, (err) => {
			if (!err) {
				console.log('file was successfully rewritten.');
			}
		});
	});
}


function modifyObject(obj, propertiesAndValuesToModify) {
	for (let prop in propertiesAndValuesToModify) {
		obj[prop] = propertiesAndValuesToModify[prop];
	}
	return obj;
}
