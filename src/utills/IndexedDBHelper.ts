class IndexedDBHelper {
  private dbName: string;
  private storeName: string;
  private version: number;
  private db: IDBDatabase | null;

  constructor(dbName: string, storeName: string, version = 1) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.version = version;
    this.db = null;
  }

  async init(): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const request = event.target as IDBOpenDBRequest;
        const db = request.result;

        if (!db.objectStoreNames.contains(this.storeName)) {
          // Object Store 생성
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('domainIndex', 'domain', { unique: false });
          console.log('Object store and domainIndex created');
        } else {
          // Object Store가 이미 있는 경우 인덱스 확인 및 추가
          const transaction = request.transaction as IDBTransaction;
          const store = transaction.objectStore(this.storeName);

          if (!store.indexNames.contains('domainIndex')) {
            store.createIndex('domainIndex', 'domain', { unique: false });
            console.log('domainIndex added to existing object store');
          }

          // 데이터 마이그레이션 필요 시 처리
          // 예: 기존 데이터에 새 속성을 추가하거나 초기화
          const cursorRequest = store.openCursor();
          cursorRequest.onsuccess = (e) => {
            const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
            if (cursor) {
              const value = cursor.value;
              if (!value.domain) {
                // 도메인 속성이 없는 경우 초기화
                value.domain = new URL(value.url).hostname;
                cursor.update(value);
              }
              cursor.continue();
            }
          };
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve('success');
      };

      request.onerror = (event) => {
        reject(`IndexedDB error: ${(event.target as IDBOpenDBRequest).error}`);
      };
    });
  }

  async add<T extends { id: string }>(data: T): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database is not initialized');

      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(data);

      request.onsuccess = () => resolve(request.result as string);
      request.onerror = () => reject(`Add failed: ${request.error}`);
    });
  }

  async put<T>(data: T & { id: number | string }): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database is not initialized');

      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result as number | string);
      request.onerror = () => reject(`Put failed: ${request.error}`);
    });
  }

  async get<T>(id: number | string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database is not initialized');

      const transaction = this.db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result as T | undefined);
      request.onerror = () => reject(`Get failed: ${request.error}`);
    });
  }

  async getAll<T>(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database is not initialized');

      const transaction = this.db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(`GetAll failed: ${request.error}`);
    });
  }

  async delete(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database is not initialized');

      const transaction = this.db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(`Delete failed: ${request.error}`);
    });
  }

  // New Method: Get all rows by domain
  async getByDomain<T>(domain: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database is not initialized');

      const transaction = this.db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('domainIndex'); // Use domainIndex for querying
      const range = IDBKeyRange.only(domain);

      const results: T[] = [];
      const request = index.openCursor(range);

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          results.push(cursor.value);
          cursor.continue(); // Move to the next record
        } else {
          resolve(results); // All matching rows fetched
        }
      };

      request.onerror = () => reject(`Failed to get by domain: ${request.error}`);
    });
  }
}
export default IndexedDBHelper;
