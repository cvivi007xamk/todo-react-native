/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Button,
  SafeAreaView,
  Text,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';

import Dialog from 'react-native-dialog';

import {
  readAllLists,
  addListToDb,
  deleteListFromDb,
  updateListInDb,
  updateTableInDb,
} from '../controllers/todoControllers';

import AppContext from './AppContext';

import {GestureHandlerRootView} from 'react-native-gesture-handler';

const ListScreen = ({route, navigation}) => {
  const [listName, setListName] = useState('');
  const [newListName, setNewListName] = useState('');

  const [listToUpdate, setListToUpdate] = useState({});
  const [visible, setVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);

  async function getData() {
    const data = await readAllLists();
    context.setAllLists(data);
  }

  const onPressFunction = (id, listname) => {
    navigation.navigate(listname, {
      list: context.allLists.find(item => item.id === id),
    });
  };

  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };
  const handleUpdateCancel = () => {
    setUpdateVisible(false);
  };

  const handleCreate = () => {
    addListToDb(listName);
    getData();
    setVisible(false);
    setListName('');
  };
  const handleRename = list => {
    updateListInDb(list.id, newListName);
    updateTableInDb(listToUpdate.listname, newListName);
    getData();
    setUpdateVisible(false);
    setNewListName('');
  };
  const handleDelete = id => {
    deleteListFromDb(id);
    getData();
    setUpdateVisible(false);
  };

  const context = useContext(AppContext);

  const openAlertDialog = (id, listname) => {
    setListToUpdate(context.allLists.find(item => item.id === id));
    Alert.alert(
      `Delete or rename ${listname}`,
      'Do you want to delete or rename this list?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Rename',
          onPress: () => {
            console.log('Rename Pressed, listToUpdate: ', listToUpdate);
            setUpdateVisible(true);
          },
        },
        {
          text: 'Delete',
          onPress: () => {
            handleDelete(id);
          },
        },
      ],
    );
  };

  const renderItem = ({item}) => (
    <View style={{flexDirection: 'row'}}>
      <Pressable
        style={{
          flex: 1,
          padding: 10,
        }}
        onPress={() => onPressFunction(item.id, item.listname)}
        onLongPress={() => openAlertDialog(item.id, item.listname)}>
        <Text
          style={{
            fontSize: 20,
            marginHorizontal: 10,
          }}>
          {item.listname}
        </Text>
      </Pressable>
    </View>
  );

  const Separator = () => <View style={styles.itemSeparator} />;
  const ListEmptyComponent = () => (
    <Text
      style={{
        fontSize: 25,
        marginHorizontal: 10,
      }}>
      List is empty. Add items to list.
    </Text>
  );

  useEffect(() => {
    getData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView style={styles.container}>
        <Dialog.Container visible={visible}>
          <Dialog.Title>Create new list</Dialog.Title>
          <Dialog.Description>Enter a name for the new list</Dialog.Description>
          <Dialog.Input
            onChangeText={setListName}
            value={listName}
            placeholder="List name"
          />
          <Dialog.Button label="Cancel" onPress={handleCancel} />
          <Dialog.Button label="Create" onPress={handleCreate} />
        </Dialog.Container>

        <Dialog.Container visible={updateVisible}>
          <Dialog.Title>Rename list</Dialog.Title>
          <Dialog.Description>Enter a new list name</Dialog.Description>
          <Dialog.Input
            onChangeText={setNewListName}
            value={newListName}
            placeholder={listToUpdate.listname}
          />
          <Dialog.Button label="Cancel" onPress={handleUpdateCancel} />
          <Dialog.Button
            label="Rename"
            onPress={() => handleRename(listToUpdate)}
          />
        </Dialog.Container>

        <FlatList
          data={context.allLists}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ListEmptyComponent={() => <ListEmptyComponent />}
          ItemSeparatorComponent={() => <Separator />}
          ListFooterComponent={() => <Separator />}
        />

        <View style={styles.button}>
          <Button onPress={showDialog} title="Create new list" />
        </View>

        <View style={styles.button}>
          <Button
            onPress={() => {
              console.log('context: ', context.allLists);
            }}
            title="Console log lists"
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  button: {
    height: 40,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    margin: 5,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginVertical: 10,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: '#444',
  },
  dialog: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ListScreen;
