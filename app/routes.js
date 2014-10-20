 var Card = require('./models/card');
 var Expansion = require('./models/expansion');
 
 /*
 //Can use to clear the database if needed
 Card.remove({}, function(err) {
 });
 
 Expansion.remove({}, function(err) {
 });
 */
 
 module.exports = function(app) {

        // server routes ===========================================================
		app.get('/api/cards', function(req, res) {
            // use mongoose to get all cards in the database
            Card.find(function(err, cards) {

                // if there is an error retrieving, send the error. 
                                // nothing after res.send(err) will execute
                if (err)
                    res.send(err);
                res.json(cards); // return all cards in JSON format
            });
        });
		
        // route to handle creating goes here (app.post)
        app.post('/api/cards', function(req, res) {
			// create a card, information comes from AJAX request from Angular
			
			var card = new Card({description : req.body.description,
				isWhite : req.body.isWhite,
				noOfResponses : req.body.noOfResponses,
				expansion : req.body.expansion});
			
			
			card.save(function (err) {
				if(err) {
					return handleError(err);
				}
			});
			
			//Update expansion to include card
			Expansion.findById(req.body.expansion, function(err, expansion) {
				if(err) {
					return handleError(err);
				}
				
				if(card.isWhite){
					expansion.whiteCards.push(card.id);
				} 
				else {
					expansion.blackCards.push(card.id);
				}
				
				expansion.save(function(err) {
					if(err) {
						return handleError(err);
					}
				});
			});
			
		});
		
		app.get('/api/card/:card_id', function(req, res) {
			Card.findById(req.params.card_id, function(err, card) {
				if(err) {
					return handleError(err);
				}
				
				res.json(card);
			});
		});
		
		// route to handle delete goes here (app.delete)
		// delete a todo
		app.delete('/api/card/:card_id', function(req, res) {
			Card.remove({
				_id : req.params.card_id
			}, function(err, card) {
				if (err)
					res.send(err);

				// get and return all the todos after you create another
				Card.find(function(err, cards) {
					if (err)
						res.send(err)
					res.json(cards);
				});
			});
		});
		
		app.get('/api/expansions', function(req, res) {
            // use mongoose to get all cards in the database
            Expansion.find(function(err, expansions) {

                // if there is an error retrieving, send the error. 
                                // nothing after res.send(err) will execute
                if (err)
                    res.send(err);
					
                res.json(expansions); // return all cards in JSON format
            });
        });
		
		app.post('/api/expansions', function(req, res) {

			// create a card, information comes from AJAX request from Angular
			Expansion.create({
				name : req.body.name,
				cards : []
			}, function(err, expansion) {
				if (err)
					res.send(err);

					
				// get and return all the cards after you create another
				Expansion.find(function(err, expansions) {
					if (err)
						res.send(err)
					res.json(expansions);
				});
			});
		});
		
        // frontend routes =========================================================
        // route to handle all angular requests
        app.get('*', function(req, res) {
            res.sendfile('./public/views/index.html'); // load our public/index.html file
        });

    };