class ChannelController {
  constructor(Engines, Crawler) {
    'ngInject';

    this.Crawler = Crawler;
    this.engine = Engines.getEngine(this.user.uid, this.channel.engine_id);
    this.articles = null;
  }

  fetch() {
    this.Crawler.fetchArticles(this.channel.url, this.engine)
      .then(articles => {
        this.articles = articles;
      });
  }
}

export default {
  templateUrl: 'app/channels/channel/channel.template.html',
  controller: ChannelController,
  controllerAs: 'vm',
  bindings: {
    channel: '<',
    user: '<'
  }
};
