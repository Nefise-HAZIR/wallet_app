import { React, useState, useEffect } from "react";
import { ethers } from "ethers";
import './Wallet.css';
import simple_token_abi from './Contracts/simple_token_abi.json';
import Interactions from './Interactions';

const Wallet = () => {
  const contractAddress = '0x574c1a429B0B24f961e4B6DF59304B130EFA3b94';
  const [tokenName, setTokenName] = useState("Token");
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);


  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(result => {
          accountChangedHandler(result[0]);
          setConnButtonText('Wallet Connected');
        })
    } else {
      setErrorMessage('Please install MetaMask');
    }
  }
  const accountChangedHandler = (newAddress) => {
    setDefaultAccount(newAddress);
    updateEthers();
  }
  const updateEthers = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    let tempSigner = tempProvider.getSigner();
    let tempContract = new ethers.Contract(contractAddress, simple_token_abi, tempSigner);

    setProvider(tempProvider);
    setSigner(tempSigner);
    setContract(tempContract);
  }

  useEffect(() => {
    if (contract != null) {
      updateBalance();
      updateTokenName();
    }
  }, [contract]);

  const updateBalance = async () => {
    let balanceBigN = await contract.balanceOf(defaultAccount);
    let balanceNumber = balanceBigN.toString();

    let decimals = await contract.decimals();

    let tokenBalance = balanceNumber / Math.pow(10, decimals);

    setBalance(tokenBalance);
    console.log(tokenBalance);
  }

  const updateTokenName = async () => {
    setTokenName(await contract.name());
  }


  return (
    <div className="general">
      <div className="text">
         Send {tokenName} easily across the world
      </div> 
      <div className="wallet">
        <h2 className="header">{tokenName + " Wallet"}</h2>
        <button className="button6" onClick={connectWalletHandler}>{connButtonText}</button>

        <div className="walletCard">
          <div>
            <h3>Address: {defaultAccount}</h3>
          </div>
          <div>
            <h3>{tokenName} Balance: {balance}</h3>
          </div>
          {errorMessage}
        </div>
        <Interactions contract={contract} />
      </div>
    </div>


  );
}

export default Wallet;