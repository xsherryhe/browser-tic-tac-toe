function Game() {
  const board = Board(), _boardState = board.state;
  let _currPlayerInd = 0, _gameOver = false;

  async function takeTurn(info = _boardState) {
    if (_gameOver) return;

    const index = await this.currPlayer().selectSquare(info);
    const successfulTurn = board.setSquare(index, this.currPlayer().marker);
    if (!successfulTurn) return;

    _currPlayerInd ^= 1;
    display.renderGame(this);
    this.checkGameOver();
    if (this.currPlayer().type == 'computer') this.takeTurn();
  }

  function setPlayerNames() {
    this.players.forEach(player => player.setName());
  }

  function currPlayer() {
    return this.players[_currPlayerInd];
  }

  function oppPlayer() {
    return this.players[_currPlayerInd ^ 1];
  }

  function checkGameOver() {
    _gameOver = _win(this.oppPlayer()) || _tie();
    if (_gameOver) display.renderResetGame();
    return _gameOver;
  }

  function _win(player) {
    const win = _rowWin(player) || _colWin(player) || _diagWin(player);
    if (win) display.renderWinMessage(player);
    return win;
  }

  function _rowWin(player) {
    return _boardState.some(row => row.every(space => _winningSpace(space, player)));
  }

  function _colWin(player) {
    return _boardState.some((_, i) => _boardState.every(row => _winningSpace(row[i], player)));
  }

  function _diagWin(player) {
    return _boardState.every((row, i) => _winningSpace(row[i], player)) ||
      _boardState.every((row, i) => _winningSpace(row[2 - i], player));
  }

  function _winningSpace(space, player) {
    return space == player.marker;
  }

  function _tie() {
    const tie = _boardState.every(row => row.every(space => space));
    if (tie) display.renderTieMessage();
    return tie;
  }

  return { board, setPlayerNames, currPlayer, oppPlayer, takeTurn, checkGameOver };
}

function ComputerGame(markers = ['X', 'O']) {
  const prototype = Game();

  let players;
  _initializePlayers();

  function _initializePlayers() {
    const playerFactories = [[ComputerPlayer, HumanPlayer], [HumanPlayer, ComputerPlayer]]
    [Math.floor(Math.random() * 2)];
    players = markers.map((marker, i) => playerFactories[i](marker, i, 'single'));
  }

  function setUp() {
    this.setPlayerNames();
    display.renderGameInfo(this);
  }

  function initialize() {
    display.renderGame(this);
    if (this.currPlayer().type == 'computer') this.takeTurn();
  }

  return Object.assign({ type: 'computer', players, setUp, initialize }, prototype);
}

function HumanGame(markers = ['X', 'O']) {
  const prototype = Game();
  const players = markers.map((marker, i) => HumanPlayer(marker, i));

  function setUp() {
    this.setPlayerNames();
    this.initialize();
  }

  function initialize() {
    display.renderGame(this);
  }

  return Object.assign({ type: 'human', players, setUp, initialize }, prototype);
}
