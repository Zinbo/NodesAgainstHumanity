
angular.module('DeckBuilderApp').directive('stylingDirective', function() {
	return function(scope, element, attrs) {
		if (scope.$last) setTimeout(function(){
                scope.$emit('onRepeatLast', element, attrs);
            }, 1);
		};
})
.controller('MainController', function($scope, $http, CardFactory, ExpansionFactory) {

    $scope.tagline = 'Remembering famous PVG quotes since 2014';   

	$scope.$on('onRepeatLast', function(scope, element, attrs){
        $( ".black-card" ).each(function(){
			$( this ).height($( this ).innerWidth());
		});
		
		$( ".white-card" ).each(function(){
			$( this ).height($( this ).innerWidth());
		});
      });
	
	$scope.formatExpansions = function()
	{
		for(var j = 0; j < $scope.expansions.length; j++){
			var expansion = $scope.expansions[j];
			var cardIndex = 0;
			var cardArrayIndex = 0;
			
			//We separate cards into groups of 6 so they are rendered in rows of 6.
			var noOfWhiteCardSegments = Math.ceil(expansion.whiteCards.length / 6);		
			var expandedWhiteCards = new Array(noOfWhiteCardSegments);
			for(var i = 0; i < noOfWhiteCardSegments; i++){
				// if we're not on the last segment, then set the array size to 6
				if(i < noOfWhiteCardSegments -1) {
					expandedWhiteCards[i] = new Array(6);
				}
				//Else set to the odd number of cards left that don't divide by 6
				else {
					expandedWhiteCards[i] = new Array(expansion.whiteCards.length % 6);
				}
			}
			
			for(var i = 0; i < expansion.whiteCards.length; i++) {
				var whiteCardIndex = expansion.whiteCards[i];
				expandedWhiteCards[cardArrayIndex][cardIndex] = new Object();
				expandedWhiteCards[cardArrayIndex][cardIndex].id = whiteCardIndex;
				
				var addDescription = function(expandedWhiteCard) {
					return function(data) {
						expandedWhiteCard.description = data.description;
					};
				};
				
				$http.get('/api/card/' + whiteCardIndex)
					.success(addDescription(expandedWhiteCards[cardArrayIndex][cardIndex]));
					
				if(++cardIndex == 6) {
					cardIndex = 0;
					cardArrayIndex++;
				}
			}
			
			expansion.whiteCards = expandedWhiteCards;
			
			//Do the same for black cards
			cardIndex = 0;
			cardArrayIndex = 0;
			
			var noOfBlackCardSegments = Math.ceil(expansion.blackCards.length / 6);		
			var expandedBlackCards = new Array(noOfBlackCardSegments);
			for(var i = 0; i < noOfBlackCardSegments; i++){
				// if we're not on the last segment, then set the array size to 6
				if(i < noOfBlackCardSegments -1) {
					expandedBlackCards[i] = new Array(6);
				}
				//Else set to the odd number of cards left that don't divide by 6
				else {
					expandedBlackCards[i] = new Array(expansion.blackCards.length % 6);
				}
			}
			
			for(var i = 0; i < expansion.blackCards.length; i++) {
				var blackCardIndex = expansion.blackCards[i];
				expandedBlackCards[cardArrayIndex][cardIndex] = new Object();
				expandedBlackCards[cardArrayIndex][cardIndex].id = blackCardIndex;
				
				/*
				$http.get('/api/card/' + blackCardIndex)
					.success(function(data, cardIndex, cardArrayIndex) {
						
					});
				*/
				
				var addDescription = function(expandedBlackCard) {
					return function(data) {
						expandedBlackCard.description = data.description;
					};
				};
				
				$http.get('/api/card/' + blackCardIndex)
					.success(addDescription(expandedBlackCards[cardArrayIndex][cardIndex]));
					
				if(++cardIndex == 6) {
					cardIndex = 0;
					cardArrayIndex++;
				}
			}
			
			expansion.blackCards = expandedBlackCards;
		}
	}
	
	$http.get('/api/expansions')
		.success(function(data) {
			$scope.expansions = data;
			console.log(data);
			
			$scope.formatExpansions();
			console.log(data);
			
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	
	$scope.createExpansion = function() {
		$http.post('/api/expansions', $scope.formExpansionData)
			.success( function(data) {
				$scope.formExpansionData = {}; // clear the form so our user is ready to enter another
				$scope.expansions = data;
				$scope.formatExpansions();
			});
	};
	
	$scope.createCard = function() {
		
		if($("#is-white-checkbox").is(':checked')) {
			$scope.formCardData.isWhite = true;
		}
		else {
			$scope.formCardData.isWhite = false;
		}

		
		var formIsValid = false;
		
		$("#cardModal").find(".expansion_option").each(function(){
			if($( this ).attr('active') == "true")
			{
				$scope.formCardData.expansion = $( this ).attr('id');
				formIsValid = true;
			}
		});
		
		if(!formIsValid)
		{
			$("#cardModal").find(".expansion-dropdown").addClass("has-error");
		}
		
		$("#cardModal").find('.card-validation-needed').each(function(){
			if($( this ).val() == "") {
				formIsValid = false;
				//Why the fuck does return not return you out of the method, GOD JAVASCRIPT
				return false;
			}
		});

		if(formIsValid)
		{
			$http.post('/api/cards', $scope.formCardData)
				.success(function(data) {
					$scope.formCardData = {}; // clear the form so our user is ready to enter another
					$scope.expansions = data;
					$scope.formatExpansions();
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		
			$('#cardModal').modal('hide');
		}

		};
	
	$scope.editExpansion = function() {
		$scope.formUpdateExpansionData.id = $("#expansionEditModal").attr("expansion-id");
		$http.put('/api/expansions/', $scope.formUpdateExpansionData)
			.success(function(data) {
				$scope.formUpdateExpansionData = {}; // clear the form so our user is ready to enter another
				$scope.expansions = data;
				$scope.formatExpansions();
			});
	};
	
	$scope.deleteExpansion = function() {
		var id = $("#expansionEditModal").attr("expansion-id");
		$http.delete('/api/expansion/' + id)
			.success(function(data) {
				$scope.formUpdateExpansionData = {};
				$scope.expansions = data;
				$scope.formatExpansions();
				$('#expansionEditModal').modal('hide');
		});
	};
	
	//need to do a PUT which is picked up in server.js
	$scope.editCard = function() {
	
		if($scope.formEditCardData == undefined)
		{
			$scope.formEditCardData = new Object();
		}
	
		//Need to attach id to formData
		//need to extract number from string.
		$scope.formEditCardData.id = $("#cardEditModal").attr("card-id");
		$scope.formEditCardData.noOfResponses = $("#edit-card-responses").val();
		$scope.formEditCardData.description = $("#edit-card-description").val();
		
		if($("#is-white-checkbox-edit").is(':checked')) {
			$scope.formEditCardData.isWhite = true;
		}
		else {
			$scope.formEditCardData.isWhite = false;
		}
		
		var formIsValid = false;
		
		$("#cardEditModal").find(".edit_expansion_option").each(function(){
			if($( this ).attr('active') == "true")
			{
				$scope.formEditCardData.expansion = $( this ).attr('id').split("_")[1];
				formIsValid = true;
			}
		});
		
		if(!formIsValid)
		{
			$("#cardEditModal").find(".expansion-dropdown").addClass("has-error");
		}
		
		$("#cardEditModal").find('.card-validation-needed').each(function(){
			if($( this ).val() == "") {
				formIsValid = false;
				//Why the fuck does return not return you out of the method, GOD JAVASCRIPT
				return false;
			}
		});
		
		if(formIsValid)
		{
			$http.put('/api/cards/', $scope.formEditCardData)
				.success(function(data) {
					$scope.formEditCardData = {}; // clear the form so our user is ready to enter another
					$scope.expansions = data;
					$scope.formatExpansions();
				});
			$('#cardEditModal').modal('hide');
		}
	};
	
	$scope.deleteCard = function() {
		var id = $("#cardEditModal").attr("card-id");
		$http.delete('/api/card/' + id)
				.success(function(data) {
					$scope.formEditCardData = {}; // clear the form so our user is ready to enter another
					$scope.expansions = data;
					$scope.formatExpansions();
				});
			$('#cardEditModal').modal('hide');
	};
	
	$scope.OpenEditCardDialog = function(id) {
		$("#cardEditModal").attr("card-id", id);
		$http.get('/api/card/' + id)
			.success(function(data){
				$("#edit-card-description").val(data.description);
				$("#is-white-checkbox-edit").prop('checked', data.isWhite);
				$("#edit-card-responses").val(data.noOfResponses);
				
				//clear dropdown
				$(".expansion_option").each(function(){
					$( this ).attr('active', false);
				});
				
				//Need to choose correct expansion from drop down
				var $target = $( "#editexpansion_" + data.expansion );
				$target.closest( '.btn-group' )
				  .find( '[data-bind="label"]' ).text( $target.text() )
					 .end();
				 
				//Get rid of an option which was active before
				$(".edit_expansion_option").each(function(){
					$( this ).attr('active', false);
				});
				
				//Set the selected one to true so we know which one is selected later
				$target.attr('active', true);
			
				//set the right expansion as active
				$target.attr("active", true);
			
				//Finally open modal
				$('#cardEditModal').modal('show');
			});
	};
	
	$scope.OpenEditExpansionDialog = function(id) {
		$("#expansionEditModal").attr("expansion-id", id);
		$http.get('/api/expansion/' + id)
			.success(function(data)
			{	
				$('#edit-expansion-name').val(data.name);
				$('#expansionEditModal').attr('expansion-id', id);
				$('#expansionEditModal').modal('show');
			});
		
	}
	
});