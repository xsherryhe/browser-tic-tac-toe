function Player(marker) {
  function autoSelectSquare(board) {
    const indexes = board.availableIndexes();
    return indexes[Math.floor(Math.random() * indexes.length)];
  }

  return { marker, autoSelectSquare };
}

function ComputerPlayer(marker) {
  const prototype = Player(marker);
  const name = 'The Computer',
    turnMessage = `The Computer (${marker}) is taking its turn...`

  function setName() {
    //do nothing
  }

  function messageRecipient() {
    return '';
  }

  async function selectSquare(info) {
    await new Promise(r => setTimeout(r, 1000));
    //easy mode
    //return this.autoSelectSquare(info);
    return _selectOptimizedSquare(info);
  }

  function _selectOptimizedSquare(board) {
    const indexesWithBoardValues = 
      board.availableIndexes().map(index => {
        return { index, boardVal: _boardValue(board, index, board.markers.indexOf(marker)) };
      })
    return indexesWithBoardValues.sort((a, b) => b.boardVal - a.boardVal)[0].index;
  }

  function _boardValue(board, index, currMarkerInd) {
    const nextBoard = Board(board.markers, [...board.state.map(row => [...row])]);
    nextBoard.setSquare(index, board.markers[currMarkerInd]);

    if (gameConditions.win(marker, nextBoard)) return 1;
    if (gameConditions.lose(marker, nextBoard)) return -1;
    if (gameConditions.tie(nextBoard)) return 0;

    const nextMarkerInd = currMarkerInd ^ 1,
          nextBoardValues = nextBoard.availableIndexes().map(nextIndex => _boardValue(nextBoard, nextIndex, nextMarkerInd));
    //normal mode
    //return nextBoardValues.reduce((a, b) => a + b, 0) / nextBoardValues.length;
    //hard mode
    return board.markers[nextMarkerInd] == marker ? Math.max(...nextBoardValues) : Math.min(...nextBoardValues);
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
    return `${this.name} (${marker}),`;
  }

  function selectSquare(info) {
    if (Array.isArray(info.state))
      return this.autoSelectSquare(info);

    return info.target.dataset.index;
  }

  return Object.assign({ type: 'human', name, setName, messageRecipient, turnMessage, selectSquare }, prototype);
} 
