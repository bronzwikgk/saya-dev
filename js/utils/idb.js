class BlockedIndefinitelyError extends Error {
  constructor(message = "Database open was blocked") {
    super(message);
  }
}

class IndexedDB {
  static async getDatabaseVersion(name) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(name);
      request.onsuccess = (event) => {
        let version = event.target.result.version;
        const database = event.target.result;
        database.close();
        resolve(version);
      };
      request.onerror = (event) => reject(event.target.error);
      request.onblocked = (event) => reject(new BlockedIndefinitelyError());
    });
  }

  static async Open(name, stores, options = {}) {
    let version = await this.getDatabaseVersion(name);
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(name, version + 1);
      request.onupgradeneeded = (event) => {
        stores.forEach((store) => {
          if (!event.target.result.objectStoreNames.contains(store)) {
            event.target.result.createObjectStore(store, {
              keyPath: "entityId",
            });
          }
        });
      };
      request.onerror = (event) => reject(event.target.error);
      request.onsuccess = (event) => {
        const database = event.target.result;
        if (options.closeOnUpgrade) {
          database.close();
        }
        resolve(event.target.result);
      };
      request.onblocked = (event) => {
        reject(new BlockedIndefinitelyError());
      };
    });
  }

  static async Create(name, store, data, options = {}) {
    let version = await this.getDatabaseVersion(name);
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(name, version + 1);
      request.onupgradeneeded = (event) => { };
      request.onerror = (event) => reject(event.target.error);
      request.onsuccess = (event) => {
        const db = event.target.result;
        let transaction = db.transaction(store, "readwrite");
        let objectStore = transaction.objectStore(store);
        let addRequest = objectStore.add(data);

        // Capture the success of the add operation
        addRequest.onsuccess = (e) => {
          const id = e.target.result; // This is the ID of the recently added item
          // Fetch the added item using the ID
          let getRequest = objectStore.get(id);
          getRequest.onsuccess = () => {
            db.close();
            resolve(getRequest.result); // resolve with the added item
          };

          getRequest.onerror = () => {
            reject("Error fetching the added item");
          };
        };


      };
      request.onblocked = (event) => {
        console.log(event);
        reject(new BlockedIndefinitelyError());
      };
    });
  }

  static async IsStoreEmpty(databaseName, storeName) {
    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open(databaseName);

      openRequest.onerror = (event) => {
        reject("Error opening database:", event.target.error);
      };

      openRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(storeName, "readonly");
        const objectStore = transaction.objectStore(storeName);
        const countRequest = objectStore.count();

        countRequest.onerror = (event) => {
          reject("Error counting records:", event.target.error);
        };

        countRequest.onsuccess = (event) => {
          resolve(countRequest.result === 0);  // true if empty, false otherwise
        };
      };
    });
  }

  static async BulkCreate(name, store, dataList, options = {}) {
    let version = await this.getDatabaseVersion(name);
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(name, version + 1);
        request.onupgradeneeded = (event) => {};
        request.onerror = (event) => reject(event.target.error);
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(store, "readwrite");
            const objectStore = transaction.objectStore(store);
            let ids = [];
            console.log(dataList);
            for (let data of dataList) {
                let addRequest = objectStore.add(data);
                addRequest.onsuccess = (e) => {
                    ids.push(e.target.result);
                };
                addRequest.onerror = (e) => {
                    reject("Error while adding an item: " + e.target.error);
                    return;  // exit the loop if there's an error
                };
            }

            transaction.oncomplete = () => {
                db.close();
                resolve(ids);  // return all IDs of the items that were inserted
            };

            transaction.onerror = () => {
                reject("Transaction error while adding items");
            };
        };
        request.onblocked = (event) => {
            console.log(event);
            reject(new BlockedIndefinitelyError());
        };
    });
}

static async Transaction(dbName, storeNames, mode, callback) {
  let version = await this.getDatabaseVersion(dbName);
  return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, version + 1);

      request.onsuccess = function(event) {
          const db = event.target.result;
          const transaction = db.transaction(storeNames, mode);

          try {
              callback(transaction);
              transaction.oncomplete = () => {
                  db.close();
                  resolve();
              };
          } catch(err) {
              reject(err);
          }

          transaction.onerror = (e) => {
              reject("Transaction error: " + e.target.error);
          };
      };

      request.onerror = (e) => {
          reject("DB Open error: " + e.target.error);
      };
  });
}


  static async OpenClose(dbName, name) {
    let version = await this.getDatabaseVersion(dbName);
    return new Promise((resolve, reject) => {
      let request = indexedDB.open(dbName, version + 1);
      request.onsuccess = (e) => {
        let res = e.target.result;
        res.close();
        resolve();
      };
      request.onerror = (e) => {
        reject("error");
      };
    });
  }

  static async GetAll(dbName, storeName) {
    let version = await this.getDatabaseVersion(dbName);
    return new Promise((resolve, reject) => {
      let request = indexedDB.open(dbName, version + 1);
      request.onsuccess = (e) => {
        let res = e.target.result;
        let trans = res.transaction(storeName, "readonly");
        let objStore = trans.objectStore(storeName);
        let items = objStore.getAll();
        items.onsuccess = (e) => {
          resolve(items.result);
          res.close();
        };
        res.close();
      };
      request.onerror = (e) => {
        reject("error");
      };
    });
  }

  static async GetByID(dbName, storeName, id) {
    let version = await this.getDatabaseVersion(dbName);
    return new Promise((resolve, reject) => {
      let request = indexedDB.open(dbName, version + 1);
      request.onsuccess = (e) => {
        let res = e.target.result;
        let trans = res.transaction(storeName, "readonly");
        let objStore = trans.objectStore(storeName);
        let gotElim = objStore.get(id);
        gotElim.onsuccess = (e) => {
          res.close();
          resolve(e.target.result);
        };
      };
      request.onerror = (e) => {
        reject("error");
      };
    });
  }

  static async Update(dbName, storeName, data) {
    let version = await this.getDatabaseVersion(dbName);
    let request = indexedDB.open(dbName, version + 1);
    request.onsuccess = (e) => {
      let res = e.target.result;
      let trans = res.transaction(storeName, "readwrite");
      trans.objectStore(storeName).put(data);
      res.close();
    };
    request.onerror = (e) => { };
  }

  static async DeleteById(dbName, storeName, id) {
    let version = await this.getDatabaseVersion(dbName);
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, version + 1);
      request.onsuccess = async function (event) {
        const db = event.target.result;
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        await store.delete(id);
        db.close();
        resolve();
      };
      request.onerror = function (event) {
        reject(event.target.error);
      };
    });
  }

  static async DeleteRecurse(dbName, storeName, id) {
    let version = await this.getDatabaseVersion(dbName);
    let request = indexedDB.open(dbName, version + 1);
    request.onsuccess = async (e) => {
      let data = await this.GetAll(dbName, storeName);
      let children = data.filter(function (object) {
        return +object.parentId === id;
      });
      let res = request.result;
      let trans = res.transaction(storeName, "readwrite");
      trans.objectStore(storeName).delete(id);
      res.close();
      children.forEach(async (child) => {
        await this.DeleteRecurse(dbName, storeName, child.id);
      });
    };
    request.onerror = (e) => { };
  }

  static async DeleteStore(dbName, storeName) {
    let version = await this.getDatabaseVersion(dbName);
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, version + 1);
      request.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (db.objectStoreNames.contains(storeName)) {
          db.deleteObjectStore(storeName);
        }
        db.close();
        resolve();
      };
      request.onsuccess = function (event) {
        resolve();
      };
      request.onerror = function (event) {
        reject(event.target.error);
      };
      request.onblocked = (event) => {
        console.log(event);
        reject(new BlockedIndefinitelyError());
      };
    });
  }

  static async ClearStore(dbName, storeName) {
    let version = await this.getDatabaseVersion(dbName);
    let request = indexedDB.open(dbName, version);
    request.onsuccess = (e) => {
      let res = e.target.result;
      let trans = res.transaction(storeName, "readwrite");
      trans.objectStore(storeName).clear();
      res.close();
    };
    request.onerror = (e) => { };
  }

  static async DeleteDB(name) {
    if (window.indexedDB) {
      window.indexedDB.deleteDatabase(name);
    }
  }
}

export { IndexedDB };
