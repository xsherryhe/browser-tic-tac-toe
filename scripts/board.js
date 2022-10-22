function Board(markers = ['X', 'O'], state) {
  state ||= [...new Array(3)].map(_ => (new Array(3)).fill(null));

  function getSquare(index) {
    return state[Math.floor(index / 3)][index % 3];
  }

  function setSquare(index, marker) {
    if (this.getSquare(index)) {
      display.renderSquareTakenMessage();
      return false;
    }

    state[Math.floor(index / 3)][index % 3] = marker;
    return true;
  }

  function availableIndexes() {
    return state.reduce((indexes, row, i) => {
      row.forEach((square, j) => {
        if (!square) indexes.push(i * 3 + j);
      })
      return indexes;
    }, [])
  }

  return { markers, state, getSquare, setSquare, availableIndexes };
}
