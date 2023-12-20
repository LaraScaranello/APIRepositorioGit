var app = angular.module('githubApp');

app.factory('githubService', function ($http) {
  var baseUrl = 'https://api.github.com/search/';
  var itemsPerPage = 10;

  return {
      // Método para obter repositórios com base na consulta e na página
      getRepositories: function (searchQuery, page) {
          // Constrói a URL para buscar repositórios com base nos parâmetros
          var apiUrl = baseUrl + 'repositories?q=' + searchQuery + '&page=' + page + '&per_page=' + itemsPerPage;
          
          // Realiza uma requisição GET utilizando $http do Angular
          return $http.get(apiUrl)
              .then(function (response) {
                  // Retorna os dados dos repositórios em caso de sucesso
                  return response.data;
              })
              .catch(function (error) {
                  // Em caso de erro, imprime no console e retorna um array vazio
                  return [];
              });
      },
      // Método para obter as issues de um repositório específico
      getIssues: function (username, reponame) {
          // Constrói a URL para buscar as issues do repositório especificado
          var apiUrl = baseUrl + 'issues?q=repo:' + username + '/' + reponame;
          
          // Realiza uma requisição GET utilizando $http do Angular
          return $http.get(apiUrl)
              .then(function (response) {
                  // Retorna os dados das issues em caso de sucesso
                  return response.data;
              })
              .catch(function (error) {
                  // Em caso de erro, imprime no console e retorna um array vazio
                  console.error('Error fetching issues', error);
                  return [];
              });
      }
  };
});