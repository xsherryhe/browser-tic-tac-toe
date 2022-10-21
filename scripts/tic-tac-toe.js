const ticTacToe = (function() {
  //declare factory functions
  function Game(markers = ['X', 'O']) {
    const _players = markers.map((marker, i) => Player(marker, i)),
          _board = Board();
    let _currPlayerInd = 0;

    //update and cache DOM
    const userInputs = document.querySelector('.user-inputs'),
          userInputsSubmitButton = userInputs.querySelector('.submit');
    _renderUserInputs();

    //bind events
    userInputsSubmitButton.addEventListener('click', setPlayerNames);
    userInputsSubmitButton.addEventListener('click', render);
    squareElements.forEach(squareElement => squareElement.addEventListener('click', takeTurn));

    function _renderUserInputs() {
      userInputs.classList.remove('hidden');
    }

    function _currPlayer() {
      return _players[_currPlayerInd];
    }

    function render() {
      userInputs.classList.add('hidden');
      boardElement.classList.remove('hidden');
      _currPlayer().renderTurnMessage();
      _board.renderSquares();
    }

    function setPlayerNames() {
      _players.forEach(player => player.setName());
    }

    function takeTurn(e) {
      //logic to update board and check for win here
      _board.setSquare(e.target.dataset.index, _currPlayer().marker);
      _currPlayerInd ^= 1;
      render();
    }

    return {};
  }

  function Board() {
    const _state = [...new Array(3)].map(_ => (new Array(3)).fill(null));

    function setSquare(index, marker) {
      _state[Math.floor(index / 3)][index % 3] = marker;
    }

    function renderSquares() {
      squareElements.forEach((squareElement, i) => {
        squareElement.textContent = _state[Math.floor(i / 3)][i % 3];
      })
    }

    return { setSquare, renderSquares };
  }

  function Player(marker, index) {
    //cache DOM
    const nameInputElement = document.querySelector(`.player-${index}-field input`),
          messageElement = document.querySelector('.message');

    let _name;
    function setName() {
      _name = nameInputElement.value;
    }

    function renderTurnMessage() {
      messageElement.textContent = `${_name} (${marker}), it's your turn.`
    }

    return { setName, renderTurnMessage, marker };
  }

  //update and cache DOM
  const newGameButton = document.querySelector('.new-game-button'),
        boardElement = document.querySelector('.board'),
        squareElements = _createInitialSquares();

  //bind events
  newGameButton.addEventListener('click', playGame);

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

  function playGame() {
    newGameButton?.classList?.add('hidden');
    const newGame = Game();
  }

  return { playGame };
})()
