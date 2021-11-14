import React, {useState, useEffect} from 'react';
import {
  Button,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import TitledContainer from './components/TitledContainer';
import Icon from 'react-native-vector-icons/FontAwesome';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [grid, setGrid] = useState([
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ]);
  const [generation, setGeneration] = useState(1);
  const [population, setPopulation] = useState(0);
  const [dimensions, setDimensions] = useState(3);
  const [MAX_GRID, MIN_GRID] = [10, 3];
  const [intervalId, setIntervalId] = useState(0);

  const [playing, setPlaying] = useState(false);

  let timer;

  useEffect(() => {
    changeGridSize();
    // return () => {};
  }, [dimensions]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playing) {
        nextGeneration();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [playing, grid]);

  const ripple = {
    color: 'blue',
    radius: 50,
    // foreground: true,
  };

  const actions = [
    {
      icon: 'repeat',
      fn: () => {
        setGeneration(1);
        setPopulation(0);
        newGrid();
      },
    },
    {icon: 'backward', fn: () => {}},
    {
      icon: playing ? 'pause' : 'play',
      fn: () => {
        // setPlaying(!playing);
        // if (playing) {
        //   timer = setInterval(() => {
        //     nextGeneration();
        //   }, 1000);
        // } else {
        //   clearInterval(timer);
        // }

        setPlaying(prevPlaying => !prevPlaying);

        // if (intervalId) {
        //   clearInterval(intervalId);
        //   setIntervalId(0);
        //   setPlaying(false);
        //   return;
        // }
        // setPlaying(true);
        // const newIntervalId = setInterval(() => {
        //   // setCount(prevCount => prevCount + 1);
        //   nextGeneration();
        // }, 1000);
        // setIntervalId(newIntervalId);
      },
    },
    {
      icon: 'forward',
      fn: () => {
        nextGeneration();
      },
    },
  ];

  const newGrid = () => {
    // make a square matrix with random numbers
    let grid = [];
    let newPopulation = 0;
    for (let i = 0; i < dimensions; i++) {
      let row = [];
      for (let j = 0; j < dimensions; j++) {
        let n = Math.floor(Math.random() * 2);
        row.push(n);
        if (n === 1) newPopulation++;
      }
      grid.push(row);
    }
    setPopulation(newPopulation);
    setGrid(grid);
  };

  useEffect(() => newGrid(), []);

  const changeGridSize = () => {
    if (MAX_GRID > dimensions && dimensions > grid.length) {
      // increase matrix dimensions by one

      let newGrid = grid.map(arr => arr.slice());
      newGrid.forEach(row =>
        row.push(...Array(dimensions - row.length).fill(0)),
      );

      for (let i = newGrid.length; i < dimensions; i++) {
        newGrid.push(Array(dimensions).fill(0));
      }

      // console.log(newGrid);

      setGrid(newGrid);
    } else if (MIN_GRID <= dimensions && dimensions < grid.length) {
      let newGrid = grid.map(arr => arr.slice());
      newGrid.forEach(row => (row.length = dimensions));
      newGrid.pop();

      setGrid(newGrid);
    }
    // console.log(newDimension);
  };

  const renderGrid = () =>
    grid.map((row, rowIndex) => (
      <View style={styles.gridRow} key={`row-${rowIndex}`}>
        {row.map((col, colIndex) => (
          <Pressable
            key={`btn-${rowIndex}-${colIndex}`}
            android_ripple={ripple}
            style={[
              styles.gridColumn,
              styles.center,
              col == 1 ? styles.alive : styles.dead,
            ]}
            onPress={() => {
              if (!playing) {
                let newGrid = [...grid];
                newGrid[rowIndex][colIndex] = col === 0 ? 1 : 0;
                setGrid(newGrid);
              }
            }}
            // onLongPress={() => console.log(getNeighbors(rowIndex, colIndex))}
          >
            {/* <Text>{col}</Text> */}
          </Pressable>
        ))}
      </View>
    ));

  const nextGeneration = () => {
    let newGrid = grid.map(arr => arr.slice());
    let newPopulation = 0;

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        let n = getNeighbors(i, j);
        let cell = grid[i][j];

        if (cell === 1 && (n === 2 || n === 3)) {
          newGrid[i][j] = 1;
          newPopulation++;
        } else {
          newGrid[i][j] = 0;
        }

        if (cell === 0 && n === 3) {
          newGrid[i][j] = 1;
          newPopulation++;
        }
      }
    }

    setGeneration(prevGen => prevGen + 1);
    setPopulation(newPopulation);
    setGrid(newGrid);
  };

  const getNeighbors = (i, j) => {
    // const neighbors = [];
    let neighbors = 0;

    let ren, col;
    for (ren = i - 1; ren <= i + 1; ren++) {
      for (col = j - 1; col <= j + 1; col++) {
        if (
          !(ren === i && col === j) &&
          ren >= 0 &&
          col >= 0 &&
          ren < grid.length &&
          col < grid.length
        ) {
          if (grid[ren][col] === 1) {
            neighbors++;
          }
        }
      }
    }
    return neighbors;
  };

  return (
    <SafeAreaView
      style={[
        styles.backgroundStyle,
        styles.center,
        {justifyContent: 'space-evenly'},
        {backgroundColor: isDarkMode ? '#222' : '#eee'},
      ]}>
      <Text
        style={{
          fontSize: 25,
          fontFamily: 'monospace',
          fontWeight: 'bold',
        }}>
        Conway's Game of Life
      </Text>

      <View style={{width: '80%'}}>{renderGrid()}</View>

      <View>
        <View
          style={{
            justifyContent: 'space-evenly',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={styles.info}>Generation: {generation}</Text>
          <Text style={styles.info}>Population: {population}</Text>
        </View>

        <View style={{justifyContent: 'space-evenly', flexDirection: 'column'}}>
          <View style={{flexDirection: 'row'}}>
            <TitledContainer title={'Grid size'}>
              <Pressable
                style={[styles.btn, styles.gridBtn]}
                onPress={() => {
                  if (dimensions < MAX_GRID && !playing)
                    setDimensions(dimensions + 1);
                }}
                android_ripple={ripple}>
                <Text style={[styles.btnText]}>+</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, styles.gridBtn]}
                onPress={() => {
                  if (dimensions >= MIN_GRID && !playing)
                    setDimensions(dimensions - 1);
                }}
                android_ripple={ripple}>
                <Text style={[styles.btnText]}>-</Text>
              </Pressable>
            </TitledContainer>

            <TitledContainer title={'Game'}>
              <Pressable
                style={[styles.btn, styles.gridBtn]}
                // onPress={() => {
                //   if (dimensions < MAX_GRID) setDimensions(dimensions + 1);
                // }}
                android_ripple={ripple}>
                <Text style={[styles.btnText]}>Save</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, styles.gridBtn]}
                // onPress={() => {
                //   if (dimensions >= MIN_GRID) setDimensions(dimensions - 1);
                // }}
                android_ripple={ripple}>
                <Text style={[styles.btnText]}>Load</Text>
              </Pressable>
            </TitledContainer>
          </View>
          <TitledContainer title="Generation">
            <View
              style={{
                // width: 200,
                justifyContent: 'space-evenly',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              {actions.map((action, index) => (
                <Pressable
                  key={`${action.icon}-${index}`}
                  style={[styles.btn]}
                  onPress={() => action.fn()}
                  android_ripple={ripple}>
                  <Icon name={action.icon} size={30} color="#ccc" />
                </Pressable>
              ))}
            </View>
          </TitledContainer>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundStyle: {
    // backgroundColor: isDarkMode ? '#000' : '#eee',
    height: '100%',
  },
  gridRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  gridColumn: {
    // width: 50,
    // width: '20%',
    flex: 1,
    aspectRatio: 1,
    borderWidth: 1,
  },
  btn: {
    // backgroundColor: 'blue',
    // flex: 1,}
    // aspectRatio: 1,
    // minWidth: 50,
    padding: 20,
    backgroundColor: '#111',
    margin: 5,
    elevation: 5,
  },
  btnText: {
    fontSize: 20,
  },
  info: {fontSize: 18},
  // gridBtn: {aspectRatio: 1, width: 30},
  alive: {backgroundColor: 'green'},
  dead: {backgroundColor: 'red'},
});

export default App;
