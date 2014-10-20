
angular.module('DeckBuilderApp').controller('MainController', function($scope, $http, CardFactory, ExpansionFactory) {

    $scope.tagline = 'Remembering famous PVG quotes since 2014';   

	$http.get('/api/expansions')
		.success(function(data) {
			$scope.expansions = data;
			console.log(data);
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
		
		CardFactory.create($scope.formCardData);
	};
	
});