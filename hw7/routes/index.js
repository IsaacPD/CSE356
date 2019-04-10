var express = require('express');
var mysql = require('mysql');
var Memcached = require('memcached');
var memcached = new Memcached('localhost:11211');
var router = express.Router();


var connection = mysql.createConnection({
  host: 'localhost',
  user: 'ubuntu',
  password: 'ubuntu',
  database: 'hw7',
  multipleStatements: true
});

connection.connect();

let query = "SELECT * FROM assists WHERE Club=? AND Pos=? AND A=(SELECT MAX(A) FROM assists WHERE Club=? AND Pos=?);";
query += "SELECT AVG(A) FROM (SELECT * FROM assists WHERE Club=? AND Pos=?) as T;";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hw7', function(req, res){
  let club = req.query.club;
  let pos = req.query.pos;
  let key = club + " " + pos;
  
  memcached.get(key, function(err, data){
  if (err){
  connection.query(query, [club, pos, club, pos, club, pos], function(err, result){
    if (err) return res.json({error:err.toString()});
    let row = result[0][0];
    let value = {club: club, pos: pos, max_assists: row.A, player: row.Player, avg_assists:result[1][0]["AVG(A)"]};
    res.json(value);
    memcached.set(key, value, function(err, data){});
  })
} else{
	return res.json(data);
}
}
});

module.exports = router;
