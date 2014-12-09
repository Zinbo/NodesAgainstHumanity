
//This triggers when the last card has been loaded so that the height of the card can be set to the width
// (since HTML has no real concept of height)
angular.module('DeckBuilderApp').directive('stylingDirective', function() {
	return function(scope, element, attrs) {
		if (scope.$last) setTimeout(function(){
                scope.$emit('onRepeatLast', element, attrs);
            }, 1);
		};
})
.controller('MainController', function($scope, $http, CardFactory, ExpansionFactory) {
	//Redundant really, but showing how things defined in the scope can be used in the view.
    $scope.tagline = 'Remembering famous PVG quotes since 2014';   

	//Set the height of the cards to be the inner width.
	$scope.$on('onRepeatLast', function(scope, element, attrs){
        $( ".card" ).each(function(){
			$( this ).height($( this ).innerWidth());
		});
      });
	
	var addDescription = function(expandedCard) {
		return function(data) {
			expandedCard.description = data.description;
			
		};
	};
	
	
	function setupCardArray(cards) {
				
		//We separate cards into groups of 6 so they are rendered in rows of 6.
		var noOfCardSegments = Math.ceil(cards.length / 6);		
		var expandedCards = new Array(noOfCardSegments);
		for(var i = 0; i < noOfCardSegments; i++){
			// if we're not on the last segment, then set the array size to 6
			if(i < noOfCardSegments -1) {
				expandedCards[i] = new Array(6);
			}
			//Else set to the number of cards left that don't divide by 6
			else {
				expandedCards[i] = new Array(cards.length % 6);
			}
		}
		
		var cardArrayIndex = 0;
		var cardIndex = 0;
		
		for(var i = 0; i < cards.length; i++) {
			var cardId = cards[i];
			expandedCards[cardArrayIndex][cardIndex] = new Object();
			expandedCards[cardArrayIndex][cardIndex].id = cardId;
				
			if(++cardIndex == 6) {
				cardIndex = 0;
				cardArrayIndex++;
			}
		}
		
		return expandedCards;
		
	};			
			
	$scope.formatExpansions = function() {
		for(var j = 0; j < $scope.expansions.length; j++){
			var expansion = $scope.expansions[j];
		
			expansion.whiteCards = setupCardArray(expansion.whiteCards);
			expansion.blackCards = setupCardArray(expansion.blackCards);

			for(var i = 0; i < expansion.whiteCards.length; i++){
				var whiteCardSubset = expansion.whiteCards[i];
				for(var k = 0; k < whiteCardSubset.length; k++) {
						CardFactory.get(whiteCardSubset[k].id).success(addDescription(expansion.whiteCards[i][k]));
				}
			}
			
			for(var i = 0; i < expansion.blackCards.length; i++){
				var blackCardSubset = expansion.blackCards[i];
				for(var k = 0; k < blackCardSubset.length; k++) {
						CardFactory.get(blackCardSubset[k].id).success(addDescription(expansion.blackCards[i][k]));
				}
			}
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
		ExpansionFactory.create($scope.formExpansionData)
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
			CardFactory.get($scope.formCardData)
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
		ExpansionFactory.create($scope.formUpdateExpansionData)
			.success(function(data) {
				$scope.formUpdateExpansionData = {}; // clear the form so our user is ready to enter another
				$scope.expansions = data;
				$scope.formatExpansions();
			});
	};
	
	$scope.deleteExpansion = function() {
		var id = $("#expansionEditModal").attr("expansion-id");
		ExpansionFactory.delete(id)
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
			CardFactory.create($scope.formEditCardData)
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
		CardFactory.delete(id)
				.success(function(data) {
					$scope.formEditCardData = {}; // clear the form so our user is ready to enter another
					$scope.expansions = data;
					$scope.formatExpansions();
				});
			$('#cardEditModal').modal('hide');
	};
	
	$scope.OpenEditCardDialog = function(id) {
		$("#cardEditModal").attr("card-id", id);
		CardFactory.get(id)
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
		ExpansionFactory.get(id)
			.success(function(data){	
				$('#edit-expansion-name').val(data.name);
				$('#expansionEditModal').attr('expansion-id', id);
				$('#expansionEditModal').modal('show');
			});
		
	}
	
});