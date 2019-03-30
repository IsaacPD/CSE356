const express = require('express');
const cassandra = require('cassandra-driver');
const multer = require('multer');
const upload = multer();
const client = new cassandra.Client({localDataCenter: "datacenter1", contactPoints: ['127.0.0.1'], keyspace: 'hw5'});
const router = express.Router();

const add_img = 'INSERT INTO imgs (filename, contents) VALUES (?, ?)';
const get_img = 'SELECT contents FROM imgs WHERE filename = ?';

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', {title: 'Express'});
});

router.post('/deposit', upload.single('contents'), function (req, res) {
	console.log(req.body.filename);
	client.execute(add_img, [req.body.filename, req.file.buffer])
		.then((result) => res.json({status: "OK"}))
		.catch((err) => res.json({status: "error", error: err.toString()}));
});

router.get('/retrieve', function (req, res) {
	console.log(req.query.filename);
	client.execute(get_img, [req.query.filename])
		.then(function(result) {
			res.type(req.query.filename.split('.')[1]);
			res.send(result.rows[0].contents);
		})
		.catch((err) => res.json({status: "error", error: err.toString()}))
});

module.exports = router;
