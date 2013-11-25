// define a dataStore
// check it out: https://gist.github.com/turingou/5908791
window.store = angular.module('store', ['ngResource']).factory('Store', function($resource) {
  return {
    article: $resource('/article/:id', {id:'@id'}),
    user: $resource('/user/:id', {id:'@id'}),
    signin: $resource('/signin'),
    signup: $resource('/signup')
  }
});