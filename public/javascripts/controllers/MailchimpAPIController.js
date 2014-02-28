/***********************************
 * Author: Justin Knutson
 * Updated: 28 February 2014
 * Purpose: Control Regular Mailchimp Calls
 ***********************************/

function MailchimpController($scope, $http) {
  $scope.selectedTab = 'home';
  $scope.lists = [];
  $scope.campaigns = [];

  $scope.getContent = function() {
    $scope.getLists();
    $scope.getCampaigns();
  };

  $scope.getLists = function() {
    $http.get('/mailchimp/lists.json').success(function(data) {
      $scope.lists = data.lists;
    });
  };

  $scope.getCampaigns = function() {
    $http.get('/mailchimp/campaigns.json').success(function(data) {
      $scope.campaigns = data.campaigns;
    });
  };
}
