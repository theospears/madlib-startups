express = require('express');
mongodb = require('mongodb');

var MONGO_URL = "mongodb://localhost:27017/madlibs-startups"

var app = express.createServer();


app.use(express.static(__dirname + '/static'));
app.use(express.bodyParser());

app.get('/template-data', function(req, res, next) {
	var response = {};

	mongodb.connect(MONGO_URL, function(err, conn) {
		conn.collection('items', function(err, coll) {
			coll.find().each(function(err, doc) {
				if(doc != null)
				{
					response[doc._id] = doc.entries;
				}
				else
				{
					res.send(response);
				}
			});
		});
	});

});

app.post('/new-phrase', function(req, res, next) {
	mongodb.connect(MONGO_URL, function(err, conn) {
		conn.collection('items', function(err, coll) {
			coll.find({_id: req.body['category']}).each(function(err, doc) {
				if(doc != null)
				{
					doc.entries.push(req.body['phrase']);
					coll.update({_id: doc._id }, doc);
				}
				else
				{
					res.send("");
				}
			});
		});
	});
});


app.get('/initial-data', function(req, res, next) {
	var items = {
		'famous_startup': ['Groupon', 'Facebook', 'Airbnb', 'TechCrunch', 'Reddit', 'Foursquare', 'Spotify', 'Uber'],
		'customer_type': ['opticians', 'dog walkers', 'astronauts', 'journalists', 'dogs', 'stamp collectors', 'people who can\'t speak', 'arachnophobes'],
		'colour': ['Red', 'Blue', 'Orange', 'Mauve', 'Purple'],
		'noun': ['Ostriches', 'Giraffe', 'Systems', 'Potato', 'Software', 'Bus'],
		'company_name': ['The Big $colour $noun', '$colour $noun'],
		'defined_offering' : ['a web application', 'a facebook app', 'an iPhone app'],
		'solve_problem': ['meet people', 'find jobs', 'find love', 'organise their lives', 'plan their weddings', 'take over the world', 'obtain leads', 'reach their fans', 'embrace the cloud'],
		'in_way': ['', 'through crowdsourcing', 'offline', 'using big data analytics', 'and $solve_problem'],
		'template': [
			"It's like $famous_startup but for $customer_type",
			"My company, $company_name, is developing $defined_offering to help $customer_type $solve_problem $in_way"
		]
	}

	mongodb.connect(MONGO_URL, function(err, conn) {
		conn.collection('items', function(err, coll) {
			for(var v in items) {
				if(items.hasOwnProperty(v)) {
					coll.insert({_id: v, entries: items[v]});
				}
			}
		});
	});

	res.send("");
});


app.listen(4000);
