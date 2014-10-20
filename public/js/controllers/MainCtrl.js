
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
	
	$http.get('/api/expansions')
		.success(function(data) {
			$scope.expansions = data;
			console.log(data);
			
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
				
				console.log($scope.expansions);
			}
			
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	
	$scope.createExpansion = function() {
		ExpansionFactory.create($scope.formExpansionData);
	};
	
	$scope.createCard = function() {
		$(".expansion_option").each(function(){
			if($( this ).attr('active') == "true")
			{
				$scope.formCardData.expansion = $( this ).attr('id');
			}
		});
		
		if($("#is-white-checkbox").is(':checked')) {
			$scope.formCardData.isWhite = true;
		}
		else {
			$scope.formCardData.isWhite = false;
		}
		
		
		CardFactory.create($scope.formCardData);
	};
	
});