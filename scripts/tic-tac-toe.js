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

  return { bindForGame };
})()
