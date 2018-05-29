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
	getUsersAnd((users) => {
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
	getUsersAnd((users) => {
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
	getUsersAnd(getUserManipulator(req,res,'edit-user'));
});


app.get('/view/:firstName&:lastName&:email', (req, res) => {
	getUsersAnd(getUserManipulator(req, res, 'view-user'));
});


function handleEditOrView(editOrView){
	app.get(`/${editOrView}/:firstName&:lastName&:email`, (req, res) => {
		getUsersAnd(getUserManipulator(req, res, 'view-user'));
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
		getUsersAnd((users) => {
			users.insertOne(newUser, function (err, r) {
				assert.equal(null, err);
				assert.equal(1, r.insertedCount);
			});
		})
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


function getSortObject(header, sortOrder) {
	let sortObject = {};
	sortObject[header] = Number(sortOrder);
	return sortObject;
}
