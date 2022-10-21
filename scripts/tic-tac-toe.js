const ticTacToe = (function() {
  //update and cache DOM
  const newGameButton = document.querySelector('.new-game-button'),
        messageContainer = document.querySelector('.message-container'),
        messageRecipientElement = document.querySelector('.message-recipient'),
        messageElement = document.querySelector('.message'),
        boardElement = document.querySelector('.board'),
        squareElements = _createInitialSquares(),
        userInputsContainer = document.querySelector('.user-inputs-container'),
        userInputsSubmitButton = userInputsContainer.querySelector('.submit'),
        nameInputElement = index => document.querySelector(`.player-${index}-field input`);

  //bind events
  newGameButton.addEventListener('click', startNewGame);

  //declare factory functions
  function Game(markers = ['X', 'O']) {
    const _players = markers.map((marker, i) => Player(marker, i)),
          _board = Board();
    let _currPlayerInd = 0;

    function _currPlayer() {
      return _players[_currPlayerInd];
    }

    function setPlayerNames() {
      _players.forEach(player => player.setName());
    }

    function takeTurn(e) {
      //logic to update board and check for win here
      const successfulTurn = _board.setSquare(e.target.dataset.index, _currPlayer().marker);
      if(!successfulTurn) return;

      _currPlayerInd ^= 1;
      render();
    }

    function render() {
      userInputsContainer.classList.add('hidden');
      messageContainer.classList.remove('hidden');
      boardElement.classList.remove('hidden');
      _currPlayer().renderMessage();
      _board.renderSquares();
    }

    return { setPlayerNames, takeTurn, render };
  }

  function Board() {
    const _state = [...new Array(3)].map(_ => (new Array(3)).fill(null));

    function _getSquare(index) {
      return _state[Math.floor(index / 3)][index % 3];
    }

    function _renderSquareTakenMessage() {
      messageElement.textContent = 'that square is already taken.';
    }

    function setSquare(index, marker) {
      if(_getSquare(index)) {
        _renderSquareTakenMessage();
        return false;
      }

      _state[Math.floor(index / 3)][index % 3] = marker;
      return true;
    }

    function renderSquares() {
      squareElements.forEach((squareElement, i) => {
        squareElement.textContent = _getSquare(i);
      })
    }

    return { setSquare, renderSquares };
  }

  function Player(marker, index) {
    let _name;
    function setName() {
      _name = nameInputElement(index).value;
    }

    function renderMessage() {
      messageRecipient.textContent = `${_name} (${marker})`;
      messageElement.textContent = "it's your turn."
    }

    return { setName, renderMessage, marker };
  }

  //declare event listeners and public functions
  function startNewGame() {
    _renderUserInputs();
    const newGame = Game();
    _bindGameEvents(newGame);
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

  function _renderUserInputs() {
    newGameButton.classList.add('hidden');
    messageContainer.classList.add('hidden');
    boardElement.classList.add('hidden');
    userInputsContainer.classList.remove('hidden');
  }

  function _bindGameEvents(game) {
    userInputsSubmitButton.addEventListener('click', game.setPlayerNames);
    userInputsSubmitButton.addEventListener('click', game.render);
    squareElements.forEach(squareElement => squareElement.addEventListener('click', game.takeTurn));
  }

  return { startNewGame };
})()
