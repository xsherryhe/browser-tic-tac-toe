function Player(marker) {
  function autoSelectSquare(boardState) {
    const availableIndexes = boardState.reduce((indexes, row, i) => {
      row.forEach((square, j) => {
        if (!square) indexes.push(i * 3 + j);
      })
      return indexes;
    }, [])
    return availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
  }

  return { marker, autoSelectSquare };
}

function ComputerPlayer(marker) {
  const prototype = Player(marker);
  const name = 'The Computer',
    turnMessage = `The Computer (${marker}) is taking its turn...`

  function setName() {
    //do nothing
  }

  function messageRecipient() {
    return '';
  }

  async function selectSquare(info) {
    await new Promise(r => setTimeout(r, 1000));
    return this.autoSelectSquare(info);
  }

  return Object.assign({ type: 'computer', name, setName, messageRecipient, turnMessage, selectSquare }, prototype);
}

function HumanPlayer(marker, index, nameInputSelector = index) {
  const prototype = Player(marker);
  const name = `Player ${index + 1}`,
    turnMessage = "it's your turn.";

  function setName() {
    this.name = display.nameInputElement(nameInputSelector).value || this.name;
  }

  function messageRecipient() {
    return `${this.name} (${marker}),`;
  }

  function selectSquare(info) {
    if (Array.isArray(info))
      return this.autoSelectSquare(info);

    return info.target.dataset.index;
  }

  return Object.assign({ type: 'human', name, setName, messageRecipient, turnMessage, selectSquare }, prototype);
} 
