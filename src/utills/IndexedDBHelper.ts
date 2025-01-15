class IndexedDBHelper {
  private dbName: string;
  private storeName: string;
  private db: IDBDatabase | null;

  constructor(dbName: string, storeName: string) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.db = null;
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = (event) => {
        reject(`IndexedDB error: ${(event.target as IDBOpenDBRequest).error}`);
      };
    });
  }

  async add<T extends { id: string }>(data: T): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database is not initialized');

      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(data);

      request.onsuccess = () => resolve(request.result as string);
      request.onerror = () => reject(`Add failed: ${request.error}`);
    });
  }

  async put<T>(data: T & { id: number | string }): Promise<number | string> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database is not initialized');

      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result as number | string);
      request.onerror = () => reject(`Put failed: ${request.error}`);
    });
  }

  async get<T>(id: number | string): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database is not initialized');

      const transaction = this.db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result as T | undefined);
      request.onerror = () => reject(`Get failed: ${request.error}`);
    });
  }

  async getAll<T>(): Promise<T[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database is not initialized');

      const transaction = this.db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(`GetAll failed: ${request.error}`);
    });
  }

  async delete(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database is not initialized');

      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(`Delete failed: ${request.error}`);
    });
  }
}
export default IndexedDBHelper;
