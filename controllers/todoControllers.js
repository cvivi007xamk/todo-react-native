import {
  addItem,
  updateItem,
  archiveItem,
  deleteItem,
  fetchAllItems,
  fetchAllLists,
  addList,
  updateList,
  deleteList,
  createTable,
  updateTable,
} from '../database/db';

export const readAllItems = async tableName => {
  try {
    const dbResult = await fetchAllItems(tableName);
    console.log('🚀 ~ file: todoControllers.js ~ line 18 ~ dbResult', dbResult);

    return dbResult;
  } catch (err) {
    console.log('🚀 ~ file: todoControllers.js ~ line 30 ~ err', err);
  }
};

export const readAllLists = async () => {
  try {
    const dbResult = await fetchAllLists();
    //setShoppingList(dbResult);
    //const archivedItems = await fetchArchivedItems();

    console.log(
      '🚀 ~ file: todoControllers.js ~ line 37 ~ readAllLists ~ dbResult',
      JSON.stringify(dbResult),
    );
    return dbResult;
  } catch (err) {
    console.log(
      '🚀 ~ file: todoControllers.js ~ line 46 ~ readAllLists ~ err',
      err,
    );
  }
};

export const addItemToDb = async (tableName, item, notes) => {
  try {
    await addItem(tableName, item, notes);
    return readAllItems(tableName);
  } catch (err) {
    console.log(err);
  }
};
export const deleteItemFromDb = async (tableName, id) => {
  try {
    await deleteItem(tableName, id);
    return readAllItems(tableName);
  } catch (err) {
    console.log(err);
  }
};
export const updateItemInDb = async (tableName, id, item, notes) => {
  try {
    await updateItem(tableName, id, item, notes);
    return readAllItems(tableName);
  } catch (err) {
    console.log(err);
  }
};

export const archiveItemInDb = async (tableName, id) => {
  try {
    await archiveItem(tableName, id);
    return readAllItems(tableName);
  } catch (err) {
    console.log(err);
  }
};

export const deleteMultipleItems = (tableName, array) => {
  array.forEach(id => {
    deleteItemFromDb(tableName, id);
  });
  return readAllItems(tableName);
};

export const addListToDb = async listname => {
  try {
    await addList(listname);
    await createTable(listname);
    return readAllLists();
  } catch (err) {
    console.log(err);
  }
};
export const deleteListFromDb = async id => {
  try {
    await deleteList(id);
    return readAllLists();
  } catch (err) {
    console.log(err);
  }
};
export const updateListInDb = async (id, listname) => {
  try {
    await updateList(id, listname);
    return readAllLists();
  } catch (err) {
    console.log(err);
  }
};

export const updateTableInDb = async (tableName, newTableName) => {
  try {
    await updateTable(tableName, newTableName);
  } catch (err) {
    console.log(err);
  }
};
