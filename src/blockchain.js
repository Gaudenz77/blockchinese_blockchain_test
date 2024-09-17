const sha256 = CryptoJS.SHA256;

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return sha256(
      this.index +
      this.timestamp +
      JSON.stringify(this.data) +
      this.previousHash +
      this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    const target = Array(difficulty + 1).join("0");
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`Block mined: ${this.hash}`);
  }

  static fromObject(obj) {
    const newBlock = new Block(obj.index, obj.timestamp, obj.data, obj.previousHash);
    newBlock.hash = obj.hash;
    newBlock.nonce = obj.nonce;
    return newBlock;
  }
}

class Blockchain {
  constructor(currency) {
    this.currency = currency;
    this.difficulty = 4;
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
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
    this.saveBlockchain();
  }

  saveBlockchain() {
    localStorage.setItem(this.currency, JSON.stringify(this.chain));
  }

  retrieveBlockchain() {
    const storedBlockchain = localStorage.getItem(this.currency);
    return storedBlockchain ? JSON.parse(storedBlockchain).map(Block.fromObject) : null;
  }
}

// Initialize blockchains for each cryptocurrency
const blockchains = {
  bitcoin: new Blockchain("bitcoin"),
  ethereum: new Blockchain("ethereum"),
  litecoin: new Blockchain("litecoin"),
  poorcoin: new Blockchain("poorcoin")
};

// Function to create a block for the selected cryptocurrency
function createBlockchain() {
  const blockData = document.getElementById('blockData').value;
  const blockValue = document.getElementById('blockValue').value;
  const blockCurrency = document.getElementById('blockCurrency').value;

  const newBlock = new Block(
    blockchains[blockCurrency].chain.length, 
    new Date().toLocaleString(), 
    { data: blockData, value: blockValue }
  );
  
  blockchains[blockCurrency].addBlock(newBlock);
  displayBlockchain(blockCurrency);
}

// Function to display the blockchain for the selected cryptocurrency
function displayBlockchain(currency) {
  const blockchainDisplay = document.getElementById(`${currency}BlockchainDisplay`);
  blockchainDisplay.innerHTML = ''; // Clear previous display

  const table = document.createElement('table');
  table.className = 'table table-striped-columns myTable';

  const headerRow = table.insertRow(0);
  const headers = ['Block Number', 'Timestamp', 'Data', 'Hash', 'Previous Hash'];
  
  headers.forEach(headerText => {
    const header = document.createElement('th');
    header.textContent = headerText;
    headerRow.appendChild(header);
  });

  for (const block of blockchains[currency].chain) {
    const row = table.insertRow(-1);
    const rowData = [block.index, block.timestamp, JSON.stringify(block.data), block.hash, block.previousHash];

    rowData.forEach((data, index) => {
      const cell = row.insertCell(index);
      cell.textContent = data;
    });
  }

  blockchainDisplay.appendChild(table);
}

// Display all blockchains on page load
window.onload = () => {
  displayBlockchain('bitcoin');
  displayBlockchain('ethereum');
  displayBlockchain('litecoin');
  displayBlockchain('poorcoin');
};

/* --------------------- Ither stuff */
  document.addEventListener('DOMContentLoaded', () => {
  const themeSelect = document.getElementById('themeSelect');

  // Listen for dropdown change
  themeSelect.addEventListener('change', function () {
    const selectedTheme = this.value;
    document.documentElement.setAttribute('data-theme', selectedTheme);
  });
});

