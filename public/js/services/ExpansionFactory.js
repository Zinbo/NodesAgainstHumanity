angular.module('DeckBuilderApp').factory('ExpansionFactory', ['$http', function($http) {      

	return {
		get : function() {
			return $http.get('/api/expansions');
		},
		
		create : function(expansionData) {
			return $http.post('/api/expansions', expansionData);
		},
		
		edit : function(expansionData) {
			return $http.put('api/expansions', expansionData);
		},
		
		delete : function(id) {
			return $http.delete('/api/expansions/' + id);
		}
	}
}]);