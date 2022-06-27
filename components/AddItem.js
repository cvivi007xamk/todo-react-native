import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  SafeAreaView,
  Modal,
} from 'react-native';

import {addItemToDb} from '../controllers/todoControllers';

const AddItem = props => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');

  const handleCancelPress = () => {
    setText1('');
    setText2('');
    props.setModalVisible(false);
  };
  const handleOKPress = () => {
    addItemToDb(props.tablename, text1, text2);
    props.fetchData();
    setText1('');
    setText2('');
    props.setModalVisible(false);
  };

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

export default AddItem;
