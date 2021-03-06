var database = require('../util/databaseHelper.js');
var response = require('../util/responseHelper.js');
var base64 = require('file-base64');
require('../util/stringExtension.js');

var MovieCtrl = {};
module.exports = MovieCtrl;


//GET /movies - lista todos os filmes
MovieCtrl.readAll = function(callback){

  var sql = 'SELECT id, title, photo_url, lenght, released_date FROM Movie';
  var params = null;

  database.query(sql, params, 'release', function(err, rows) {
    if (!rows || rows.length == 0){
      callback(response.result(400));
      return;
    }

    return callback(response.result(200, rows));
  });
};

//GET /movie/:id - lista filme por ID
MovieCtrl.readBySlug = function(id, callback){
  var sql = 'SELECT id, title, photo_url, lenght, released_date FROM Movie WHERE id = ? ';
  var params = [id];

  database.query(sql, params, 'release', function(err, rows) {
    if (!rows || rows.length == 0){
      callback(response.result(400));
      return;
    }
    return callback(response.result(200, rows[0]));
  });
};


//POST /movie - insere filme
MovieCtrl.insert = function(params, callback){
  var imageName = params.title.fileNameClean('.jpg');
  base64.decode(params.photo_url, './public/images/' + imageName, function(err, output) {
    console.log("success insert photo movie");
  });
  
  var sql = 'INSERT INTO Movie(title, photo_url, lenght, released_date) VALUES(?,?,?,?)';
  var params = [params.title, imageName, params.lenght ,params.released_date];

  database.query(sql, params, 'release', function(err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    }
    
    var id = rows.insertId;
    MovieCtrl.readBySlug(id, callback);
  });
};

//PUT /movie - altera um filme
MovieCtrl.update = function(id, params, callback){
  var imageName = params.title.fileNameClean('.jpg');
  base64.decode(params.photo_url, './public/images/' + imageName, function(err, output) {
    console.log("success update photo movie");
  });
  
  var sql = 'UPDATE Movie SET title = ?, photo_url = ?, released_date = ? WHERE id = ? ';
  var params = [params.title, imageName, params.released_date, id];

  database.query(sql, params, 'release', function(err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    }
    
    MovieCtrl.readBySlug(id, callback);
  });
};

//DELETE /movie - remove um filme
MovieCtrl.delete = function(id, callback){
  var sql = 'DELETE FROM Movie WHERE id = ? ';
  var params = [id];

  database.query(sql, params, 'release', function(err, rows) {
    if (err) {
      callback(response.error(400, err));
      return;
    }

    callback(response.result(204));
  });
};
