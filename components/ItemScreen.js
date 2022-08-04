/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Button,
  SafeAreaView,
  Text,
  FlatList,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import {List, Checkbox} from 'react-native-paper';

// useFocusEffect is used to listen to the route changes. When the route changes, the fetchData function is called with the given route as its parameter (That way we get the right lists data only).
import {useFocusEffect} from '@react-navigation/native';

import AddItem from './AddItem';
import UpdateItem from './UpdateItem';

import {
  readAllItems,
  deleteItemFromDb,
  archiveItemInDb,
  deleteMultipleItems,
} from '../controllers/todoControllers';

import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler'; // We use react-native-gesture-handler npm package to create the Swipeable elements on FlatList.

const ItemScreen = ({route}) => {
  const [itemList, setItemList] = useState([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState();
  const [selectedItems, setSelectedItems] = useState([]);

  // This function is called whenever the route changes and whenever the list of items is updated. We use it to fetch the data from the database. And pass as a parameter the route name to only get this lists data
  async function fetchData() {
    const items = await readAllItems(route.name);
    setItemList(items);
  }

  // When cliciking the switch on each item it is either added or deleted from the selectedItems array.
  const toggleSwitch = id => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // On pressing the list item we set the item we want to update and open the modal.
  const onPressFunction = id => {
    setItemToUpdate(itemList.find(item => item.id === id));
    setUpdateModalVisible(true);
  };

  // Long pressing the list item opens an alert dialog where the user can choose to delete the item or archive it.
  const openAlertDialog = id =>
    Alert.alert('Delete item', 'Are you sure?', [
      {
        text: 'Archive',
        onPress: () => {
          archiveItemInDb(route.name, id);
          fetchData();
        },
      },
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          deleteItemFromDb(route.name, id);
          fetchData();
        },
      },
    ]);

  // When swiping the list item this components is shown
  const RightActions = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}>
        <Text
          style={{
            color: 'white',
            paddingHorizontal: 5,
            fontSize: 14,
          }}>
          Swipe to delete
        </Text>
      </View>
    );
  };

  // This is a component that shows each item that is rendered in the FlatList.
  const renderItem = ({item}) => (
    <Swipeable
      renderRightActions={RightActions}
      // When swiping the list item this it gets deleted from the database.
      onSwipeableRightOpen={() => {
        deleteItemFromDb(route.name, item.id);
        fetchData();
      }}>
      <View style={{flexDirection: 'row'}}>
        {/*  We use the Pressable componnet to make the list item clickable. */}
        <Pressable
          style={{
            flex: 1,
          }}
          onPress={() => onPressFunction(item.id)}
          onLongPress={() => openAlertDialog(item.id)}>
          <List.Item
            title={item.item}
            description={item.notes}
            left={props => (
              <Checkbox
                status={
                  selectedItems.includes(item.id) ? 'checked' : 'unchecked'
                }
                onPress={() => {
                  toggleSwitch(item.id);
                }}
              />
            )}
          />
        </Pressable>
      </View>
    </Swipeable>
  );

  // A list itemseparator component (just a line)
  const Separator = () => <View style={styles.itemSeparator} />;

  // This component is shown when the list is empty
  const ListEmptyComponent = () => (
    <Text
      style={{
        fontSize: 25,
        marginHorizontal: 10,
      }}>
      List is empty. Add items to list.
    </Text>
  );

  // The useFocusEffect is called whenever the route changes.
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route.name]),
  );

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView style={styles.container}>
        {/* AddItem is a modal that is shown when new item is added. We pass the table name, modal visibility (and setter) and list update function fetchData as props*/}
        <AddItem
          modalVisible={addModalVisible}
          setModalVisible={setAddModalVisible}
          tablename={route.name}
          fetchData={fetchData}
        />
        {/* UpdateItem is a modal that is shown when an item is updated. We pass the table name, modal visibility (and setter), list update function fetchData and item which is to be updated as props */}
        <UpdateItem
          modalVisible={updateModalVisible}
          setModalVisible={setUpdateModalVisible}
          itemToUpdate={itemToUpdate}
          tablename={route.name}
          fetchData={fetchData}
        />
        {/* FlatList uses the data source (ItemList) to render the list. */}
        <FlatList
          data={itemList}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ListEmptyComponent={() => <ListEmptyComponent />}
          ItemSeparatorComponent={() => <Separator />}
          ListFooterComponent={() => <Separator />}
        />
        <View style={styles.button}>
          <Button
            onPress={() => {
              deleteMultipleItems(route.name, selectedItems);
              fetchData();
            }}
            title="Delete selected items"
          />
        </View>
        <View style={styles.button}>
          <Button onPress={() => setAddModalVisible(true)} title="Add Item" />
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
});

export default ItemScreen;
