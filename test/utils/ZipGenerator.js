/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var fs = require('fs');
var archiver = require('archiver');

function ZipGenerator(){

}

ZipGenerator.prototype.generate = function (zipName) {

	var HTMLContent = "<!DOCTYPE html><html><header><title>This is title</title></header><body><h1>Hello world</h1></body></html>";

	return new Promise(function (resolve, reject) {

		var output = fs.createWriteStream(zipName);
		var archive = archiver('zip');
		archive.append(HTMLContent, { name:'index.html' });
		//archive.append(fs.createReadStream(folderPath + "/" + fileDummy), { name:'dummy.txt' });
		//archive.append(fs.createReadStream(folderPath + "/" + fileDummy), { name:'dummy2.txt' });
		//archive.append(fs.createReadStream(folderPath + "/" + fileDummy), { name:'dummy3.txt' });
		//archive.append(fs.createReadStream(folderPath + "/" + fileDummy), { name:'dummy4.txt' });

/*
		for(var i = 0; i< 700; i++){
			archive.append(fs.createReadStream("./docs/" + "/" + "logo3.png"), { name:'logo' + i + ".png" });
		}
		*/

		archive.pipe(output);
		archive.finalize();

		output.on('close', function() {
			console.log(zipName + " : " + archive.pointer() + ' total bytes');
			return resolve();
		});

	});

}

ZipGenerator.prototype.remove = function(zipName){

	return new Promise(function (resolve, reject) {
		fs.unlink(zipName, function (error) {
			if (error){
				return reject(error);
			}
			return resolve();
		});
	});
}



module.exports = ZipGenerator;