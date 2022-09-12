const axios = require('axios');
const express = require('express');
const router = express.Router();

const symbolToAddress ={
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
  SHIB: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
  WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  OMG: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07',
  ZRX: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
  MKR: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
  REPv2: '0x221657776846890989a759BA2973e427DfF5C9bB', 
  LRC: '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD',
  BAT: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF'
};

const addressWallet = '0x0C4EcE75800273Bb516394b8a82B6B180b5f86c4';
const apiKeyToken = 'VEAG1TJJ9CJ6TN2PCGC4VQZUS8TGJ6NNEA';

function parseTransactionValue (value, decimals){
  return parseInt(value)*(1/10**decimals)
}

router.get('/', function(req, res) {
  Promise.all(
    [
      axios.get(`https://api.etherscan.io/api?module=account&action=balance&address=${addressWallet}&tag=latest&apikey=${apiKeyToken}`),
      axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${symbolToAddress.USDT}&address=${addressWallet}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${apiKeyToken}`),
      axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${symbolToAddress.USDC}&address=${addressWallet}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${apiKeyToken}`),
      axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${symbolToAddress.LINK}&address=${addressWallet}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${apiKeyToken}`),
      axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${symbolToAddress.LRC}&address=${addressWallet}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${apiKeyToken}`),
      axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${symbolToAddress.MKR}&address=${addressWallet}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${apiKeyToken}`),
      axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${symbolToAddress.OMG}&address=${addressWallet}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${apiKeyToken}`),
      axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${symbolToAddress.REPv2}&address=${addressWallet}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${apiKeyToken}`),
      axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${symbolToAddress.SHIB}&address=${addressWallet}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${apiKeyToken}`),
      axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${symbolToAddress.WBTC}&address=${addressWallet}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${apiKeyToken}`),
      axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${symbolToAddress.ZRX}&address=${addressWallet}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${apiKeyToken}`),
      axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${symbolToAddress.BAT}&address=${addressWallet}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${apiKeyToken}`),
    ]
  ).then(response => {
    let balancesCrypto = [];
    let walletBalance = 0; 
    let tokenDecimal = 0;
    let nameCrypto = '';
    let symbolCrypto = '';
    let amountCrypto = 0;
    let priceCrypto = 0;
    const resposta = response.map( (item, index) => {
      if (item.data.message == "OK" && typeof item.data.result == "string"){
        amountCrypto = parseTransactionValue(parseInt(item.data.result), 18)
        priceCrypto = Math.random()
        balancesCrypto.push({
          id: index,
          name: "Ethereum", 
          symbol: "ETH", 
          amount: amountCrypto, 
          price: priceCrypto, 
          total: amountCrypto*priceCrypto 
        })
      }else if(item.data.message == "OK" && typeof item.data.result == "object"){
        item.data.result.forEach( transaction => {
          if (transaction.from && transaction.from.toUpperCase() != addressWallet.toUpperCase() && transaction.to.toUpperCase() == addressWallet.toUpperCase()){
            walletBalance = walletBalance + parseInt(transaction.value)
          }else if(transaction.to && transaction.to.toUpperCase() != addressWallet.toUpperCase() && transaction.from.toUpperCase() == addressWallet.toUpperCase()){
            walletBalance = walletBalance - parseInt(transaction.value)
          }
          tokenDecimal = parseInt(transaction.tokenDecimal)
          nameCrypto = transaction.tokenName
          symbolCrypto = transaction.tokenSymbol
        });
        amountCrypto = parseTransactionValue(walletBalance, tokenDecimal)
        priceCrypto = Math.random()
        balancesCrypto.push({
          id: index,
          name: nameCrypto, 
          symbol: symbolCrypto, 
          amount: amountCrypto, 
          price: priceCrypto, 
          total: amountCrypto*priceCrypto  
        })
      }
      return balancesCrypto
    });
    console.log(balancesCrypto)
    res.send(resposta[0])
  })
  .catch(error => {
    res.status(500).send(error)
    console.error(error)
  })
});

/* GET users listing. */
router.get('/:symbol', function(req, res) {
  req.params.symbol
  res.send('respond with a resource');
});

module.exports = router;