function Board() {
  const state = [...new Array(3)].map(_ => (new Array(3)).fill(null));

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

  return { state, getSquare, setSquare };
}
