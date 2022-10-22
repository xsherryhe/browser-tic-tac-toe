//TO DO: Pass dependencies/arguments instead of using call(this)

const ticTacToe = (function() {
  //update and cache DOM
  const newGameButtons = document.querySelectorAll('.new-game'),
        resetGameButton = document.querySelector('.reset-game'),
        infoContainer = document.querySelector('.info-container'),
        infoElement = infoContainer.querySelector('.info'),
        infoContinueButton = infoContainer.querySelector('.continue'),
        messageContainer = document.querySelector('.message-container'),
        messageRecipientElement = document.querySelector('.message-recipient'),
        messageElement = document.querySelector('.message'),
        boardElement = document.querySelector('.board'),
        squareElements = _createInitialSquares(),
        userInputsContainers = document.querySelectorAll('.user-inputs-container'),
        userInputsContainer = type => document.querySelector(`.user-inputs-container.${type}`),
        userInputsSubmitButton = type => document.querySelector(`.user-inputs-container.${type} .submit`),
        nameInputElement = selector => document.querySelector(`.player-${selector}-field input`);

  //bind events
  newGameButtons.forEach(button => button.addEventListener('click', startNewGame));
  resetGameButton.addEventListener('click', selectNewGame);

  //declare factory functions
  function Game() {
    const _board = Board(), _boardState = _board.state;
    let _currPlayerInd = 0, _gameOver = false;

    async function takeTurn(info = _boardState) {
      if(_gameOver) return;

      const index = await this.currPlayer().selectSquare(info);
      const successfulTurn = _board.setSquare(index, this.currPlayer().marker);
      if(!successfulTurn) return;

      _currPlayerInd ^= 1;
      this.render();
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

    function renderSetUp() {
      _renderPageElements(userInputsContainer(this.type));
    }

    function render() {
      _renderPageElements(messageContainer, boardElement);
      this.currPlayer().renderTurnMessage();
      _board.renderSquares();
    }

    function checkGameOver() {
      _gameOver = _win.call(this) || _tie();
      if(_gameOver) _renderResetGameButton();
      return _gameOver;
    }

    function _win() {
      const win = _rowWin.call(this) || _colWin.call(this) || _diagWin.call(this);
      if(win) _renderWinMessage(this.oppPlayer());
      return win;
    }

    function _rowWin() {
      return _boardState.some(row => row.every(space => _winningSpace.call(this, space)));
    }

    function _colWin() {
      return _boardState.some((_, i) => _boardState.every(row => _winningSpace.call(this, row[i])));
    }

    function _diagWin() {
      return _boardState.every((row, i) => _winningSpace.call(this, row[i])) || 
             _boardState.every((row, i) => _winningSpace.call(this, row[2 - i]));
    }

    function _winningSpace(space) {
      return space == this.oppPlayer().marker;
    }

    function _tie() {
      const tie = _boardState.every(row => row.every(space => space));
      if(tie) _renderTieMessage();
      return tie;
    }

    function _renderTieMessage() {
      messageRecipientElement.textContent = '';
      messageElement.textContent = 'The game ends with a tie.'
    }

    function _renderWinMessage(player) {
      messageRecipientElement.textContent = '';
      messageElement.textContent = `${player.name} has won!`;
    }

    return { setPlayerNames, currPlayer, oppPlayer, takeTurn, checkGameOver, renderSetUp, render };
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

    function renderInfo() {
      _renderPageElements(infoContainer);
      infoElement.textContent = '';
      const [p1, p2] = [...new Array(2)].map(_ => document.createElement('p'));
      p1.textContent = 'By random determination:';
      p2.textContent = 'X always goes first!';
      infoElement.appendChild(p1);
      this.players.forEach((player) => {
        const playerRoleElement = document.createElement('p');
        playerRoleElement.textContent =
          `${player.type == 'computer' ? 'The Computer is' : 'You are'} the ${player.marker} player.`
        infoElement.appendChild(playerRoleElement);
      })
      infoElement.appendChild(p2);
    }

    function initialize() {
      this.render();
      if(this.currPlayer().type == 'computer') this.takeTurn();
    }

    return Object.assign({ type: 'computer', players, initialize, renderInfo }, prototype);
  }

  function HumanGame(markers = ['X', 'O']) {
    const prototype = Game();
    const players = markers.map((marker, i) => HumanPlayer(marker, i));

    function renderInfo() {
      this.initialize();
    }

    function initialize() {
      this.render();
    }

    return Object.assign({ type: 'human', players, initialize, renderInfo }, prototype);
  }

  function Board() {
    const state = [...new Array(3)].map(_ => (new Array(3)).fill(null));

    function setSquare(index, marker) {
      if (_getSquare(index)) {
        _renderSquareTakenMessage();
        return false;
      }

      state[Math.floor(index / 3)][index % 3] = marker;
      return true;
    }

    function renderSquares() {
      squareElements.forEach((squareElement, i) => {
        squareElement.textContent = _getSquare(i);
      })
    }

    function _getSquare(index) {
      return state[Math.floor(index / 3)][index % 3];
    }

    function _renderSquareTakenMessage() {
      messageElement.textContent = 'that square is already taken.';
    }

    return { state, setSquare, renderSquares };
  }

  function Player(marker) {
    function autoSelectSquare(boardState) {
      const availableIndexes = boardState.reduce((indexes, row, i) => {
        row.forEach((square, j) => {
          if(!square) indexes.push(i * 3 + j);
        })
        return indexes;
      }, [])
      return availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
    }

    return { marker, autoSelectSquare };
  }

  function ComputerPlayer(marker) {
    const prototype = Player(marker);
    const name = 'The Computer';

    async function selectSquare(info) {
      await new Promise(r => setTimeout(r, 1000));
      return this.autoSelectSquare(info);
    }

    function setName() {
      //do nothing
    }

    function renderTurnMessage() {
      messageRecipientElement.textContent = '';
      messageElement.textContent = `The Computer (${this.marker}) is taking its turn...`;
    }

    return Object.assign({ type: 'computer', name, setName, selectSquare, renderTurnMessage }, prototype);
  }

  function HumanPlayer(marker, index, nameInputSelector = index) {
    const prototype = Player(marker);
    const name = `Player ${index + 1}`;

    function setName() {
      this.name = nameInputElement(nameInputSelector).value || this.name;
    }

    function selectSquare(info) {
      if(Array.isArray(info))
        return this.autoSelectSquare(info);
      
      return info.target.dataset.index;
    }

    function renderTurnMessage() {
      messageRecipientElement.textContent = `${this.name} (${marker}),`;
      messageElement.textContent = "it's your turn.";
    }

    return Object.assign({ type: 'human', name, setName, selectSquare, renderTurnMessage }, prototype);
  }

  //declare event listeners and public functions
  function selectNewGame() {
    _renderNewGameButtons();
  }

  function startNewGame(val = 'computer') {
    const type = typeof val == 'string' ? val : val.target.dataset.type,
          newGame = type == 'computer' ? ComputerGame() : HumanGame();
    _bindGameEvents(newGame);
    newGame.renderSetUp();
    return newGame;
  }

  //declare helper functions
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

  function _renderNewGameButtons() {
    _renderPageElements(...newGameButtons);
  }

  function _renderResetGameButton() {
    resetGameButton.classList.remove('hidden');
  }

  function _renderPageElements(...elements) {
    _hideAllExcept(...elements);
    elements.forEach(element => element.classList.remove('hidden'));
  }

  function _hideAllExcept(...elements) {
    [...newGameButtons, ...userInputsContainers, resetGameButton, 
     infoContainer, messageContainer, boardElement].forEach(element => {
      if(!elements.includes(element))
        element.classList.add('hidden');
    })
  }

  function _bindGameEvents(game) {
    const inputSubmitButton = userInputsSubmitButton(game.type);
    inputSubmitButton.addEventListener('click', game.setPlayerNames.bind(game));
    inputSubmitButton.addEventListener('click', game.renderInfo.bind(game));
    infoContinueButton.addEventListener('click', game.initialize.bind(game));
    squareElements.forEach(squareElement => squareElement.addEventListener('click', game.takeTurn.bind(game)));
  }

  return { selectNewGame, startNewGame };
})()
