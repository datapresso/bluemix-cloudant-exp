
/* 
 * A Bluemix application using  Cloudant & Node Express 
 * Developed by: Tinniam V Ganesh
 * Date: 19 Aug 2014
 * File: index.js
 */
exports.index = function(req, res){
  res.render('index', { title: 'A Bluemix app with Node Express & Mongo' });
};

