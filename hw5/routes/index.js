const express = require('express');
const cassandra = require('cassandra-driver');
const multer = require('multer');
const upload = multer();
const client = new cassandra.Client({localDataCenter: "datacenter1", contactPoints:['127.0.0.1'], keyspace: 'hw5'});
const router = express.Router();

const add_img = 'INSERT INTO imgs (filename, contents) VALUES (?, ?)';
const get_img = 'SELECT contents FROM imgs WHERE filename = ?';

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', {title: 'Express'});
});

router.post('/deposit', upload.single('contents'), function (req, res) {
	let filename = req.body.filename;
	let contents = req.body.contents;
	console.log(filename, req.file);
	//ient.execute(add_img, [filename, contents])
	//then((result)=>console.log(result))
	//catch((err) => console.log(err));
	res.json({status: "OK"});
});

router.post('/retrieve', function(req, res){
	let filename = req.body.filename;
	client.execute(get_img, [filename]).then(function(result){
		if (result)
			res.json(result);
		else
			res.json({status:"OK"});
	})
});

module.exports = router;
