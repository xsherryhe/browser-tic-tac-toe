const ticTacToe = (function() {
  //declare factory functions
  function Game() {
    const _board = Board(),
          _players = [...new Array(2)].map(_ => Player());
    
    //cache DOM
    const squareElements = document.querySelectorAll('.square');

    //bind events
    squareElements.forEach(squareElement => squareElement.addEventListener('click', takeTurn));

    function takeTurn() {
      //logic to update board and check for win here
    }

    return { takeTurn };
  }

  function Board() {
    const contents = [...new Array(3)].map(_ => (new Array(3)).fill(null));

    //update DOM
    _renderInitial();

    function _renderInitial() {
      const boardElement = document.createElement('div');
      boardElement.classList.add('board');
      for (let i = 0; i < 9; i++) 
        boardElement.appendChild(_renderInitialSquare(i));
      document.body.appendChild(boardElement);
      return boardElement;
    }

    function _renderInitialSquare(index) {
      const squareElement = document.createElement('button');
      squareElement.classList.add('square');
      squareElement.dataset.index = index;
      squareElement.textContent = ' ';
      return squareElement;
    }

    function renderSquare() {
    }

    return { };
  }

  function Player() {

  }

  //cache DOM
  const newGameButton = document.querySelector('.new-game-button');

  //bind events
  newGameButton.addEventListener('click', playGame);

  function playGame() {
    newGameButton?.remove();
    const currentGame = Game();
  }

  return { playGame };
})()
