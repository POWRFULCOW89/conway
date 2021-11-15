import React from 'react';
import {StyleSheet, View, Text, useColorScheme} from 'react-native';

const TitledContainer = props => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.container}>
      <Text
        style={[styles.title, {backgroundColor: isDarkMode ? '#222' : '#eee'}]}>
        {props.title}
      </Text>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',

    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12.5,
    padding: 10,

    margin: 10,
    marginTop: 20,
    zIndex: 1,
  },
  title: {
    position: 'absolute',
    top: -12.5,
    left: 10, // TODO: change to onlayout
    // backgroundColor: '#333',
    zIndex: 5,
  },
});

export default TitledContainer;
