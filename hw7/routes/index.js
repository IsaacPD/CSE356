var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'ubuntu',
  password: 'ubuntu',
  database: 'hw7'
});

connection.connect();

let query = "SELECT * FROM assists WHERE Club=? AND Pos=? AND A=(SELECT MAX(A) FROM assists WHERE Club=? AND Pos=?)";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hw7', function(req, res){
  let club = req.query.club;
  let pos = req.query.pos;

  connection.query(query, [club, pos], function(err, result){
    res.json({result: result});
    //res.json({club: club, pos: pos, max_assists:, player;, avg_assists:});
  })

});

module.exports = router;
