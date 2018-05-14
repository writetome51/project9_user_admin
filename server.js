const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const http = require('http');

let app = express();


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
	fs.readFile('./users.json', (err, data) => {
		if (err) {
			res.writeHead(404);
			res.end(JSON.stringify(err));
			return;
		}
		data = JSON.stringify(data.toString());
		data = JSON.parse(data);
		let dataType = typeof data;
		console.log(dataType);


		res.render('user-manager', {
			title: 'Users',
			users: JSON.parse(data)
		});
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




