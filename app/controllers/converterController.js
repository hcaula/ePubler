module.exports = function(app) {
  app.get('/index', function(req, res){
    res.send("hello!");
  });
}
