const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
const dbName = 'user_admin';
const url = `mongodb://localhost:27017/${dbName}`;
const assert = require('assert');

/*********
 MongoClient.connect(
 url, {useNewUrlParser: true},

 function (err, client) { // client is instance of MongoClient
		assert.equal(null, err);
		console.log("Connected successfully to database.");

		const db = client.db();

		const users = db.collection('users');



		client.close();
	}
 );
 **********/


let app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({
	extended: true
}));


app.get('/', (req, res) => {
	getUsersAnd((users) => {
		let result = users.find();
		result.toArray((err, docs) => {
			assert.equal(null, err);
			res.render('user-manager', {
				title: 'Users',
				users: docs
			});
		});
	});
});


app.get('/delete/:firstName&:lastName&:email', (req, res) => {
	getUsersAnd((users) => {
		users.deleteOne(
			{firstName: req.params.firstName, lastName: req.params.lastName, email: req.params.email},
			function (err, r) {
				assert.equal(null, err);
				assert.equal(1, r.deletedCount);
			}
		);
	});
	res.redirect('/');
});


app.get('/edit/:firstName&:lastName&:email', (req, res) => {
	getUsersAnd((users) => {
		users.findOne(
			{firstName: req.params.firstName, lastName: req.params.lastName, email: req.params.email},
			function (err, doc) {
				assert.equal(null, err);
				res.render('edit-user', {user: doc});
			}
		);
	});
});


app.get('/user/:firstName&:lastName&:email', (req, res) => {
	getUsersAnd((users) => {
		users.findOne(
			{firstName: req.params.firstName, lastName: req.params.lastName, email: req.params.email},
			function (err, doc) {
				assert.equal(null, err);
				res.render('user-view', {user: doc});
			}
		);
	});
});


app.get('/add-user', (req, res) => {
	res.render('add-user', {});
});


app.post('/change-user', (req, res) => {
	if (req.body.firstName && req.body.lastName && req.body.password &&
		req.body.email && req.body.age) {
		let newVersion = {
			lastName: req.body.lastName,
			firstName: req.body.firstName,
			password: req.body.password,
			email: req.body.email,
			age: Number(req.body.age)
		};
		getUsersAnd((users) => {
			users.updateOne(
				{
					lastName: req.body.originalLastName,
					firstName: req.body.originalFirstName,
					email: req.body.originalEmail
				},
				{$set: newVersion}
			);
		});
	}
	res.redirect('/');
});


app.post('/create', (req, res) => {
	if (req.body.firstName && req.body.lastName && req.body.password &&
		req.body.email && req.body.age) {
		let newUser = {
			lastName: req.body.lastName,
			firstName: req.body.firstName,
			password: req.body.password,
			email: req.body.email,
			age: Number(req.body.age)
		};
		addUserToFile(newUser);
	}
	res.redirect('/');
});

app.listen(3000);

console.log('listening on port 3000');


function getUsersAnd(manipulateUsers) {
	MongoClient.connect(
		url, {useNewUrlParser: true},

		function (err, client) { // client is instance of MongoClient
			assert.equal(null, err);
			console.log("Connected successfully to database.");

			const db = client.db();
			const users = db.collection('users');

			manipulateUsers(users);

			client.close();
		}
	);
}


function addUserToFile(newUser) {
	let lastUser = data[data.length - 1];
	let highestID = lastUser.id;
	newUser['id'] = highestID + 1;
	data.push(newUser);
	return data;
}


function saveChangesToUser(id, newVersion) {
	for (let index in data) {
		if (data[index].id === Number(id)) {
			let changedUser = modifyObject(data[index], newVersion);
			data.splice(index, 1);
			data.splice(index, 0, changedUser);
			return data;
		}
	}
}


function modifyObject(obj, propertiesAndValuesToModify) {
	for (let prop in propertiesAndValuesToModify) {
		obj[prop] = propertiesAndValuesToModify[prop];
	}
	return obj;
}
