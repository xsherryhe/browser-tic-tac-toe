const display = (function () {
  //update and cache DOM
  const headerElement = document.querySelector('header'),
        newGameButtonsContainer = document.querySelector('.new-game-buttons'),
        newGameButtons = newGameButtonsContainer.querySelectorAll('.new-game'),
        resetButton = document.querySelector('.reset'),
        resetGameButton = document.querySelector('.reset-game'),
        infoContainer = document.querySelector('.info-container'),
        infoElement = infoContainer.querySelector('.info'),
        infoContinueButton = infoContainer.querySelector('.continue'),
        messageContainer = document.querySelector('.message-container'),
        messageRecipientElement = messageContainer.querySelector('.message-recipient'),
        messageElement = messageContainer.querySelector('.message'),
        boardHeader = document.querySelector('.board-header'),
        boardElement = document.querySelector('.board'),
        squareElements = _createInitialSquares(),
        userInputsContainers = document.querySelectorAll('.user-inputs-container'),
        userInputsSubmitButtons = document.querySelectorAll('.user-inputs-container .submit'),
        userInputsSubmitButton = type => document.querySelector(`.user-inputs-container[data-type=${type}] .submit`),
        nameInputElement = selector => document.querySelector(`.player-${selector}-field input`);

  function renderNewGameButtons() {
    _removePageTheme();
    _hideElement(resetButton);
    _renderPageElements(newGameButtonsContainer);
  }

  function renderGameSetUp(game) {
    _setPageTheme(game.type, game.mode);
    _renderElement(resetButton);
    _renderPageElements([...userInputsContainers].find(container => container.dataset.type == game.type));
  }

  async function renderGameInfo(game) {
    _renderPageElements(infoContainer);
    infoElement.textContent = '';
    const headingElement = document.createElement('h2'),
          contentElement = document.createElement('div'),
          footerElement = document.createElement('h3');
    headingElement.textContent = 'Randomly assigning roles...';
    game.players.forEach(player => { 
      const playerRoleElement = document.createElement('p');
      playerRoleElement.textContent =
        `${player.type == 'computer' ? `${player.name} is` : 'You are'} the ${player.marker} player.`
      contentElement.appendChild(playerRoleElement);
    })
    footerElement.textContent = 'X always goes first!';

    infoElement.appendChild(headingElement);
    await new Promise(r => setTimeout(r, 1000));
    [contentElement, footerElement].forEach(element => infoElement.appendChild(element));
    _renderElement(infoContinueButton);
  }

  function renderGame(game) {
    _renderPageElements(boardHeader, boardElement);
    _renderPlayerTurnMessage(game.currPlayer());
    _renderSquares(game.board);
  }

  function renderResetGame() {
    _renderElement(resetGameButton);
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
      //if(squareElement.textContent == board.markers[0])
        //squareElement.classList.add()
    })
  }

  function _createInitialSquares() {
    return [...new Array(9)].map((_, i) => {
      const squareElement = document.createElement('button');
      squareElement.classList.add('square', 'no-theme');
      squareElement.dataset.index = i;
      boardElement.appendChild(squareElement);
      return squareElement;
    })
  }

  function _setPageTheme(type, mode) {
    [headerElement, ...userInputsContainers, infoContainer, boardElement, ...squareElements].forEach(element => {
      element.classList.remove('no-theme', 'easy', 'hard', 'computer', 'human');
      element.classList.add(type);
      if(mode) element.classList.add(mode);
    })
  }

  function _removePageTheme() {
    [headerElement, ...userInputsContainers, infoContainer, boardElement, ...squareElements].forEach(element => {
      element.classList.add('no-theme');
      element.classList.remove('easy', 'hard', 'computer', 'human');
    })
  }

  function _renderElement(element) {
    element.classList.remove('hidden');
  }

  function _hideElement(element) {
    element.classList.add('hidden');
  }

  function _renderPageElements(...elements) {
    _hideAllExcept(...elements);
    elements.forEach(element => _renderElement(element));
  }

  function _hideAllExcept(...elements) {
    [newGameButtonsContainer, ...userInputsContainers, 
     resetGameButton, infoContinueButton,
     infoContainer, boardHeader, boardElement].forEach(element => {
        if (!elements.includes(element)) 
          _hideElement(element);
      })
  }

  return { newGameButtons, resetButton, resetGameButton, infoContinueButton,
           squareElements, userInputsSubmitButtons, userInputsSubmitButton, nameInputElement,
           renderNewGameButtons, renderGameSetUp, renderGameInfo, renderGame, renderResetGame,
           renderSquareTakenMessage, renderWinMessage, renderTieMessage };
})()
