describe('Teste de integração do controlador GitHub', function() {
  var $scope, $controller, $q, githubService, $compile, $rootScope, $httpBackend;

  // Carrega o módulo 'githubApp' e suas dependências
  beforeEach(module('githubApp'));

  // Injeta dependências e obtém instâncias necessárias
  beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _githubService_, _$compile_, _$httpBackend_) {
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $controller = _$controller_;
    $q = _$q_;
    githubService = _githubService_;
    $compile = _$compile_;
    $httpBackend = _$httpBackend_;

    // Cria um mock da resposta do serviço
    var mockResponse = {
      items: [
        { name: 'Repo 1' },
        { name: 'Repo 2' },
      ]
    };

    // Espiona o método do serviço para retornar uma promise resolvida com a resposta mockada
    spyOn(githubService, 'getRepositories').and.returnValue($q.resolve(mockResponse));

    // Inicializa o controlador passando o escopo e o serviço
    $controller('main_controller', {
      $scope: $scope,
      githubService: githubService
    });
  }));

  // Teste para verificar a inicialização do controlador e dos serviços
  it('should initialize controller and services', function() {
    expect($controller).toBeDefined(); // Verifica se o controlador foi inicializado
    expect($scope).toBeDefined(); // Verifica se o escopo foi criado
    expect(githubService).toBeDefined(); // Verifica se o serviço está disponível
  });

  // Teste para verificar a resolução correta das promessas do serviço
  it('should resolve service promises correctly', function() {
    githubService.getRepositories().then(function(data) {
      expect(data.items.length).toEqual(2); // Verifica se a promessa retornou 2 repositórios
      expect(data.items[0].name).toEqual('Repo 1'); // Verifica os dados do primeiro repositório
      expect(data.items[1].name).toEqual('Repo 2'); // Verifica os dados do segundo repositório
    });
    $rootScope.$apply(); // Atualiza o escopo para resolver as promessas
  });

  // Teste para verificar se os repositórios são renderizados corretamente no DOM
  it('should render repositories in the compiled element', function() {
    githubService.getRepositories().then(function(data) {
      // Verifica se o escopo contém os repositórios obtidos do serviço
      expect(data.items.length).toEqual(2);
    
      // Cria um elemento DOM simulado
      var element = angular.element('<div ng-controller="main_controller"><ul><li ng-repeat="repo in repositories">{{ repo.name }}</li></ul></div>');
      
      // Compila o elemento com o escopo
      var compiledElement = $compile(element)($scope);
    
      // Atualiza o escopo
      $scope.$digest();
    
      // Verifica se há 2 elementos <li> e seus conteúdos
      var liElements = compiledElement.find('li');
      expect(liElements.length).toEqual(2); // Verifica se há 2 elementos <li>
      expect(liElements.eq(0).text().trim()).toEqual('Repo 1'); // Verifica o nome do primeiro repositório
      expect(liElements.eq(1).text().trim()).toEqual('Repo 2'); // Verifica o nome do segundo repositório
      done();
    }).catch(function(error) {
      // Trata erros, se houver
      done.fail(error);
    });
  });
  
});