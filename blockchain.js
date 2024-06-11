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
  constructor(currency) {
    this.currency = currency;
    this.chain = this.retrieveBlockchain() || [this.createGenesisBlock()];
    this.cashflow = this.calculateInitialCashflow();
  }

  createGenesisBlock() {
    return new Block(0, new Date().toLocaleString(), { data: 'Genesis Block', value: 0, currency: this.currency }, '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
    this.updateCashflow(newBlock.data.value);
    this.saveBlockchain();
  }

  calculateInitialCashflow() {
    return this.chain.reduce((acc, block) => acc + parseFloat(block.data.value), 0);
  }

  updateCashflow(value) {
    this.cashflow += parseFloat(value);
  }

  saveBlockchain() {
    localStorage.setItem(this.currency + '_blockchain', JSON.stringify(this.chain));
  }

  retrieveBlockchain() {
    const storedBlockchain = localStorage.getItem(this.currency + '_blockchain');
    return storedBlockchain ? JSON.parse(storedBlockchain).map(Block.fromObject) : null;
  }

  static fromObject(obj) {
    const newBlockchain = new Blockchain(obj.currency);
    newBlockchain.chain = obj.chain.map(Block.fromObject);
    return newBlockchain;
  }
}

// Manage multiple blockchains
const blockchains = {
  bitcoin: new Blockchain('bitcoin'),
  ethereum: new Blockchain('ethereum'),
  litecoin: new Blockchain('litecoin')
};

function createBlockchain() {
  const blockData = document.getElementById('blockData').value;
  const blockValue = document.getElementById('blockValue').value;
  const blockCurrency = document.getElementById('blockCurrency').value;
  const newBlock = new Block(blockchains[blockCurrency].chain.length, new Date().toLocaleString(), { data: blockData, value: blockValue, currency: blockCurrency });
  blockchains[blockCurrency].addBlock(newBlock);
  displayBlockchain(blockCurrency);

  // Clear the form
  document.getElementById('blockData').value = '';
  document.getElementById('blockValue').value = '';
  document.getElementById('blockCurrency').value = 'bitcoin'; // Default to bitcoin
}

function displayBlockchain(currency) {
  const blockchainDisplay = document.getElementById(`${currency}BlockchainDisplay`);
  blockchainDisplay.innerHTML = ''; // Clear previous display.

  // Create a table element with Bootstrap classes
  const table = document.createElement('table');
  table.className = 'table table-striped-columns';

  // Create table header
  const headerRow = table.insertRow(0);
  const headers = ['Block Number', 'Timestamp', 'Data', 'Value', 'Currency', 'Hash', 'Previous Hash', 'Total Currency'];
  headers.forEach(headerText => {
    const header = document.createElement('th');
    header.textContent = headerText;
    headerRow.appendChild(header);
  });

  // Populate the table with blockchain data
  let totalCurrency = 0; // Initial total currency
  for (const block of blockchains[currency].chain) {
    const row = table.insertRow(-1);
    const rowData = [block.index, block.timestamp, block.data.data, block.data.value, block.data.currency, block.hash, block.previousHash];
    totalCurrency += parseFloat(block.data.value); // Update total currency

    rowData.push(totalCurrency); // Add total currency to row data

    rowData.forEach((data, index) => {
      const cell = row.insertCell(index);
      cell.textContent = data;
    });
  }

  // Append the table to the display element
  blockchainDisplay.appendChild(table);
}

async function fetchCryptoValues() {
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin&vs_currencies=usd');
  const data = await response.json();

  const cryptoValuesDisplay = document.getElementById('cryptoValuesDisplay');
  cryptoValuesDisplay.innerHTML = `
    Current Values:<br>
    Bitcoin: $${data.bitcoin.usd}<br>
    Ethereum: $${data.ethereum.usd}<br>
    Litecoin: $${data.litecoin.usd}
  `;

  const selectedCurrency = document.getElementById('blockCurrency').value;
  const totalCurrency = blockchains[selectedCurrency].cashflow;
  const totalValueInSelectedCrypto = totalCurrency * data[selectedCurrency].usd;

  document.getElementById('totalValueInSelectedCrypto').textContent = `Total Value in Selected Cryptocurrency: $${totalValueInSelectedCrypto.toFixed(2)}`;
}

// Display the blockchain for each currency on page load
document.addEventListener('DOMContentLoaded', () => {
  displayBlockchain('bitcoin');
  displayBlockchain('ethereum');
  displayBlockchain('litecoin');
});
