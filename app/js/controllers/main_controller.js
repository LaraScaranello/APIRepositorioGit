var app = angular.module('githubApp', []);

app.controller('main_controller', function($scope, githubService) {
  // Variáveis do escopo para armazenar dados e estado da página
  $scope.searchQuery = '';
  $scope.repositories = [];
  $scope.currentPage = 1;
  $scope.itemsPerPage = 10;
  $scope.totalPages = 1;
  $scope.hasNextPage = false;
  $scope.sidebar = false; 
  $scope.uniqueLanguages = [];
  $scope.selectedLanguage = null;
  $scope.anoAtual = new Date().getFullYear();

  // Mapeamento de cores para algumas linguagens específicas
  var languageColors = {
    'JavaScript': '#FFFF00',
    'Jupyter Notebook': '#D2691E',
    'Shell': '	#7FFF00',
    'Java': '#FFA500',
    'TypeScript': '#0000FF',
    'Dart': '#00FF00',
    'HTML': '#FF0000',
    'Go': '#00BFFF',
    'C': '#4B0082',
    'Dockerfile': '#DA70D6',
    'C#': '#DAA520',
    'CSS': '#DC143C',
  };

  // Função para obter a cor de uma linguagem
  $scope.getLanguageColor = function (language) {
    return {'background-color': languageColors[language] || '#CCC'};
  };

  // Função para pesquisar repositórios com base na consulta
  $scope.searchRepositories = function () {
    $scope.currentPage = 1; 
    $scope.fetchRepositories();
  };

  // Função para buscar repositórios da API do GitHub
  $scope.fetchRepositories = function () {
    let startIndex = ($scope.currentPage - 1) * $scope.itemsPerPage;
    githubService.getRepositories($scope.searchQuery, $scope.currentPage)
      .then(function (data) {
        $scope.repositories = data.items || [];
        console.log($scope.repositories);
        $scope.totalPages = Math.ceil(data.total_count / 10);
        $scope.hasNextPage = data.total_count > $scope.currentPage * 10;
        $scope.sidebar = true; 
        $scope.languageRepositories = $scope.getLanguageRepositories();
      });
  };

  // Função para agrupar repositórios por linguagem
  $scope.getLanguageRepositories = function() {
    let languageRepos = {};
    $scope.repositories.forEach(function(repo) {
      if (repo.language) {
        if (!languageRepos[repo.language]) {
          languageRepos[repo.language] = [];
        }
        languageRepos[repo.language].push(repo);
      }
    });
    return languageRepos;
  };

  // Função para abrir/fechar repositórios de uma linguagem específica
  $scope.openLanguageRepos = function (language) {
    $scope.selectedLanguage = ($scope.selectedLanguage === language) ? null : language;
  };

  // Função para obter as issues de um repositório
  $scope.getRepoIssues = function (username, reponame) {
    githubService.getIssues(username, reponame)
      .then(function (issues) {
      })
      .catch(function (error) {
        console.error('Error fetching issues', error);
      });
  };

  // Funções para navegar entre páginas de resultados
  $scope.nextPage = function () {
    $scope.currentPage++;
    $scope.fetchRepositories();
  };

  $scope.previousPage = function () {
    $scope.currentPage--;
    $scope.fetchRepositories();
  };

  // Função para obter as páginas disponíveis para navegação
  $scope.getPages = function () {
    let startPage = Math.max(1, $scope.currentPage - 2);
    let endPage = Math.min($scope.totalPages, startPage + 4);
  
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
  
    let pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  
    return pages;
  };
  
  // Função para ir para uma página específica
  $scope.goToPage = function (page) {
    if (page < 1) {
      page = 1;
    } else if (page > $scope.totalPages) {
      page = $scope.totalPages;
    }
    $scope.currentPage = page;
    $scope.fetchRepositories();
  };

  // Função para verificar a página ativa
  $scope.checkActive = function(page) {
    console.log('currentPage:', $scope.currentPage);
    console.log('page:', page);
  };

  // Função para formatar o número de estrelas de um repositório
  $scope.formatStargazersCount = function (count) {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  };

  // Função para formatar a data de última atualização de um repositório
  $scope.formatLastUpdatedDate = function (updatedAt) {
    const lastUpdated = new Date(updatedAt);
    const now = new Date();
    const diffTime = Math.abs(now - lastUpdated);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Updated yesterday';
    } else if (diffDays < 7) {
      return `Updated ${diffDays} days ago`;
    } else {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return `Updated on ${lastUpdated.toLocaleDateString('en-US', options)}`;
    }
  };

});