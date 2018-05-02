var express = require('express');
var fs = require('fs');
var router = express.Router();

var formidable = require('formidable');

var PythonShell = require('python-shell');

var options = {
  mode: 'text',
  pythonOptions: ['-u'],
  scriptPath: __dirname + '/../helper'
};
 
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload' , function(req, res, next){
	 var form = new formidable.IncomingForm();
	 form.multiples = true;
	 form.uploadDir = __dirname;
	 
	 form.parse(req, function(err, fields, files) {
	        if (err){
	        	console.log(err);
	        	next(err);
	        };
	        var targetPath = form.uploadDir+'/'+files.picture.name;
	        var fileName = files.picture.name;
	        fs.rename(files.picture.path, form.uploadDir+'/'+files.picture.name , function(callback){
	        	options.args = ['--input' , __dirname+'/'+fileName]
	        	PythonShell.run('omr'+fields['omr']+'.py', options, function (err, results) {
	        			if(err){
	        				console.log(err);
	        				res.status(500).json({err : "error"});
	        			} else{
	        				 res.header("Access-Control-Allow-Origin", "*");
	        				 res.header("Access-Control-Allow-Headers", "X-Requested-With");
	        				res.json({results : results});
	        			}
	        	        fs.unlink(form.uploadDir+'/'+files.picture.name, function (err) {
	        	        	if (err) throw err;
	        	        	});
	        		});
	        });
	 });
});

module.exports = router;