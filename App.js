/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';

//We use Drawer Navigation to navigate the UI
import {createDrawerNavigator} from '@react-navigation/drawer';

import ItemScreen from './components/ItemScreen';
import ListScreen from './components/ListScreen';

// This function initializes the database. We call it when the app starts
import {init} from './database/db';

import {readAllLists} from './controllers/todoControllers';

const Drawer = createDrawerNavigator();

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

  // We use context to pass the lists to the ListScreen (and any other component that needs it). Context is a React feature that allows us to pass data through the component tree without having to use props.
  const appContextValue = {
    allLists,
    setAllLists,
  };

  async function getData() {
    const data = await readAllLists();
    setAllLists(data);
  }

  // We call the getData function and set the list of lists when the component is mounted.
  useEffect(() => {
    getData();
  }, []);

  return (
    // AppContext is used to wrap the whole app and pass the list of lists to the ListScreen.
    <AppContext.Provider value={appContextValue}>
      {/* NavigationContainer is used to wrap the whole app showing the navigation drawer and chosen screen. */}
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="All Lists">
          <Drawer.Screen name="All Lists" component={ListScreen} />
          {/* We need to map the lists to the screens. We do this by using the name of the list as the name of the screen. We also render the same ItemScreen component but get the desired list in that component through the route.name property that is passed to every screen*/}
          {allLists.map(list => (
            <Drawer.Screen
              key={list.id}
              name={list.listname}
              component={ItemScreen}
            />
          ))}
        </Drawer.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
};

export default App;
