import { factory, primaryKey } from '@mswjs/data';
import { nanoid } from 'nanoid';

const models = {
  user: {
    id: primaryKey(nanoid),
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    teamId: String,
    role: String,
    bio: String,
    createdAt: Date.now,
  },
  team: {
    id: primaryKey(nanoid),
    name: String,
    description: String,
    createdAt: Date.now,
  },
  discussion: {
    id: primaryKey(nanoid),
    title: String,
    body: String,
    authorId: String,
    teamId: String,
    createdAt: Date.now,
    public: Boolean,
  },
  comment: {
    id: primaryKey(nanoid),
    body: String,
    authorId: String,
    discussionId: String,
    createdAt: Date.now,
  },
};

export const db = factory(models);

export type Model = keyof typeof models;

const dbFilePath = 'mocked-db.json';

export const loadDb = async () => {
  // If we are running in a Node.js environment
  if (typeof window === 'undefined') {
    const { readFile, writeFile } = await import('fs/promises');
    try {
      const data = await readFile(dbFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error: any) {
      if (error?.code === 'ENOENT') {
        const emptyDB = {};
        await writeFile(dbFilePath, JSON.stringify(emptyDB, null, 2));
        return emptyDB;
      } else {
        console.error('Error loading mocked DB:', error);
        return null;
      }
    }
  }
  // If we are running in a browser environment
  return Object.assign(
    JSON.parse(window.localStorage.getItem('msw-db') || '{}'),
  );
};

export const storeDb = async (data: string) => {
  // If we are running in a Node.js environment
  if (typeof window === 'undefined') {
    const { writeFile } = await import('fs/promises');
    await writeFile(dbFilePath, data);
  } else {
    // If we are running in a browser environment
    window.localStorage.setItem('msw-db', data);
  }
};

export const persistDb = async (model: Model) => {
  if (process.env.NODE_ENV === 'test') return;
  const data = await loadDb();
  data[model] = db[model].getAll();
  await storeDb(JSON.stringify(data));
};

export const initializeDb = async () => {
  const database = await loadDb();
  Object.entries(db).forEach(([key, model]) => {
    const dataEntres = database[key];
    if (dataEntres) {
      dataEntres?.forEach((entry: Record<string, any>) => {
        model.create(entry);
      });
    }
  });
};

export const resetDb = () => {
  window.localStorage.clear();
};
