/***********************************
 * Author: Justin Knutson
 * Updated: 7 March 2014
 * Purpose: Control single db updates
 ***********************************/

function WatchUpdateController($scope, $http) {
  var editCollection,
      editName,
      editName,
      editLongDescription,
      editShortDescription,
      editTrivia = false;
  var editInstructions = [];

  $scope.recipient = {};

  $scope.defaultInstructions = {name : '', description : '', special : ''};

  $scope.watch = [];

  $scope.getWatch = function(id) {
    $http.get('/watches/' + id + '.json').success(function(data) {
      $scope.watch = data.watch;
    });
  };

  /*********************************
   * Show/hide function for edit collection
   *********************************/

  $scope.editCollectionOn = function() {
    editCollection = true;
  };

  $scope.editCollectionOff = function() {
    editCollection = false;
  };

  $scope.showEditCollection = function() {
    return editCollection;
  };

  $scope.updateCollection = function(watch) {
    $http.put("/watches/" + watch._id + ".json", [
        {_id : watch._id},
        {ej_collection : watch.ej_collection}]);
  };

  /*********************************
   * Show/hide functions for Edit Name
   *********************************/

  $scope.editNameOn = function() {
    editName = true;
  };

  $scope.editNameOff = function() {
    editName = false;
  };

  $scope.showEditName = function() {
    return editName;
  };

  $scope.updateName = function(watch) {
    $http.put("/watches/" + watch._id + ".json", [
        {_id : watch._id},
        {brand : watch.brand, family : watch.family, model : watch.model}]);
  };

  /*********************************
   * Show/hide functions for Edit
   * Long Description
   *********************************/

  $scope.editLongDescriptionOn = function() {
    editLongDescription = true;
  };

  $scope.editLongDescriptionOff = function() {
    editLongDescription = false;
  };

  $scope.showEditLongDescription = function() {
    return editLongDescription;
  };

  $scope.updateLongDescription = function(watch) {
    $http.put("/watches/" + watch._id + ".json", [
        {_id : watch._id},
        {description_long : watch.description_long}]);
  };


  /********************************
   * Show/hide functions for each
   * instruction
   ********************************/

  $scope.editInstructionOn = function(index) {
    editInstructions[index] = true;
  };

  $scope.editInstructionOff = function(index) {
    editInstructions[index] = false;
  };

  $scope.showEditInstruction = function(index) {
    return editInstructions[index];
  };

  $scope.updateInstructions = function(watch, index) {
    $http.put("/watches/" + watch._id + ".json", [{_id : watch._id}, {instructions : watch.instructions}]);
  };

  $scope.removeInstruction = function(watch, index) {
    $scope.watch.instructions.splice(index, 1);
    $http.put("/watches/" + watch._id + ".json", [{_id : $scope.watch._id}, {instructions : watch.instructions}]);
  };

  /********************************
   * Show/hide functions for Short
   * Descriptions
   ********************************/

  $scope.editShortDescriptionOn = function() {
    editShortDescription = true;
  };

  $scope.editShortDescriptionOff = function() {
    editShortDescription = false;
  };

  $scope.showEditShortDescription = function() {
    return editShortDescription;
  };

  $scope.updateShortDescription = function(watch) {
    $http.put("/watches/" + watch._id + ".json", [
        {_id : watch._id},
        {description_short: watch.description_short}]);
  };

  /********************************
   * Show/hide functions for Trivia
   ********************************/

  $scope.editTriviaOn = function() {
    editTrivia = true;
  };

  $scope.editTriviaOff = function() {
    editTrivia = false;
  };

  $scope.showEditTrivia = function() {
    return editTrivia;
  };

  $scope.updateTrivia = function(watch) {
    $http.put("/watches/" + watch._id + ".json", [
        {_id : watch._id},
        {trivia : watch.trivia}]);
  };

  /********************************
   * Add Watch Instruction
   ********************************/

  $scope.addInstruction = function(instruction) {
    $scope.watch.instructions.push(instruction);
    $scope.updateInstructions($scope.watch);
    $scope.instruction = angular.copy($scope.defaultInstruction);
  };

  $scope.sendEmail = function() {
    var url = 'assets.elevenjames.com/watch-info/' + $scope.watch._id + '.json';
    var emailContent = {
      name : $scope.recipient.name,
      email : $scope.recipient.email,
      brand : $scope.watch.brand,
      family : $scope.watch.family,
      link : url
    };
    $http.post('/email', emailContent).success(function(data) {
      console.log(data);
    });
  };
}
