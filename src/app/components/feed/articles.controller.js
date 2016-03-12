export class ArticlesController {
  constructor(articles) {
    'ngInject';
    this.articlesService = articles;
    this.articles = [];
  }

  fetch(url) {
    this.articlesService.parsed(url)
      .then(articles =>
        this.articles = articles
      );
  }
}
