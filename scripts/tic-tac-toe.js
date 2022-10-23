const ticTacToe = (function() {
  function selectNewGame() {
    display.renderNewGameButtons();
  }

  function startNewGame(val = 'computer', modeVal = 'hard') {
    const [type, mode] = 
      typeof val == 'string' ? [val, modeVal] : ['type', 'mode'].map(attr => val.target.dataset[attr]);
    const newGame = type == 'computer' ? ComputerGame(mode) : HumanGame();
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
    ['resetButton', 'resetGameButton'].forEach(button => 
      display[button].addEventListener('click', ticTacToe.selectNewGame.bind(ticTacToe)));
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
