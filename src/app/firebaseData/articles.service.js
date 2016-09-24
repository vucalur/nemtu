import angular from "angular";
import {pluralOrSingular} from "../utils";

/**
 * Separate service instance for each channel, to avoid constant passing channelId in call hierarchy
 * and to manage states of pagination cursors.
 */
class Articles_ScopePrototype {
  constructor($log, $q, Paged, Root, Channels, Engines, AuthService, channelId) {
    this.$log = $log;
    this.$q = $q;
    this.Channels = Channels;
    this.Engines = Engines;
    this._ref = Root.ucArticles.child(AuthService.uid).child(channelId);
    this._readRef = this._ref.child('read');
    this._unreadRef = this._ref.child('unread');
    this._readPaged = Paged.createInstance(this._readRef);
    this._unreadPaged = Paged.createInstance(this._unreadRef);
    this._engineLoaded = this._loadEngine(channelId);
  }

  _loadEngine(channelId) {
    // TODO(vucalur): Load engines & channels (without articles!) in global-accessible cache and remove this promise craziness.
    return this.Channels.getChannelPromise(channelId)
      .then(channel => this.Engines.getEnginePromise(channel.engine_id))
      // TODO(vucalur): eslint's 'no-return-assign': "except-parens" not a valid configuration :(
      .then(engine => {
        this._engine = engine;
      });
  }

  unreadNextPage() {
    return this._unreadPaged.getNextPage();
  }

  readNextPage() {
    return this._readPaged.getNextPage();
  }

  // TODO(vucalur): Why "filterOnlyNew = articles => {" ain't compiling ?!
  filterOnlyNew(articles) {
    return this._engineLoaded
      .then(() => this._doFilterOnlyNew(articles))
      .then(newArticles => {
        this.$log.info(`After filtering out articles fetched earlier, ${newArticles.length} article${pluralOrSingular(newArticles)} left`);
        return newArticles;
      });
  }

  _doFilterOnlyNew(articles) {
    const waitFor = articles.map(article =>
      this._isNew(article).then(isNew => isNew ? article : null)
    );

    return this.$q.all(waitFor).then(decisionResults => {
      const newArticles = this._nullsRemoved(decisionResults);
      return newArticles;
    });
  }

  _isNew(article) {
    return this._storedVersions(article).then(versions => {
      if (versions.length === 0) {
        return article;
      }
      const latest = this._getLatest(versions);
      return this._contentChanged(article, latest);
    });
  }

  _storedVersions(article) {
    const listingId = article.listingId;

    const appendChildrenTo = (snap, arrayToAppend) => {
      snap.forEach(child => {
        arrayToAppend.push(child.val());
      });
    };

    return this._readRef.orderByChild('listingId').equalTo(listingId).once('value')
      .then(snap => {
        const versions = [];
        appendChildrenTo(snap, versions);
        return versions;
      }).then(versions => {
        return this._unreadRef.orderByChild('listingId').equalTo(listingId).once('value')
          .then(snap => {
            appendChildrenTo(snap, versions);
            return versions;
          });
      });
  }

  _getLatest(storedVersions) {
    let latest = {article: null, date: new Date(0)};

    for (const article of storedVersions) {
      const storedDate = new Date(article.datetimeScraped);
      if (storedDate > latest.date) {
        latest = {
          date: storedDate,
          article: article
        };
      }
    }

    return latest.article;
  }

  _contentChanged(article, originalArticle) {
    for (const field of this._engine.article.customFields) {
      if (!field.ignoreChanges) {
        const newVal = article.customFieldsValues[field.label];
        const originalVal = originalArticle.customFieldsValues[field.label];
        if (originalVal !== newVal) {
          return true;
        }
      }
    }
    return false;
  }

  _nullsRemoved(decisionResults) {
    return decisionResults.filter(article => article !== null);
  }

  addScraped(articles) {
    this._setDatetimeScraped(articles);
    return this._unreadPaged.addOmittingPagination(...articles);
  }

  markAsRead(article) {
    // removal will not affect pagination since article has already been fetched if this method is invoked
    this._removeUnread(article);
    this._readPaged.addOmittingPagination(article);
  }

  _removeUnread(article) {
    this._unreadRef.child(article.$key).remove();
  }

  _setDatetimeScraped(articles) {
    const datetimeScraped = Date.now();
    articles.forEach(article => {
      article.datetimeScraped = datetimeScraped;
    });
  }
}

export default class Articles {
  constructor($log, $q, Paged, Root, Channels, Engines, AuthService) {
    'ngInject';
    this.createInstance = channelId =>
      new Articles_ScopePrototype($log, $q, Paged, Root, Channels, Engines, AuthService, channelId);
  }
}

