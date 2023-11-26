const sha256 = require('crypto-js/sha256');

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
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
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
  }
}

function createBlockchain() {
  const blockData = document.getElementById('blockData').value;
  const blockValue = document.getElementById('blockValue').value;
  const newBlock = new Block(myBlockchain.chain.length, new Date().toLocaleString(), { data: blockData, value: blockValue });
  myBlockchain.addBlock(newBlock);
  displayBlockchain(); // assuming you have a function to display the blockchain
}

function displayBlockchain() {
  const blockchainDisplay = document.getElementById('blockchainDisplay');
  blockchainDisplay.innerHTML = ''; // Clear previous display.
  for (const block of myBlockchain.chain) {
    const blockInfo = document.createElement('p');
    blockInfo.innerText = `Block ${block.index} - Timestamp: ${block.timestamp} - Data: ${JSON.stringify(block.data)} - Hash: ${block.hash} - Previous Hash: ${block.previousHash}`;
    blockchainDisplay.appendChild(blockInfo);
  }
}

/* function sendToWallet() {
  // Simulate sending blockchain data to server (replace with actual server-side code).
  const blockchainData = JSON.stringify(myBlockchain);
  console.log(`Sending to wallet: ${blockchainData}`);
}

function retrieveBlockchain() {
  // Simulate retrieving blockchain from server (replace with actual server-side code).
  const retrievedBlockchainData = '{"chain":[{"index":0,"timestamp":"01/01/2023","data":"Genesis Block","previousHash":"0","hash":"60f07c44c0424d5f2a630b4307d2b94a2ef3309f57e17d1755c9b66f1657a4cf"},{"index":1,"timestamp":"02/01/2023","data":{"data":"Block Data 1","value":"100"},"previousHash":"60f07c44c0424d5f2a630b4307d2b94a2ef3309f57e17d1755c9b66f1657a4cf","hash":"1bebd1284b2f4aa17f6ac639e977d64cd3a359e2d587d2e1310f63c23eb8b5d9"},{"index":2,"timestamp":"03/01/2023","data":{"data":"Block Data 2","value":"200"},"previousHash":"1bebd1284b2f4aa17f6ac639e977d64cd3a359e2d587d2e1310f63c23eb8b5d9","hash":"51d02b695de9b66030027c414a53cc7af4efb76a32ec4f7c56f4312f3f3e5379"}]}';
  myBlockchain = new Blockchain(); // Reset blockchain before populating with retrieved data.
  const parsedBlockchain = JSON.parse(retrievedBlockchainData);
  parsedBlockchain.chain.forEach(block => {
    const newBlock = new Block(block.index, block.timestamp, block.data, block.previousHash);
    newBlock.hash = block.hash; // Preserve the original hash from the retrieved data.
    myBlockchain.chain.push(newBlock);
  });
  displayBlockchain();
} */

function displayBlockchain() {
  const blockchainDisplay = document.getElementById('blockchainDisplay');
  blockchainDisplay.innerHTML = ''; // Clear previous display.
  for (const block of myBlockchain.chain) {
    const blockInfo = document.createElement('p');
    blockInfo.innerText = `Block ${block.index} - Timestamp: ${block.timestamp} - Data: ${JSON.stringify(block.data)} - Hash: ${block.hash} - Previous Hash: ${block.previousHash}`;
    blockchainDisplay.appendChild(blockInfo);
  }
}
