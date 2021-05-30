import { API_URL } from '@/config';
import { createServer, Model, JSONAPISerializer } from 'miragejs';
import { authRoutes } from './auth';

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
    serializers: {
      application: JSONAPISerializer,
    },

    models: {
      user: Model,
    },

    routes() {
      this.urlPrefix = API_URL;
      this.timing = 1000;
      authRoutes(this);
    },

    seeds(server) {
      server.db.loadData(persistentDB.getDb());
    },
  });
}
