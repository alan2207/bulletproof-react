import { API_URL } from '@/config';
import { createServer, Model, belongsTo, hasMany } from 'miragejs';
import { authRoutes } from './auth';
import { commentsRoutes } from './comments';
import { discussionsRoutes } from './discussions';
import { invitesRoutes } from './invites';
import { teamsRoutes } from './teams';
import { usersRoutes } from './users';

const persistentDB = {
  getDb() {
    return JSON.parse(window.localStorage.getItem('mirage-db')) || {};
  },
  updateCollection(collection, schema) {
    const db = this.getDb();
    db[collection] = schema.db[collection];
    window.localStorage.setItem('mirage-db', JSON.stringify(db));
  },
};

export function makeServer({ environment = 'test' }) {
  return createServer({
    environment,
    models: {
      user: Model.extend({
        team: belongsTo(),
        comments: hasMany(),
      }),
      team: Model.extend({
        users: hasMany(),
        discussions: hasMany(),
        invites: hasMany(),
      }),
      invite: Model.extend({
        team: belongsTo(),
      }),
      discussion: Model.extend({
        team: belongsTo(),
        comments: hasMany(),
      }),
      comment: Model.extend({
        discussion: belongsTo(),
        author: belongsTo('user'),
      }),
    },

    routes() {
      this.urlPrefix = API_URL;
      this.timing = 1000;
      authRoutes(this);
      commentsRoutes(this);
      discussionsRoutes(this);
      invitesRoutes(this);
      teamsRoutes(this);
      usersRoutes(this);
    },

    seeds(server) {
      server.db.loadData(persistentDB.getDb());
    },
  });
}
