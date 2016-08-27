class ArticlesController {
  constructor(Articles) {
    'ngInject';
    this.Articles = Articles;
    this.articles = [];
  }

  fetch(url) {
    this.Articles.parsed(url)
      .then(articles => {
        this.articles = articles;
      });
  }
}

export default {
  templateUrl: 'app/articles/articles.html',
  controller: ArticlesController,
  controllerAs: 'vm'
};
