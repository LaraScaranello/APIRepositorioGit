// Descreve os testes para o serviço githubService
describe('githubService', function() {
    var githubService, $httpBackend;

    // Carrega o módulo 'githubApp' antes de cada teste
    beforeEach(module('githubApp'));

    // Configura o ambiente antes de cada teste
    beforeEach(inject(function(_githubService_, _$httpBackend_) {
        // Guarda uma referência para o serviço githubService
        githubService = _githubService_;
        // Guarda uma referência para o serviço $httpBackend
        $httpBackend = _$httpBackend_;
    }));

    // Após cada teste, verifica se todas as expectativas foram satisfeitas e se todas as solicitações foram tratadas
    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    // Teste para verificar a obtenção de repositórios com base na consulta e na página
    it('should get repositories based on search query and page', function() {
        var searchQuery = 'node';
        var page = 1;
        var apiUrl = 'https://api.github.com/search/repositories?q=' + searchQuery + '&page=' + page + '&per_page=10';
        var mockResponse = {
            items: [{ name: 'node' }],
            total_count: 1
        };

        // Define a expectativa de uma solicitação GET para a API do GitHub com a URL especificada
        $httpBackend.expectGET(apiUrl).respond(200, mockResponse);

        githubService.getRepositories(searchQuery, page)
            .then(function(data) {
                expect(data.items.length).toBe(1);
                expect(data.items[0].name).toBe('node');
                expect(data.total_count).toBe(1);
            });

        $httpBackend.flush();
    });
});
