const express = require('express');
const app = express();
const post = process.env.POST || 3000;

app.use(express.static('pub'));

app.get('/greeting', (req, res) => {
	console.log('get request path = /greeting');
	res.send('Hello Steve');
});

app.get('/ab?cd', (req, res) => {
	res.send('get query.');
});

app.post('/greeting', (req, res) => {
	console.log('post request path = /greeting');
res.send('Hello Again.');
});


app.listen(post, () => {
	console.log('Listening on port 3000');
});


app.route('/book').get((req, res)=>{
	res.send('Get a random book');
});