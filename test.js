let grid = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

const changeGridSize = newDimension => {
  let newGrid = grid.map(arr => arr.slice());
  if (newDimension > grid.length) {
    newGrid.forEach(row =>
      row.push(...Array(newDimension - row.length).fill(0)),
    );

    for (let i = newGrid.length; i < newDimension; i++) {
      newGrid.push(Array(newDimension).fill(0));
    }

    grid = newGrid;

    // setGrid(newGrid);
  } else {
    newGrid.forEach(row => (row.length = newDimension));
    newGrid.pop();

    grid = newGrid;
  }
  console.log(newDimension);
};

changeGridSize(2);
console.log(grid);
