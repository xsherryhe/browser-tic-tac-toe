const display = (function() {
  //update and cache DOM
  const newGameButtons = document.querySelectorAll('.new-game'),
        resetGameButton = document.querySelector('.reset-game'),
        infoContainer = document.querySelector('.info-container'),
        infoElement = infoContainer.querySelector('.info'),
        infoContinueButton = infoContainer.querySelector('.continue'),
        messageContainer = document.querySelector('.message-container'),
        messageRecipientElement = messageContainer.querySelector('.message-recipient'),
        messageElement = messageContainer.querySelector('.message'),
        boardElement = document.querySelector('.board'),
        squareElements = _createInitialSquares(),
        userInputsContainers = document.querySelectorAll('.user-inputs-container'),
        userInputsSubmitButton = type => document.querySelector(`.user-inputs-container[data-type=${type}] .submit`),
        nameInputElement = selector => document.querySelector(`.player-${selector}-field input`);

  function renderNewGameButtons() {
    _renderPageElements(...newGameButtons);
  }

  function renderGameSetUp(game) {
    _renderPageElements([...userInputsContainers].find(container => container.dataset.type == game.type));
  }

  function renderGameInfo(game) {
    _renderPageElements(infoContainer);
    infoElement.textContent = '';
    const [p1, p2] = [...new Array(2)].map(_ => document.createElement('p'));
    p1.textContent = 'By random determination:';
    p2.textContent = 'X always goes first!';
    infoElement.appendChild(p1);
    game.players.forEach((player) => {
      const playerRoleElement = document.createElement('p');
      playerRoleElement.textContent =
        `${player.type == 'computer' ? 'The Computer is' : 'You are'} the ${player.marker} player.`
      infoElement.appendChild(playerRoleElement);
    })
    infoElement.appendChild(p2);
  }

  function renderGame(game) {
    _renderPageElements(messageContainer, boardElement);
    _renderPlayerTurnMessage(game.currPlayer());
    _renderSquares(game.board);
  }

  function renderResetGame() {
    resetGameButton.classList.remove('hidden');
  }

  function renderSquareTakenMessage() {
    messageElement.textContent = 'that square is already taken.';
  }

  function renderWinMessage(player) {
    messageRecipientElement.textContent = '';
    messageElement.textContent = `${player.name} has won!`;
  }

  function renderTieMessage() {
    messageRecipientElement.textContent = '';
    messageElement.textContent = 'The game ends with a tie.'
  }

  function _renderPlayerTurnMessage(player) {
    messageRecipientElement.textContent = player.messageRecipient();
    messageElement.textContent = player.turnMessage;
  }

  function _renderSquares(board) {
    squareElements.forEach((squareElement, i) => {
      squareElement.textContent = board.getSquare(i);
    })
  }

  function _createInitialSquares() {
    return [...new Array(9)].map((_, i) => {
      const squareElement = document.createElement('button');
      squareElement.classList.add('square');
      squareElement.dataset.index = i;
      squareElement.textContent = ' ';
      boardElement.appendChild(squareElement);
      return squareElement;
    })
  }

  function _renderPageElements(...elements) {
    _hideAllExcept(...elements);
    elements.forEach(element => element.classList.remove('hidden'));
  }

  function _hideAllExcept(...elements) {
    [...newGameButtons, ...userInputsContainers, resetGameButton,
     infoContainer, messageContainer, boardElement].forEach(element => {
      if (!elements.includes(element))
        element.classList.add('hidden');
    })
  }
  
return { newGameButtons, resetGameButton, infoContinueButton, 
         squareElements, userInputsSubmitButton, nameInputElement, 
         renderNewGameButtons, renderGameSetUp, renderGameInfo, renderGame, renderResetGame, 
         renderSquareTakenMessage, renderWinMessage, renderTieMessage }
})()

const ticTacToe = (function() {
  function selectNewGame() {
    display.renderNewGameButtons();
  }

  function startNewGame(val = 'computer') {
    const type = typeof val == 'string' ? val : val.target.dataset.type,
          newGame = type == 'computer' ? ComputerGame() : HumanGame();
    events.bindForGame(newGame);
    display.renderGameSetUp(newGame);
    return newGame;
  }

  return { selectNewGame, startNewGame };
})()

const events = (function () {
  //bind events
  function _bindInitial() {
    display.newGameButtons.forEach(button => button.addEventListener('click', ticTacToe.startNewGame.bind(ticTacToe)));
    display.resetGameButton.addEventListener('click', ticTacToe.selectNewGame.bind(ticTacToe));
  }
  _bindInitial();

  function bindForGame(game) {
    const inputSubmitButton = display.userInputsSubmitButton(game.type);
    inputSubmitButton.addEventListener('click', game.setUp.bind(game));
    display.infoContinueButton.addEventListener('click', game.initialize.bind(game));
    display.squareElements.forEach(squareElement => squareElement.addEventListener('click', game.takeTurn.bind(game)));
  }

  return { bindForGame }
})()

function Game() {
  const board = Board(), _boardState = board.state;
  let _currPlayerInd = 0, _gameOver = false;

  async function takeTurn(info = _boardState) {
    if(_gameOver) return;

    const index = await this.currPlayer().selectSquare(info);
    const successfulTurn = board.setSquare(index, this.currPlayer().marker);
    if(!successfulTurn) return;

    _currPlayerInd ^= 1;
    display.renderGame(this);
    this.checkGameOver();
    if(this.currPlayer().type == 'computer') this.takeTurn();
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
    if(_gameOver) display.renderResetGame();
    return _gameOver;
  }

  function _win(player) {
    const win = _rowWin(player) || _colWin(player) || _diagWin(player);
    if(win) display.renderWinMessage(player);
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
    if(tie) display.renderTieMessage();
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
    if(this.currPlayer().type == 'computer') this.takeTurn();
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

function Board() {
  const state = [...new Array(3)].map(_ => (new Array(3)).fill(null));

  function getSquare(index) {
    return state[Math.floor(index / 3)][index % 3];
  }

  function setSquare(index, marker) {
    if(this.getSquare(index)) {
      display.renderSquareTakenMessage();
      return false;
    }

    state[Math.floor(index / 3)][index % 3] = marker;
    return true;
  }

  return { state, getSquare, setSquare };
}

function Player(marker) {
  function autoSelectSquare(boardState) {
    const availableIndexes = boardState.reduce((indexes, row, i) => {
      row.forEach((square, j) => {
        if (!square) indexes.push(i * 3 + j);
      })
      return indexes;
    }, [])
    return availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
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
    return this.autoSelectSquare(info);
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
    if(Array.isArray(info))
      return this.autoSelectSquare(info);

    return info.target.dataset.index;
  }

  return Object.assign({ type: 'human', name, setName, messageRecipient, turnMessage, selectSquare }, prototype);
} 
