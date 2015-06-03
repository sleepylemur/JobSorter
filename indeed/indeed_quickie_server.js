var express=require('express');
var app=express();
app.use(express.static(__dirname+'/public'));
var secrets = require('./secrets.json');
var ejs = require('ejs');
app.set('view engine', 'ejs');
var request = require('request');
var cheerio = require('cheerio');



var url = "http://api.indeed.com/ads/apisearch";
var publisher = "?publisher=" + secrets['indeed_api_key'];
var format = "&format=" + "json";
var query = "&q=" + "junior+web+developer";
var loc = "&l=" + "New+York%2C+NY";
var sort = "&sort=" + "";
var radius = "&radius=" + "10";
var site_type = "&st=" + "";
var job_type = "&jt=" + "fulltime";
var start = "&start=" + "";
var limit = "&limit=" + "";
var fromage = "&fromage=" + "last";
var filter = "&filter=" + "";
var latlong = "&latlong=" + "1";
var country = "&co=" + "us";
var channel = "&chnl=" + "";
var userip = "&userip=" + "1.2.3.4";
var useragent = "&useragent=" + "Mozilla/%2F4.0%28Firefox%29";
var ver = "&v=" + "2";

var search_url = url + publisher + format + query + loc + sort + radius + site_type + job_type + start + limit + fromage + filter + latlong + country + channel + userip + useragent + ver;

//console.log (search_url);

var results = {};

request(search_url, function (error, response, body) {
	if(!error && response.statusCode===200) {
		data=JSON.parse(body);
		var joblist = data.results;
		joblist.forEach(function(job) {
			results['jobid'] = job.jobkey;
			results['title'] = job.jobtitle;
			results['company'] = job.company;
			results['location'] = job.formattedLocation;
			results['snippet'] = job.snippet;
			results['url'] = job.url;

			request (job.url, function (jerror, jresponse, jbody) {
				if(!jerror && jresponse.statusCode===200) {
					$ = cheerio.load(jbody);
					results['job_detail'] = $('#job_summary').text();
				} else {
					console.log("Something went wrong:\nurl:"+job.url+"\nresponse code:\n"+jresponse.statusCode);
				}
				console.log("Results?");
				console.dir(results);
			});
		});
	} else {
		console.log("Something went wrong:\nsearch:"+search_url+"\nresponse code:\n"+response.statusCode);
	}
});










// app.get('/', function (req, res) {
// 	res.render('index.html');
// });

// app.post('/dates', function (req, res) {
// 	var newDate=req.body;
// //	console.log(newDate);
// 	db.run("insert into dates (name, address, phone, password, image_url) values (?,?,?,?,?)",newDate.name, newDate.address, newDate.phone, newDate.password, newDate.image_url, function (err) {
// 		if (err) {
// 			throw err;
// 		} else { 
// 			db.all("select * from dates", function(sErr, sRows) {
// 				if (sErr) {
// 					throw (sErr);
// 				}
// 				res.json(sRows);
// 			});
// 		}
// 	});
// });

// app.get('/dates', function (req, res) {
// 	db.all("select * from dates", function (err, rows) {
// 		if(err) {
// 			throw err;
// 		}
// 		res.json(rows);
// 	});
// })

// app.get('/date/:id', function (req, res) {
// 	var dateNum=req.params.id;
// 	db.get("select * from dates where id = ?;", dateNum, function (err, row) {
// 		if (err) {
// 			throw err;
// 		}
// 		//console.log(row.id+':'+row.name+'\n'+row.address+'\n'+row.phone+'\n'+row.password+'\n'+row.image_url);
// 		res.render('date.ejs', { date : row });
// 	});
// });

// // for Instagram
// app.post('/insta', function (req, res) {
// 	var tag=req.body;
// 	var url='https://api.instagram.com/v1/tags/'+tag+'/media/recent?client_id=8fe4db31e3a940068664c1e7e3c5c061';

// 	request(url, function (error, response, body) {
// 		if(!error && response.statusCode===200) {
// 			data=JSON.parse(body);
// 			var img = data.data[0].images.standard_resolution.url;
// 			res.json(img);
// 		}
// 	});
// });

// var port = secrets['port'];  //fancy hosting!
// app.listen(port, function() {
// 	console.log('Listening (for dates) on port '+port);
// });
