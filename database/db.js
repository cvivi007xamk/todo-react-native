import {openDatabase} from 'react-native-sqlite-storage';

export const getDBConnection = async () => {
  return openDatabase({name: 'todo.db', location: 'default'});
};
var db = openDatabase({name: 'todo.db', location: 'default'});

export const init = () => {
  console.log('Initializing database...');
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      //tx.executeSql('DROP TABLE IF EXISTS tablename', []); //uncomment this if needed - sometimes it is good to empty the table

      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS lists (id INTEGER PRIMARY KEY AUTOINCREMENT, listname TEXT NOT NULL)',
        [], //no params
        () => {
          resolve(); //There is no need to return anything
        },
        //If the transaction fails, this is called
        (_, err) => {
          reject(err);
        },
      );
    });
  });
  return promise;
};

export const createTable = tableName => {
  console.log('Creating table...');
  const table = tableName.toString();

  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS ' +
          table +
          ' (id INTEGER PRIMARY KEY AUTOINCREMENT, item TEXT NOT NULL, notes TEXT NOT NULL, archived INTEGER DEFAULT 0 NOT NULL)',
        [], //no params
        () => {
          resolve(); //There is no need to return anything
        },
        //If the transaction fails, this is called
        (_, err) => {
          reject(err);
        },
      );
    });
  });
  return promise;
};
export const updateTable = (tableName, newTableName) => {
  console.log('Creating table...');
  const table = tableName.toString();
  const newTable = newTableName.toString();

  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'ALTER TABLE ' + table + ' RENAME TO ' + newTable,
        [], //no params
        () => {
          resolve(); //There is no need to return anything
        },
        //If the transaction fails, this is called
        (_, err) => {
          reject(err);
        },
      );
    });
  });
  return promise;
};

export const addItem = (tableName, item, notes) => {
  const table = tableName.toString();
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO ' + table + ' (item, notes, archived) values(?,?,?);',
        [item, notes, 0],
        () => {
          resolve();
        },
        (_, err) => {
          reject(err);
        },
      );
    });
  });
  return promise;
};

export const fetchAllItems = tableName => {
  const table = tableName.toString();
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM ' + table + ' WHERE archived = 0;',
        [],
        (txn, result) => {
          resolve(result.rows.raw()); //The data the Promise will have when returned
        },
        (txn, err) => {
          reject(err);
        },
      );
    });
  });
  return promise;
};

export const fetchArchivedItems = tableName => {
  const table = tableName.toString();
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM ' + table + ' WHERE archived = 1;',
        [],
        (txn, result) => {
          resolve(result.rows.raw()); //The data the Promise will have when returned
        },
        (txn, err) => {
          reject(err);
        },
      );
    });
  });
  return promise;
};

export const updateItem = (tableName, id, item, notes) => {
  console.log(
    '🚀 ~ file: db.js ~ line 112 ~ updateItem ~ tableName, id, item, notes',
    tableName,
    id,
    item,
    notes,
  );
  const table = tableName.toString();
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE ' + table + ' SET item=?, notes=? WHERE id=?',
        [item, notes, id],

        () => {
          resolve();
        },

        (_, err) => {
          reject(err);
        },
      );
    });
  });
  return promise;
};

export const archiveItem = (tableName, id) => {
  const table = tableName.toString();
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE ' + table + ' SET archived=1 WHERE id=?',
        [id],

        () => {
          resolve();
        },

        (_, err) => {
          reject(err);
        },
      );
    });
  });
  return promise;
};

export const deleteItem = (tableName, id) => {
  const table = tableName.toString();
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'delete from ' + table + ' where id=?;',
        [id],
        () => {
          resolve();
        },
        (_, err) => {
          reject(err);
        },
      );
    });
  });
  return promise;
};

export const addList = listName => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO lists (listname) values(?);',
        [listName],
        () => {
          resolve();
        },
        (_, err) => {
          reject(err);
        },
      );
    });
  });
  return promise;
};

export const fetchAllLists = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM lists;',
        [],
        (txn, result) => {
          resolve(result.rows.raw()); //The data the Promise will have when returned
        },
        (txn, err) => {
          reject(err);
        },
      );
    });
  });
  return promise;
};

export const updateList = (id, listname) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE lists SET listname=? WHERE id=?',
        [listname, id],

        () => {
          resolve();
        },

        (_, err) => {
          reject(err);
        },
      );
    });
  });
  return promise;
};

export const deleteList = id => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM lists WHERE id=?;',
        [id],
        () => {
          resolve();
        },
        (_, err) => {
          reject(err);
        },
      );
    });
  });
  return promise;
};
