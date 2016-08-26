class ArticlesController {
  constructor(articlesService) {
    'ngInject';
    this.articlesService = articlesService;
    this.articles = [];
  }

  fetch(url) {
    this.articlesService.parsed(url)
      .then(articles => {
        this.articles = articles;
      });
  }
}

export default {
  templateUrl: 'app/components/articles/articles.html',
  controller: ArticlesController,
  controllerAs: 'vm'
};
