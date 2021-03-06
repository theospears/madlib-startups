express = require('express');
mongodb = require('mongodb');


function put_phrase(coll, category, phrase) {
	var obj = {'category': category, 'phrase': phrase };
	coll.update(obj, obj, {upsert: true, w: 0});
}

var MONGO_URL = "mongodb://localhost:27017/madlibs-startups"

var app = express.createServer();


app.use(express.static(__dirname + '/static'));
app.use(express.bodyParser());

app.get('/template-data', function(req, res, next) {
	var response = {};

	mongodb.connect(MONGO_URL, function(err, conn) {
		conn.collection('phrases', function(err, coll) {
			coll.find().each(function(err, doc) {
				if(doc != null)
				{
					if(!response.hasOwnProperty(doc.category)) {
						response[doc.category] = [];
					}
					response[doc.category].push({id: doc._id, phrase: doc.phrase});
				}
				else
				{
					res.send(response);
				}
			});
		});
	});

});


app.post('/phrases/:category', function(req, res, next) {
	mongodb.connect(MONGO_URL, function(err, conn) {
		conn.collection('phrases', function(err, coll) {
			put_phrase(coll, req.params.category, req.body['content']);
			res.send("");
		});
	});
});


app.get('/initial-data', function(req, res, next) {
	var items = {
		'famous_startup': ['Groupon', 'Facebook', 'AirBnB', 'TechCrunch', 'Reddit', 'FourSquare', 'Spotify', 'Uber', 'Gawker', 'The Times', 'Hacker News', 'Amazon', 'Apple', 'Twitter', 'Threadless'],
		'customer_type': [ "opticians", "dog walkers", "astronauts", "journalists", "dogs", "stamp collectors", "people who can't speak", "arachnophobes", "Norweigans", "aquatic mammals", "hermits", "people with a scrap of humanity", "kermits", "marketers", "businesses", "teachers", "hippies", "recovering alcoholics", "lumberjacks", "douchebags", "manatees", "monsters"],
		'colour': ['Red', 'Blue', 'Orange', 'Mauve', 'Purple'],
		'noun': ['Ostriches', 'Giraffe', 'Systems', 'Potato', 'Software', 'Bus'],
		'company_name': ['The Big $colour $noun', '$colour $noun'],
		'defined_offering' : ['a web application', 'a facebook app', 'an iPhone app', 'an iOS app', 'an MS-DOS app', 'massive arms', 'a captive portal'],
		'solve_problem': ['meet people', 'find jobs', 'find love', 'organise their lives', 'plan their weddings', 'take over the world', 'obtain leads', 'reach their fans', 'embrace the cloud', 'talk directly to customers'],
		'in_way': [ "", "through crowdsourcing", "offline", "using big data analytics", "and $solve_problem", "instantly", "through gamification", "at night", "from their garden sheds" ],
		'template': [
			"It's like $famous_startup but for $customer_type",
			"My company, $company_name, is developing $defined_offering to help $customer_type $solve_problem $in_way"
		]
	}

	mongodb.connect(MONGO_URL, function(err, conn) {
		conn.collection('phrases', function(err, coll) {
			for(var category in items) {
				if(items.hasOwnProperty(category)) {
					for(var i = 0; i < items[category].length; i++) {
						put_phrase(coll, category, items[category][i]);
					}
				}
			}
		});
	});

	res.send("");
});


app.listen(4000, '127.0.0.1');
