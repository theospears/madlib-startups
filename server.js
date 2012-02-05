express = require('express');

var app = express.createServer();

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

app.use(express.static(__dirname + '/static'));

app.get('/template-data', function(req, res, next) {
	res.send(items);
});


app.listen(4000);
