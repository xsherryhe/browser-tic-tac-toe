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
          _board = Board(),
          _boardState = _board.state;
    let _currPlayerInd = 0,
        _gameOver = false;

    function takeTurn(val = Math.floor(Math.random() * 9)) {
      if(_gameOver) return;

      const index = typeof val == 'number' ? val : val.target.dataset.index;
      const successfulTurn = _board.setSquare(index, _currPlayer().marker);
      if (!successfulTurn) return;

      _currPlayerInd ^= 1;
      render();
      checkGameOver();
    }

    function render() {
      userInputsContainer.classList.add('hidden');
      messageContainer.classList.remove('hidden');
      boardElement.classList.remove('hidden');
      _currPlayer().renderMessage("it's your turn.");
      _board.renderSquares();
    }

    function setPlayerNames() {
      _players.forEach(player => player.setName());
    }

    function checkGameOver() {
      return _gameOver = _win() || _tie();
    }

    function _currPlayer() {
      return _players[_currPlayerInd];
    }

    function _oppPlayer() {
      return _players[_currPlayerInd ^ 1];
    }

    function _win() {
      const win = _rowWin() || _colWin() || _diagWin();
      if(win) _oppPlayer().renderMessage('you have won!');
      return win;
    }

    function _rowWin() {
      return _boardState.some(row => row.every(space => _winningSpace(space)));
    }

    function _colWin() {
      return _boardState.some((_, i) => _boardState.every(row => _winningSpace(row[i])));
    }

    function _diagWin() {
      return _boardState.every((row, i) => _winningSpace(row[i])) || 
             _boardState.every((row, i) => _winningSpace(row[2 - i]));
    }

    function _winningSpace(space) {
      return space == _oppPlayer().marker;
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

    return { setPlayerNames, takeTurn, checkGameOver, render };
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

  function Player(marker, index) {
    let _name;
    function setName() {
      _name = nameInputElement(index).value;
    }

    function renderMessage(content) {
      messageRecipientElement.textContent = `${_name || `Player ${index + 1}`} (${marker})`;
      messageElement.textContent = content;
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
