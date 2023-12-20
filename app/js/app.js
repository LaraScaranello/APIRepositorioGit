var app = angular.module('githubApp', ['ngRoute']);

app.config(function ($routeProvider) {
  $routeProvider.when('/', {
    controller: 'main_controller'
  }).otherwise({
    redirectTo: '/'
  });
});
