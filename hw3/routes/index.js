var express = require('express');
var router = express.Router();
var amqp = require('amqplib/callback_api');

/* GET home page. */
router.get('/', function (req, res) {
	console.log(req.body);
	res.render('index', {title: 'Express'});
});

router.post('/', function (req, res) {
	console.log(req.body);
	res.json({status: "OK"});
});

router.post('/listen', function (req, res) {
	let keys = req.body.keys;
	console.log(keys);
	amqp.connect('amqp://localhost', function (err, conn) {
		conn.createChannel(function (err, ch) {
			if (err) return res.json({status: "ERROR"});
			let ex = 'hw3';
			ch.assertExchange(ex, 'direct');
			ch.assertQueue('', {exclusive: true}, function (err, q) {
				if (err) return res.json({status: "ERROR"});
				keys.forEach((key) => ch.bindQueue(q.queue, ex, key));
				ch.consume(q.queue, function (msg) {
					console.log("sending:", msg.content.toString());
					res.json({msg: msg.content.toString()});
					conn.close();
				}, {noAck: false})
			});
		});
	});
});

router.post('/speak', function (req, res) {
	let {key, msg} = req.body;
	console.log(key, msg);
	amqp.connect('amqp://localhost', function (err, conn) {
		conn.createChannel(function (err, ch) {
			let ex = 'hw3';
			ch.assertExchange(ex, 'direct');
			ch.publish(ex, key, Buffer.from(msg));
			console.log("message sent:", msg);
			res.json({status: "OK"});
		});
		setTimeout(function(){
			conn.close();
		}, 500);
	});
});

module.exports = router;
