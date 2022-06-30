import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  SafeAreaView,
  Modal,
} from 'react-native';

import {updateItemInDb} from '../controllers/todoControllers';

const UpdateItem = props => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');

  // If cancelled we close the modal and epmty the textfields
  const handleCancelPress = () => {
    setText1('');
    setText2('');
    props.setModalVisible(false);
  };

  // If cancelled we close the modal, update the item in database and epmty the textfields
  const handleOKPress = () => {
    updateItemInDb(props.tablename, props.itemToUpdate.id, text1, text2);
    props.fetchData();
    setText1('');
    setText2('');
    props.setModalVisible(false);
  };

  // We set the textfields initial values to the itemToUpdate values. We set these conditionally using tertiary operator to check that the itemToUpdate is not null/undefined.
  useEffect(() => {
    setText1(props.itemToUpdate === undefined ? '' : props.itemToUpdate.item);
    setText2(props.itemToUpdate === undefined ? '' : props.itemToUpdate.notes);
  }, [props.itemToUpdate]);

  return (
    <Modal
      animationType="slide"
      visible={props.modalVisible}
      onRequestClose={() => {
        props.setModalVisible(false);
      }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            onChangeText={setText1}
            value={text1}
            placeholder="Item"
          />
          <TextInput
            style={styles.input}
            onChangeText={setText2}
            value={text2}
            placeholder="Notes"
          />
        </View>
        <View style={styles.buttonView}>
          <View style={styles.button}>
            <Button onPress={handleOKPress} title="OK" />
          </View>

          <View style={styles.button}>
            <Button onPress={handleCancelPress} title="Cancel" />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  inputView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '40%',
  },
  button: {
    height: 40,
    margin: 12,
    width: '40%',
  },
  text: {
    fontSize: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'red',
  },
});

export default UpdateItem;
