function Game(markers = ['X', 'O']) {
  const board = Board(markers);
  let _currPlayerInd = 0, _gameOver = false;

  async function takeTurn(info = board) {
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
    const win = gameConditions.win(this.oppPlayer().marker, board),
          tie = gameConditions.tie(board);
    _gameOver = win || tie;
    if (tie) display.renderTieMessage();
    if (win) display.renderWinMessage(this.oppPlayer());
    if (_gameOver) display.renderResetGame();
    return _gameOver;
  }

  return { board, setPlayerNames, currPlayer, oppPlayer, takeTurn, checkGameOver };
}

function ComputerGame(level, markers = ['X', 'O']) {
  const prototype = Game(markers);

  let players;
  _initializePlayers();

  function _initializePlayers() {
    const playerFactories = [[ComputerPlayer, HumanPlayer], [HumanPlayer, ComputerPlayer]]
    [Math.floor(Math.random() * 2)];
    players = markers.map((marker, i) => {
      const playerFactory = playerFactories[i];
      return playerFactory == ComputerPlayer ? playerFactory(marker, level)
                                             : playerFactory(marker, i, 'single');
    });
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
  const prototype = Game(markers);
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
