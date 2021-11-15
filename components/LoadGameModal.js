import Modal from 'react-native-modal';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

import Storage from './Storage';

const games = Array(15).fill({
  id: 1,
  time: new Date(),
  generation: 100,
  population: 10,
});

const ripple = {
  color: 'lightgray',
  // radius: 50,
  // foreground: true,
};

const parseDate = dateString => {
  const b = dateString.split(/\D+/);
  const offsetMult = dateString.indexOf('+') !== -1 ? -1 : 1;
  const hrOffset = offsetMult * (+b[7] || 0);
  const minOffset = offsetMult * (+b[8] || 0);
  return new Date(
    Date.UTC(
      +b[0],
      +b[1] - 1,
      +b[2],
      +b[3] + hrOffset,
      +b[4] + minOffset,
      +b[5],
      +b[6] || 0,
    ),
  );
};

const LoadGameModal = props => {
  const [saves, setSaves] = useState(null);

  const getSaves = async () => {
    await Storage.getAllDataForKey('game').then(games => {
      console.log(games);
      setSaves(
        games.map((game, i) => (
          // <Text>{`${game}`}</Text>
          <Pressable
            key={`game-${i + 1}`}
            style={styles.game}
            onPress={() => {
              Storage.load({key: 'game', id: i}).then(game => {
                props.loadGame(Object.assign({}, game));
              });
            }}
            android_ripple={ripple}>
            <Text style={styles.text}>{`#${i + 1} | ${parseDate(
              game.time,
            ).toLocaleString()}`}</Text>
            <View
              style={{justifyContent: 'space-between', flexDirection: 'row'}}>
              <Text style={styles.subtext}>{`Gen: ${game.generation}`}</Text>
              <Text style={styles.subtext}>{`Pop: ${game.population}`}</Text>
            </View>
          </Pressable>
        )),
      );
    });
  };
  useEffect(() => {
    getSaves();
  }, [props.isVisible]);

  return (
    <Modal
      isVisible={props.isVisible}
      // onBackButtonPress={() => setShowModal(false)}
      onBackButtonPress={() => props.onCancel()}
      onBackdropPress={() => props.onCancel()}
      useNativeDriver
      useNativeDriverForBackdrop
      propagateSwipe>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: 30}}
        scrollEnabled
        scrollsToTop>
        <Text style={[styles.text, styles.title]}>Saved games</Text>
        <View style={{marginTop: 10}}>{saves}</View>
        <Pressable
          onPress={() => {
            Alert.alert(
              'Confirm reset',
              'This will delete all current saved games',
              [
                {
                  text: 'Confirm',
                  onPress: () => {
                    setSaves(null);
                    Storage.clearMapForKey('game');
                    getSaves();
                  },
                },
                {text: 'Cancel', onPress: () => {}},
              ],
            );
          }}
          android_ripple={ripple}
          style={styles.delete}>
          <Text style={styles.deleteText}>Clear saves</Text>
        </Pressable>
      </ScrollView>
    </Modal>
  );
};

// make stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    borderBottomWidth: 1,
    padding: 10,
    textAlign: 'center',
  },
  text: {
    color: 'black',
    // borderBottomWidth: 1,
  },
  subtext: {
    color: '#666',
    fontSize: 14,
  },
  game: {
    // marginTop: 15,
    padding: 15,
  },
  delete: {backgroundColor: 'red', marginTop: 10, borderRadius: 10},
  deleteText: {
    padding: 10,
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default LoadGameModal;
