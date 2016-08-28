class ChannelController {
  constructor(Engines, FetchArticles) {
    'ngInject';

    this.FetchArticles = FetchArticles;
    this.engine = Engines.getEngine(this.user.uid, this.channel.engine_id);
    this.articles = null;
  }

  fetch() {
    this.FetchArticles.parsed(this.channel.url, this.engine)
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
