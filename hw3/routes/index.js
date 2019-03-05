var express = require('express');
var router = express.Router();
var amqp = require('amqplib/callback_api');

/* GET home page. */
router.get('/', function (req, res, next) {
	console.log(req.body);
	res.render('index', {title: 'Express'});
});

router.post('/', function (req, res) {
	console.log(req.body);
	res.json({status:"OK"});
});

router.post('/listen', function (req, res) {
	let keys = req.body.keys;
	amqp.connect('amqp://localhost', function (err, conn) {
		conn.createChannel(function (err, ch) {
			if (err) return res.json({status:"ERROR"});
			let ex = 'hw3';
			ch.assertExchange(ex, 'direct', {durable:false});
			ch.assertQueue('excl', {exclusive: true}, function (err, q) {
				if (err) return res.json({status:"ERROR"});
				keys.forEach((key) => ch.bindQueue(q.queue, ex, key));
				ch.consume(q.queue, (msg) => res.json({msg:msg.content.toString()}), {noAck: true})
			});
		});
	});
});

router.post('/speak', function (req, res) {
	let {key, msg} = req.body;
	amqp.connect('amqp://localhost', function (err, conn) {
		conn.createChannel(function (err, ch) {
			let ex = 'hw3';
			ch.assertExchange(ex, 'direct', {durable:false});
			ch.publish(ex, key, Buffer.from(msg));
			res.json({status:"OK"});
		});
		setTimeout(function () {
			conn.close();
		}, 500);
	});
});

module.exports = router;
