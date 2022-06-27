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
import {useFocusEffect} from '@react-navigation/native';

import AddItem from './AddItem';
import UpdateItem from './UpdateItem';

import {
  readAllItems,
  deleteItemFromDb,
  archiveItemInDb,
  deleteMultipleItems,
} from '../controllers/todoControllers';

import {GestureHandlerRootView} from 'react-native-gesture-handler';

import Swipeable from 'react-native-gesture-handler/Swipeable';

const ItemScreen = ({navigation, route}) => {
  const [itemList, setItemList] = useState([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState();
  const [selectedItems, setSelectedItems] = useState([]);

  async function fetchData() {
    const items = await readAllItems(route.name);
    setItemList(items);
  }

  const toggleSwitch = id => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const onPressFunction = id => {
    setItemToUpdate(itemList.find(item => item.id === id));
    setUpdateModalVisible(true);
  };

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

  const renderItem = ({item}) => (
    <Swipeable
      renderRightActions={RightActions}
      onSwipeableRightOpen={() => deleteItemFromDb(item.id)}>
      <View style={{flexDirection: 'row'}}>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={selectedItems.includes(item.id) ? '#2196f3' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => toggleSwitch(item.id)}
          value={selectedItems.includes(item.id)}
          style={{marginHorizontal: 10}}
        />
        <Pressable
          style={{
            flex: 1,
            padding: 10,
          }}
          onPress={() => onPressFunction(item.id)}
          onLongPress={() => openAlertDialog(item.id)}>
          <Text
            style={{
              fontSize: 20,
              marginHorizontal: 10,
              color: '#000',
            }}>
            {item.item}
          </Text>
          <Text
            style={{
              fontSize: 15,
              marginHorizontal: 10,
            }}>
            {item.notes}
          </Text>
        </Pressable>
      </View>
    </Swipeable>
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

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route.name]),
  );
  // useEffect(() => {
  //   setItemList(readAllItems(route.name));
  // }, [route.name]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView style={styles.container}>
        <AddItem
          modalVisible={addModalVisible}
          setModalVisible={setAddModalVisible}
          tablename={route.name}
          fetchData={fetchData}
        />
        <UpdateItem
          modalVisible={updateModalVisible}
          setModalVisible={setUpdateModalVisible}
          itemToUpdate={itemToUpdate}
          tablename={route.name}
          fetchData={fetchData}
        />

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
