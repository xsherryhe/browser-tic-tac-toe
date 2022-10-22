const gameConditions = (function() {
  function win(marker, board) {
    const boardState = board.state;
    return _rowWin(marker, boardState) || _colWin(marker, boardState) || _diagWin(marker, boardState);
  }

  function tie(board) {
    return board.state.every(row => row.every(space => space));
  }

  function lose(marker, board) {
    const otherMarker = board.markers.find(otherMarker => otherMarker !== marker);
    return win(otherMarker, board);
  }

  function _rowWin(marker, boardState) {
    return boardState.some(row => row.every(space => _winningSpace(space, marker)));
  }

  function _colWin(marker, boardState) {
    return boardState.some((_, i) => boardState.every(row => _winningSpace(row[i], marker)));
  }

  function _diagWin(marker, boardState) {
    return boardState.every((row, i) => _winningSpace(row[i], marker)) ||
      boardState.every((row, i) => _winningSpace(row[2 - i], marker));
  }

  function _winningSpace(space, marker) {
    return space == marker;
  }

  return { win, tie, lose };
})()
