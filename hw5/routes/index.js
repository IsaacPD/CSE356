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
	client.execute(add_img, [req.body.filename, req.file])
		.then((result) => res.json({status: "OK"}, console.log(result)))
		.catch((err) => res.json({status: "error", error: err.toString()}));
});

router.get('/retrieve', function (req, res) {
	client.execute(get_img, [req.query.filename])
		.then((result) => res.send(result), console.log(result))
		.catch((err) => res.json({status: "error", error: err.toString()}))
});

module.exports = router;
