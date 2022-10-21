const ticTacToe = (function() {
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
    //cache DOM
    const nameInputElement = document.querySelector(`.player-${index}-field input`),
          messageRecipient = document.querySelector('.message-recipient');

    let _name;
    function setName() {
      _name = nameInputElement.value;
    }

    function renderMessage() {
      messageRecipient.textContent = `${_name} (${marker})`;
      messageElement.textContent = "it's your turn."
    }

    return { setName, renderMessage, marker };
  }

  //update and cache DOM
  const newGameButton = document.querySelector('.new-game-button'),
        messageContainer = document.querySelector('.message-container'),
        messageElement = document.querySelector('.message'),
        boardElement = document.querySelector('.board'),
        squareElements = _createInitialSquares(),
        userInputsContainer = document.querySelector('.user-inputs-container'),
        userInputsSubmitButton = userInputsContainer.querySelector('.submit');

  //bind events
  newGameButton.addEventListener('click', startNewGame);

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

  function _bindGameEvents(game) {
    userInputsSubmitButton.addEventListener('click', game.setPlayerNames);
    userInputsSubmitButton.addEventListener('click', game.render);
    squareElements.forEach(squareElement => squareElement.addEventListener('click', game.takeTurn));
  }

  function startNewGame() {
    newGameButton.classList.add('hidden');
    userInputsContainer.classList.remove('hidden');
    const newGame = Game();
    _bindGameEvents(newGame);
  }

  return { startNewGame };
})()
