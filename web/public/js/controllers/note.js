angular.module('rote').controller('note', ['$scope', '$http', 'modalService', 
	function($scope, $http, modalService) {
	
	var rote = new RoteClient($http);
	
	const modalTemplateUrl = '/../../partials/note-modal.html';
	
	$scope.getNotes = function() {
		rote.getNotes({}, function(err, response) {
			$scope.notes = err ? [] : response.data;
		});
	}
	
	$scope.deleteNote = function(note) {
		rote.deleteNote({ id: note.id }, function(err, response) {
			if (err) return;
			$scope.notes = _.reject($scope.notes, function(n) { return n.id === note.id; });
		});
	}
	
	$scope.editNote = function(note) {
		
		rote.getCategories({}, function(err, response) {
			var categories = err ? [] : response.data;
			
			var selectedCategory = _.find(categories, function(c) { return c.id === note.category_id });
			
			modalService.showModal({
				templateUrl: modalTemplateUrl
			}, {
				categories: categories,
				title: note.title,
				content: note.content,
				selectedCategory: selectedCategory,
			}).then(function(result) {
				rote.updateNote({
					id: note.id,
					title: result.title,
					content: result.content,
					category_id: result.selectedCategory.id
				}, function(err, response) {
					if (err) return; 
					
					var r = response.data[0];
					
					var n = _.find($scope.notes, function(n) { return n.id === r.id });
					if (!n) return;
					
					n.title = r.title;
					n.content = r.content;
					n.category_id = result.selectedCategory.id;
					n.category_name = result.selectedCategory.name;
					n.when_created = r.when_created;
					n.when_updated = r.when_updated;
				});
			});
			
			
			
		});
	}
	
	$scope.addNote = function() {
		
		rote.getCategories({}, function(err, response) {
			var categories = err ? [] : response.data;
			
			modalService.showModal({
				templateUrl: modalTemplateUrl
			}, {
				categories: categories,
			})
			.then(function(result) {
				
				rote.addNote({
					title: result.title,
					content: result.content,
					category_id: result.selectedCategory.id,
				}, function(err, response) {
					if (err) return;
					$scope.notes.push(response.data[0]);
				});
			});
			
			
		});
	}
	
	$scope.notes = [];
	$scope.getNotes();
}]);