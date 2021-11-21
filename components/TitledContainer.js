import React from 'react';
import {StyleSheet, View, Text, useColorScheme} from 'react-native';
import Theme from './Theme.js';

const TitledContainer = props => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? Theme.dark.backgroundColor
            : Theme.light.backgroundColor,
          borderColor: isDarkMode
            ? Theme.dark.textColor
            : Theme.light.textColor,
        },
      ]}>
      <Text
        style={[
          styles.title,
          {
            backgroundColor: isDarkMode
              ? Theme.dark.backgroundColor
              : Theme.light.backgroundColor,
            color: isDarkMode ? Theme.dark.textColor : Theme.light.textColor,
          },
        ]}>
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
    // borderColor: '#ccc',
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
