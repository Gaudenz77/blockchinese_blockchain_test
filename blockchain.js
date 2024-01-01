const sha256 = CryptoJS.SHA256;

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return sha256(
      this.index +
      this.timestamp +
      JSON.stringify(this.data) +
      this.previousHash
    ).toString();
  }

  static fromObject(obj) {
    const newBlock = new Block(obj.index, obj.timestamp, obj.data, obj.previousHash);
    newBlock.hash = obj.hash;
    return newBlock;
  }
}

class Blockchain {
  constructor() {
    this.chain = this.retrieveBlockchain() || [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, new Date().toLocaleString(), 'Genesis Block', '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
    this.saveBlockchain();
  }

  saveBlockchain() {
    localStorage.setItem('blockchain', JSON.stringify(this.chain));
  }

  retrieveBlockchain() {
    const storedBlockchain = localStorage.getItem('blockchain');
    return storedBlockchain ? JSON.parse(storedBlockchain).map(Block.fromObject) : null;
  }

  static fromObject(obj) {
    const newBlockchain = new Blockchain();
    newBlockchain.chain = obj.chain.map(Block.fromObject);
    return newBlockchain;
  }
}

const myBlockchain = new Blockchain();

function createBlockchain() {
  const blockData = document.getElementById('blockData').value;
  const blockValue = document.getElementById('blockValue').value;
  const newBlock = new Block(myBlockchain.chain.length, new Date().toLocaleString(), { data: blockData, value: blockValue });
  myBlockchain.addBlock(newBlock);
  displayBlockchain();

  // Clear the form
  document.getElementById('blockData').value = '';
  document.getElementById('blockValue').value = '';
}

function displayBlockchain() {
  const blockchainDisplay = document.getElementById('blockchainDisplay');
  blockchainDisplay.innerHTML = ''; // Clear previous display.

  // Create a table element with Bootstrap classes
  const table = document.createElement('table');
  table.className = 'table table-striped-columns';

  // Create table header
  const headerRow = table.insertRow(0);
  const headers = ['Block Number', 'Timestamp', 'Data', 'Hash', 'Previous Hash'];
  headers.forEach(headerText => {
    const header = document.createElement('th');
    header.textContent = headerText;
    headerRow.appendChild(header);
  });

  // Populate the table with blockchain data
  for (const block of myBlockchain.chain) {
    const row = table.insertRow(-1);
    const rowData = [block.index, block.timestamp, JSON.stringify(block.data), block.hash, block.previousHash];

    rowData.forEach((data, index) => {
      const cell = row.insertCell(index);
      cell.textContent = data;
    });
  }

  // Append the table to the display element
  blockchainDisplay.appendChild(table);
}

// Display the blockchain on page load
displayBlockchain();