// Descreve os testes para o controlador main_controller
describe('main_controller', function() {
    var $controller, $rootScope, $q, githubServiceMock, $scope;

    // Carrega o módulo 'githubApp' antes de cada teste
    beforeEach(module('githubApp'));

    // Configura o ambiente antes de cada teste
    beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
        // Guarda uma referência para o serviço $controller
        $controller = _$controller_;
        // Guarda uma referência para o serviço $rootScope
        $rootScope = _$rootScope_;
        // Guarda uma referência para o serviço $q, para trabalhar com promessas
        $q = _$q_;

        // Mock do serviço do GitHub para simular suas funções
        githubServiceMock = {
            getRepositories: function(searchQuery, page) {
                var deferred = $q.defer();
                // Simula a resolução da promessa com dados de repositórios
                deferred.resolve({
                    items: [{ name: 'repo1' }, { name: 'repo2' }],
                    total_count: 2
                });
                return deferred.promise;
            }
        };

        // Cria um novo escopo isolado para cada teste
        $scope = $rootScope.$new();
        // Cria uma instância do controlador main_controller, injetando o escopo e o serviço mockado
        $controller('main_controller', {
            $scope: $scope,
            githubService: githubServiceMock
        });
    }));

    // Teste para a função fetchRepositories
    it('should fetch repositories and update scope variables', function() {
        // Espiona a função getRepositories do mock
        spyOn(githubServiceMock, 'getRepositories').and.callThrough();

        $scope.fetchRepositories();
        expect(githubServiceMock.getRepositories).toHaveBeenCalledWith('', 1);
        $rootScope.$apply();

        // Verifica se os dados foram atribuídos corretamente ao escopo
        expect($scope.repositories.length).toBe(2);
        expect($scope.totalPages).toBe(1);
        expect($scope.hasNextPage).toBe(false);
    });
});
