 var Card = require('./models/card');
 var Expansion = require('./models/expansion');
 
 
 //Can use to clear the database if needed
 Card.remove({}, function(err) {
 });
 
 Expansion.remove({}, function(err) {
 });

 
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
					
					// get and return all the expansions after you create a card
					Expansion.find(function(err, expansions) {
						if (err)
							res.send(err)
						res.json(expansions);
					});
				});
			});
		});
		
		/*
		var changeExpansion = function(card, req)
		{
			//Check if card has moved expansions
			Expansion.findById(card.expansion, function(err, expansion) {
				if(card.isWhite)
				{
					for(var i = 0; i < expansion.whiteCards.length; i++)
					{
						if(expansion.whiteCards[i] == card._id)
						{
							expansion.whiteCards = expansion.whiteCards.splice(i, 1);
						}
					}
				}
				else {
					for(var i = 0; i < expansion.blackCards.length; i++)
					{
						if(expansion.blackCards[i] == card._id)
						{
							expansion.blackCards = expansion.blackCards.splice(i, 1);
						}
					}
				}
				
				expansion.save(function (err) {
					if(err)
						return handleError(err);
						
					Expansion.findById(req.body.expansion, function(err, expansion) {
						if(card.isWhite) {
							expansion.whiteCards.push(card._id);
						}
						else {
							expansion.blackCards.push(card._id);
						}
						
						expansion.save(function (err) {
							if(err)
								return handleError(err);
								
							card.expansion = req.body.expansion;
							
							card.save(function(err) {
							if(err)
								console.log("error: " + err);
								
								Expansion.find(function(err, expansions) {
									if (err)
										res.send(err)
									res.json(expansions);
								});
							});
						});
					});
				});
			});
		};
		*/
		app.put('/api/cards', function(req, res) {
			// create a card, information comes from AJAX request from Angular
			
			Card.findById(req.body.id, function(err, card) {
				if(err) {
					return handleError(err);
				}
				
				card.description = req.body.description;
				card.noOfResponses = req.body.noOfResponses;
				
				//check if card has changed colour
				console.log("Card is current white? " + card.isWhite);
				console.log("Card is going to be white? " + req.body.isWhite);
				/*
				if(card.isWhite != req.body.isWhite) {
					console.log("Card has changed colour!");
					Expansion.findById(card.expansion, function(err, expansion) {
						console.log("Have found card's expansion!");
						if(card.isWhite)
						{
							console.log("Card is white");
							for(var i = 0; i < expansion.whiteCards.length; i++)
							{
								if(expansion.whiteCards[i] == card._id) {
									console.log("Found white card in expansion, removing.");
									expansion.whiteCards = expansion.whiteCards.splice(i, 1);
									expansion.blackCards.push(card._id);
								}
							}
						}
						else {
							console.log("Card is black");
							for(var i = 0; i < expansion.blackCards.length; i++)
							{
							console.log("Found black card in expansion, removing.");
								if(expansion.blackCards[i] == card._id) {
									expansion.blackCards = expansion.blackCards.splice(i, 1);
									expansion.whiteCards.push(card._id);
								}
							}
						}
						
						expansion.save(function (err) {
							if(err)
								return handleError(err);
							
							card.isWhite = req.body.isWhite;
							
							if(card.expansion != req.body.expansion){
								changeExpansion(card, req);
							}
							else{
								card.save(function(err) {
									if(err)
										console.log("error: " + err);
										
									Expansion.find(function(err, expansions) {
										if (err)
											res.send(err)
										res.json(expansions);
									});
								});
							}
						});
					});
				}
				else if(card.expansion != req.body.expansion)
				{
					card.isWhite = req.body.isWhite;
					changeExpansion(card, req);
				}
				else{
				*/
					card.isWhite = req.body.isWhite;
					card.expansion = req.body.expansion;
					card.save(function(err) {
						if(err)
							console.log("error: " + err);
							
						Expansion.find(function(err, expansions) {
							if (err)
								res.send(err)
							res.json(expansions);
						});
					});
				//}
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
			Card.findById(req.params.card_id, function(err, card) {
				Expansion.findById(card.expansion, function(err, expansion) {
					if(card.isWhite) {
						for(var i = 0; i < expansion.whiteCards.length; i++){
							if(expansion.whiteCards[i] == card.id){
								expansion.whiteCards.splice(i, i+1);
							}
						}
						
					}
					else {
						for(var i = 0; i < expansion.blackCards.length; i++){
							if(expansion.blackCards[i] == card.id){
								expansion.blackCards.splice(i, i+1);
							}
						}
					};
					
					expansion.save(function (err) {
						if(err) {
							return handleError(err);
						}
						
						Card.remove({
							_id : req.params.card_id
						}, function(err, card) {
							if (err)
								res.send(err);

							// get and return all the todos after you create another
							Expansion.find(function(err, expansions) {
								if (err)
									res.send(err)
								res.json(expansions);
							});
						});
					});
				});
			});
			
			
		});
		
		app.get('/api/expansion/:expansion_id', function(req, res)
		{
			console.log("Looking for expansion with name: " + req.params.expansion_id);
			Expansion.findById(req.params.expansion_id, function(err, expansion) {

                if (err)
                    res.send(err);
					
                res.json(expansion); // return all expansion
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
		
		app.put('/api/expansions', function(req, res) {
			console.log("Looking for expansion with id: " + req.body.id);
			Expansion.findById(req.body.id, function(err, expansion) {
				if (err)
					res.send(err);
				expansion.name = req.body.name;
				
				// get and return all the cards after you create another
				expansion.save(function (err) {
					if(err) {
						return err;
					}
					
					Expansion.find(function(err, expansions) {
						if (err)
							res.send(err)
						res.json(expansions);
					});
				});
			});
		});
		
		app.delete('/api/expansion/:expansion_id', function(req, res) {
			console.log("looking to delete expansion with id: " + req.params.expansion_id);
			Expansion.findById(req.params.expansion_id, function(err, expansion) {
				if (err)
					res.send(err);
					
				Card.find({expansion : req.params.expansion_id}).remove().exec();
				
				Expansion.remove({
					_id : req.params.expansion_id
				}, function(err, expansion) {
					if (err)
						res.send(err);
						
					Expansion.find(function(err, expansions) {
						if (err)
							res.send(err)
						res.json(expansions);
					});
				});
				
			});
		});
		
        // frontend routes =========================================================
        // route to handle all angular requests
        app.get('*', function(req, res) {
            res.sendfile('./public/views/index.html'); // load our public/index.html file
        });

    };