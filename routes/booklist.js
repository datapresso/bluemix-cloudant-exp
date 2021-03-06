/* 
 * A Bluemix application using  Cloudant & Node Express 
 * Developed by: Tinniam V Ganesh
 * Date: 19 Aug 2014
 * File: booklist.js
 */
var pouchdb = require('pouchdb');

/* GET Booklist. */
exports.list =  function(req, res) {
	
	//Parse the process.env for the port and host that we've been assigned
	if (process.env.VCAP_SERVICES) {
		  // Running on Bluemix. Parse the port and host that we've been assigned.
		  var env = JSON.parse(process.env.VCAP_SERVICES);
		  var host = process.env.VCAP_APP_HOST; 
		  var port = process.env.VCAP_APP_PORT;

		  console.log('VCAP_SERVICES: %s', process.env.VCAP_SERVICES);    
		  // Also parse Cloudant settings.
		  var cloudant = env['cloudantNoSQLDB'][0]['credentials'];
	}
	
	var db = new pouchdb('books'),
	 remote =cloudant.url + '/books';
	opts = {
	  continuous: true
	  };
     // Replicate the DB to remote
	console.log(remote);
	db.replicate.to(remote, opts);
	db.replicate.from(remote, opts);
	  
	var docs = db.allDocs(function(err, response) { 
		val = response.total_rows;		
		var details = "";
		j=0;
		var booklist = new Array(val);
		for(i=0; i < val; i++) {
			db.get(response.rows[i].id, function (err,doc){
				 j++;	
				booklist[j] = new Array(3);
				booklist[j][0] = doc._id;
				booklist[j][1] = doc.Title;
				booklist[j][2] = doc.author; 							
			    details= details + JSON.stringify(doc.Title) + "  " +  JSON.stringify(doc.author) + "\n";
			    // Kludge because of Node.js asynchronous handling. To be fixed - T V Ganesh
			    if(j == val) {			    	
			    	res.render('booklist', {
			            "booklist" : booklist
			        });
			    }		    			   
		   }); // End db.get			
		} //End for		
      }); // End db.allDocs
	  
  
};

