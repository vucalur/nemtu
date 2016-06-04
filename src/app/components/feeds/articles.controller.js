export class ArticlesController {
  constructor(articlesService) {
    'ngInject';
    this.articlesService = articlesService;
    this.articles = [];
  }

  fetch(url) {
    this.articlesService.parsed(url)
      .then(articles =>
        this.articles = articles
      );
  }
}
