import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Web3 from "web3/dist/web3.min.js";
import './App.css';

function App(props) {
  const [inputValue, setInputValue] = useState('');
  const [outputFullValue, setOuputFullValue] = useState('');
  const [outputMinValue, setOuputMinValue] = useState('');

  const onInputChange = e => {
    const abiStr = e.target.value;

    try {
      const jsonAbi = JSON.parse(abiStr);
      const iface = new ethers.utils.Interface(jsonAbi);
      const abiFull = iface.format(ethers.utils.FormatTypes.full);
      const abiMini = iface.format(ethers.utils.FormatTypes.minimal);
      const formatABI = abi => {
        return JSON.stringify(abi).replace(/","/g, '",\n  "').replace(/^\[/g, '[\n  ').replace(/\]$/g, '\n]');
      };

      setOuputFullValue(formatABI(abiFull));
      setOuputMinValue(formatABI(abiMini));
    } catch (error) {
      setOuputFullValue('');
      setOuputMinValue('');
    }

    setInputValue(e.target.value);
  };

  useEffect(() => {
    window.ethers = ethers
    window.Web3 = Web3
    if (window.ethereum) {
      window.provider = new ethers.providers.Web3Provider(window.ethereum);
      window.web3 = new Web3(window.ethereum);
    }
  }, [])

  return (
    <div className="App">
      <h2>Human-Readable ABI</h2>
      <textarea className="app-main-textarea" value={inputValue} onChange={onInputChange} />
      <h2>FULL</h2>
      <textarea className="app-main-textarea-min" value={outputFullValue} readOnly wrap="off" />
      <h2>MINIMAL</h2>
      <textarea className="app-main-textarea-min" value={outputMinValue} readOnly wrap="off" />
    </div>
  );
}

export default App;
