import { factory, primaryKey } from '@mswjs/data';

const models = {
  user: {
    id: primaryKey(String),
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    teamId: String,
    role: String,
    bio: String,
  },
  team: {
    id: primaryKey(String),
    name: String,
    description: String,
  },
  discussion: {
    id: primaryKey(String),
    title: String,
    body: String,
    teamId: String,
  },
  comment: {
    id: primaryKey(String),
    body: String,
    authorId: String,
    discussionId: String,
    createdAt: String,
  },
};

export const db = factory(models);

export type Model = keyof typeof db;

export const loadDb = () =>
  Object.assign(JSON.parse(window.localStorage.getItem('msw-db') || '{}'));

export const persistDb = (model: Model) => {
  const data = loadDb();
  data[model] = db[model].getAll();
  window.localStorage.setItem('msw-db', JSON.stringify(data));
};

// window.db = db;

export const initializeDb = () => {
  const database = loadDb();
  Object.entries(db).forEach(([key, model]) => {
    const dataEntres = database[key];
    if (dataEntres) {
      dataEntres?.forEach((entry: Record<string, any>) => {
        model.create(entry);
      });
    }
  });
};

initializeDb();
