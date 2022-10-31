function Player(marker) {
  function autoSelectSquare(board) {
    const indexes = board.availableIndexes();
    return indexes[Math.floor(Math.random() * indexes.length)];
  }

  return { marker, autoSelectSquare };
}

function ComputerPlayer(marker, mode) {
  const prototype = Player(marker);
  const name = `${mode == 'easy' ? 'Randy' : 'Hardy'} the Computer`,
        turnMessage = `${name} (${marker}) is taking its turn...`;

  function setName() {
    //do nothing
  }

  function messageRecipient() {
    return '';
  }

  async function selectSquare(info) {
    await new Promise(r => setTimeout(r, 1000));
    return mode == 'easy' ? this.autoSelectSquare(info) : _selectOptimizedSquare(info);
  }

  function _selectOptimizedSquare(board) {
    const indexesWithBoardValues = board.availableIndexes().map(index =>
      Object.assign({ index }, _boardValues(board, index, board.markers.indexOf(marker))));
    return indexesWithBoardValues.sort((a, b) => 
      b.optimizedVal - a.optimizedVal || b.averageVal - a.averageVal)[0].index;
  }

  function _boardValues(board, index, currMarkerInd) {
    const nextBoard = Board(board.markers, [...board.state.map(row => [...row])]);
    nextBoard.setSquare(index, board.markers[currMarkerInd]);

    if (gameConditions.win(marker, nextBoard)) return { optimizedVal: 1, averageVal: 1 };
    if (gameConditions.lose(marker, nextBoard)) return { optimizedVal: -1, averageVal: -1 };
    if (gameConditions.tie(nextBoard)) return { optimizedVal: 0, averageVal: 0 };

    const nextMarkerInd = currMarkerInd ^ 1,
          nextBoardValues = nextBoard.availableIndexes().map(nextIndex => _boardValues(nextBoard, nextIndex, nextMarkerInd)),
          nextBoardOptimizedValues = nextBoardValues.map(values => values.optimizedVal),
          optimizedVal = board.markers[nextMarkerInd] == marker ? Math.max(...nextBoardOptimizedValues) : Math.min(...nextBoardOptimizedValues),
          averageVal = nextBoardValues.map(values => values.averageVal).reduce((a, b) => a + b, 0) / nextBoardValues.length;

    return { optimizedVal, averageVal };
  }

  return Object.assign({ type: 'computer', name, setName, messageRecipient, turnMessage, selectSquare }, prototype);
}

function HumanPlayer(marker, index, nameInputSelector = index) {
  const prototype = Player(marker);
  const name = `Player ${index + 1}`,
        turnMessage = "it's your turn.";

  function setName() {
    this.name = display.nameInputElement(nameInputSelector).value || this.name;
  }

  function messageRecipient() {
    return `${this.name.length <= 20 ? this.name : this.name.slice(0, 20) + '...'} (${marker}),`;
  }

  function selectSquare(info) {
    if (Array.isArray(info.state))
      return this.autoSelectSquare(info);

    return info.target.dataset.index;
  }

  return Object.assign({ type: 'human', name, setName, messageRecipient, turnMessage, selectSquare }, prototype);
} 
