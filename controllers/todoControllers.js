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
// This file includes all the functions that are used to make the database calls. These functions call the functions in database/db.js fiile and return the results.

// Read all items from the database given a table name.
export const readAllItems = async tableName => {
  tableName = tableName.toLowerCase().trim().replace(/\s+/g, '_');
  try {
    const dbResult = await fetchAllItems(tableName);
    return dbResult;
  } catch (err) {
    console.log(err);
  }
};

// Read all lists from the database.
export const readAllLists = async () => {
  try {
    const dbResult = await fetchAllLists();

    return dbResult;
  } catch (err) {
    console.log(err);
  }
};

// Add an item to the database (give table name, item and notes for the item as parameters).
export const addItemToDb = async (tableName, item, notes) => {
  tableName = tableName.toLowerCase().trim().replace(/\s+/g, '_');
  try {
    await addItem(tableName, item, notes);
    return readAllItems(tableName);
  } catch (err) {
    console.log(err);
  }
};

// Delete an item from the database (give table name and item id as parameters).
export const deleteItemFromDb = async (tableName, id) => {
  tableName = tableName.toLowerCase().trim().replace(/\s+/g, '_');
  try {
    await deleteItem(tableName, id);
    return readAllItems(tableName);
  } catch (err) {
    console.log(err);
  }
};

// Update an item in the database (give table name, item id, item and notes as parameters).
export const updateItemInDb = async (tableName, id, item, notes) => {
  tableName = tableName.toLowerCase().trim().replace(/\s+/g, '_');
  try {
    await updateItem(tableName, id, item, notes);
    return readAllItems(tableName);
  } catch (err) {
    console.log(err);
  }
};

// Archive an item in the database (give table name and item id as parameters).
export const archiveItemInDb = async (tableName, id) => {
  tableName = tableName.toLowerCase().trim().replace(/\s+/g, '_');
  try {
    await archiveItem(tableName, id);
    return readAllItems(tableName);
  } catch (err) {
    console.log(err);
  }
};

// Delete multiple items from the database (give table name and item ids in an array as parameters).
export const deleteMultipleItems = (tableName, array) => {
  tableName = tableName.toLowerCase().trim().replace(/\s+/g, '_');
  array.forEach(id => {
    deleteItemFromDb(tableName, id);
  });
  return readAllItems(tableName);
};

// Add a list to the database (give list name as parameter). We also create a new table for the list.
export const addListToDb = async listname => {
  try {
    await addList(listname);
    await createTable(listname.toLowerCase().trim().replace(/\s+/g, '_'));
    return readAllLists();
  } catch (err) {
    console.log(err);
  }
};

// Delete a list from the database (give list id as parameter).
export const deleteListFromDb = async id => {
  try {
    await deleteList(id);
    return readAllLists();
  } catch (err) {
    console.log(err);
  }
};

// Update a list in the database (give list id and new list name as parameters).
export const updateListInDb = async (id, listname) => {
  try {
    await updateList(id, listname);
    return readAllLists();
  } catch (err) {
    console.log(err);
  }
};

// Update a table in the database (give table name and new table name as parameters).
export const updateTableInDb = async (tableName, newTableName) => {
  tableName = tableName.toLowerCase().trim().replace(/\s+/g, '_');
  newTableName = newTableName.toLowerCase().trim().replace(/\s+/g, '_');
  try {
    await updateTable(tableName, newTableName);
  } catch (err) {
    console.log(err);
  }
};
