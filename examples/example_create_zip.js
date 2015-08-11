/*jslint node: true*/
/*globals Promise:true*/
"use strict";

var fs = require('fs');
var archiver = require('archiver');


var baseDir = "./"
var folderName = "staticAppZip";
var folderPath = "./" + folderName;
var file1 = "index.html";
var fileDummy = "dummy.txt";
var HTMLContent = "<!DOCTYPE html><html><header><title>This is title</title></header><body><h1>Hello world</h1></body></html>";
var weight = 250;//MB

function createFolder(){

	return new Promise(function (resolve, reject) {
	
		//TODO: To deprecate in the future
		if(!fs.existsSync(folderPath)){
		    fs.mkdirSync(folderPath, "0766", function(error){
		    	if(error){ 
		        	return reject("ERROR! Can't make the directory! \n");
		       	}
		       	return resolve();
		    });   
		 }else{
		 	return resolve();
		 }
	});
}

function createAFile(path,file,content){

	return new Promise(function (resolve, reject) {

		fs.writeFile(path+"/"+file, content, function(error) {
		    if(error) {
		    	console.log(error);
		        return reject(error);
		    }
	    	return resolve("OK");
		});

	});
}

function generate1KFile(){

	console.log("Creating 1k file");

	var seed = "1234567890123456789\n";
	var content = "";
	var oneK = 50;
	var oneMB = 1024;
	var iterations = oneK*oneMB*weight;
	for(var i = 0; i< iterations; i++){
		content += seed;
	}

	return createAFile(folderPath,fileDummy,content);

}

function zipFolder(){

	return new Promise(function (resolve, reject) {

		var output = fs.createWriteStream(folderName +'.zip');
		var archive = archiver('zip');
		archive.append(fs.createReadStream(folderPath + "/" + file1), { name:'index.html' });
		//archive.append(fs.createReadStream(folderPath + "/" + fileDummy), { name:'dummy.txt' });
		//archive.append(fs.createReadStream(folderPath + "/" + fileDummy), { name:'dummy2.txt' });
		//archive.append(fs.createReadStream(folderPath + "/" + fileDummy), { name:'dummy3.txt' });
		//archive.append(fs.createReadStream(folderPath + "/" + fileDummy), { name:'dummy4.txt' });

		for(var i = 0; i< 700; i++){
			archive.append(fs.createReadStream("./docs/" + "/" + "logo3.png"), { name:'logo' + i + ".png" });
		}

		archive.pipe(output);
		archive.finalize();

		output.on('close', function() {
			console.log(archive.pointer() + ' total bytes');
			console.log('archiver has been finalized and the output file descriptor has closed.');
			return resolve("OK3");
		});

	});
};

console.log("# Create folder");
createFolder(folderPath).then(function (result) {
	return createAFile(folderPath,file1,HTMLContent);
}).then(function (result) {
	return generate1KFile();
}).then(function (result) {	
	return zipFolder();
}).then(function (result) {		
	return new Promise(function (resolve, reject) {
		return resolve("OK4");
	});
}).then(function (result) {	
    console.log(result);
}).catch(function (reason) { 
    console.error("Error: " + reason);
});
