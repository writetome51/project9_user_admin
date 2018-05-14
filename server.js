const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
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
	res.render('user-manager', {
		title: 'Users',
		users: data
	});
});


app.get('/users/:userName', (req, res) => {
	res.render('user-view', {userName: req.params.userName});
});


app.get('/form', (req, res) => {
	console.log(req.user);
	res.render('form', {user: req.user});
});

app.post('/create', (req, res) => {
	let user = {
		name: req.body.name,
		email: req.body.email
	};

	res.end(`Name: ${user.name}\nEmail: ${user.email}`)
});

app.listen(3000);

console.log('listening on port 3000');






function deleteUserFromFile(id){
	fs.readFile('./users.json', (err, data) => {
		if (err) {
			console.log('Could not read users file. Unexpected error.');
			return;
		}
		data = JSON.parse(data.toString());
		data.forEach((user, index)=>{
			if (user.id === id){
				data.splice(index, 1);
			}
		});
		data = JSON.stringify(data);
	});
}

