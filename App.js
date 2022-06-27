/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, createContext} from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import AddItem from './components/AddItem';
import UpdateItem from './components/UpdateItem';
import ItemScreen from './components/ItemScreen';
import ListScreen from './components/ListScreen';

import {init} from './database/db';

import {readAllLists} from './controllers/todoControllers';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
//const AppContext = React.createContext();

import AppContext from './components/AppContext';

init()
  .then(() => {
    console.log('Database creation succeeded!');
  })
  .catch(err => {
    console.log('Database IS NOT initialized! ' + err);
  });

const App = () => {
  const [allLists, setAllLists] = useState([{listname: 'Inbox', id: 1}]);

  const appContextValue = {
    allLists,
    setAllLists,
  };

  async function getData() {
    const data = await readAllLists();
    setAllLists(data);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <AppContext.Provider value={appContextValue}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="To Do">
          <Drawer.Screen
            //allLists={allLists}
            name="All Lists"
            component={ListScreen}
            //initialParams={{allLists: allLists}}
          />
          {allLists.map(list => (
            <Drawer.Screen
              key={list.id}
              name={list.listname}
              component={ItemScreen}
              //initialParams={{listId: list.id}}
            />
          ))}
        </Drawer.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
};

export default App;
