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
  let _gameEvents = {};
  
  function _bindInitial() {
    display.newGameButtons.forEach(button => button.addEventListener('click', ticTacToe.startNewGame.bind(ticTacToe)));
    ['resetButton', 'resetGameButton'].forEach(button => 
      display[button].addEventListener('click', ticTacToe.selectNewGame.bind(ticTacToe)));
  }
  _bindInitial();

  function bindForGame(game) {
    _removePreviousGame();
    ['setUp', 'initialize', 'takeTurn'].forEach(fn => _gameEvents[fn] = game[fn].bind(game));
    display.userInputsSubmitButton(game.type).addEventListener('click', _gameEvents.setUp);
    display.infoContinueButton.addEventListener('click', _gameEvents.initialize);
    display.squareElements.forEach(squareElement => squareElement.addEventListener('click', _gameEvents.takeTurn));
  }

  function _removePreviousGame() {
    display.userInputsSubmitButtons.forEach(button => button.removeEventListener('click', _gameEvents.setUp));
    display.infoContinueButton.removeEventListener('click', _gameEvents.initialize);
    display.squareElements.forEach(squareElement => squareElement.removeEventListener('click', _gameEvents.takeTurn));
    _gameEvents = {};
  }

  return { bindForGame };
})()
