const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
const dbName = 'user-admin';
const url = `mongodb://localhost:27017/${dbName}`;
const assert = require('assert');

let app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({
	extended: true
}));


app.get('/', (req, res) => {
	manipulateUsers((users) => {
		let result = users.find();
		result.toArray((err, docs) => {
			assert.equal(null, err);
			res.render('user-manager', {
				title: 'Users',
				users: docs,
				sortOrder: 1
			});
		});
	});
});


app.get('/sort/:header/:sortOrder', (req, res) => {
	let sortOrder = '1';
	let sortObject = getSortObject(req.params.header, req.params.sortOrder);
	manipulateUsers((users) => {
		let result = users.find({}).sort(sortObject);
		result.toArray((err, docs) => {
			assert.equal(null, err);
			if (req.params.sortOrder === '1') {
				sortOrder = '-1'
			}
			res.render('user-manager', {
				title: 'Users',
				users: docs,
				sortOrder: sortOrder
			});
		});
	});
});


app.get('/delete/:firstName&:lastName&:email', (req, res) => {
	manipulateUsers((users) => {
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


handleEditOrView('edit');
handleEditOrView('view');


app.get('/add-user', (req, res) => {
	res.render('add-user', {});
});


app.post('/change-user', (req, res) => {
	ifAllUserDataIsProvided_saveUser(req, (modifiedUser)=>{
		manipulateUsers((users) => {
			users.updateOne(
				{
					lastName: req.body.originalLastName,
					firstName: req.body.originalFirstName,
					email: req.body.originalEmail
				},
				{$set: modifiedUser}
			);
		});
	});
	res.redirect('/');
});


app.post('/create', (req, res) => {
	ifAllUserDataIsProvided_saveUser(req, (newUser) => {
		manipulateUsers((users) => {
			users.insertOne(newUser, function (err, r) {
				assert.equal(null, err);
				assert.equal(1, r.insertedCount);
			});
		});
	});
	res.redirect('/');
});


function ifAllUserDataIsProvided_saveUser(req, saveFunction) {
	if (req.body.firstName && req.body.lastName && req.body.password &&
		req.body.email && req.body.age) {
		let userObject = getUserObject(req);

		saveFunction(userObject);
	}
}


app.listen(3000);

console.log('listening on port 3000');


function handleEditOrView(editOrView) {
	app.get(`/${editOrView}/:firstName&:lastName&:email`, (req, res) => {
		manipulateUsers(getUserManipulator(req, res, `${editOrView}-user`));
	});
}


function getUserManipulator(req, res, viewName) {
	return function (users) {
		users.findOne(
			{firstName: req.params.firstName, lastName: req.params.lastName, email: req.params.email},
			function (err, doc) {
				assert.equal(null, err);
				res.render(viewName, {user: doc});
			}
		);
	};
}


function manipulateUsers(manipulator) {
	MongoClient.connect(
		url, {useNewUrlParser: true},

		function (err, client) { // client is instance of MongoClient
			assert.equal(null, err);
			console.log("Connected successfully to database.");

			const db = client.db();
			const users = db.collection('users');

			manipulator(users);

			client.close();
		}
	);
}


function getSortObject(header, sortOrder) {
	let sortObject = {};
	sortObject[header] = Number(sortOrder);
	return sortObject;
}


function getUserObject(req) {
	return {
		lastName: req.body.lastName,
		firstName: req.body.firstName,
		password: req.body.password,
		email: req.body.email,
		age: Number(req.body.age)
	};
}
