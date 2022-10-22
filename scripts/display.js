const display = (function () {
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
           renderSquareTakenMessage, renderWinMessage, renderTieMessage };
})()
