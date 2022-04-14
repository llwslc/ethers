import { useState } from 'react';
import { ethers } from 'ethers';
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

      setOuputFullValue(JSON.stringify(abiFull));
      setOuputMinValue(JSON.stringify(abiMini));
    } catch (error) {
      setOuputFullValue('');
      setOuputMinValue('');
    }

    setInputValue(e.target.value);
  };

  return (
    <div className="App">
      <h2>Human-Readable ABI</h2>
      <textarea className="app-main-textarea" value={inputValue} onChange={onInputChange} />
      <h2>FULL</h2>
      <textarea className="app-main-textarea-min" value={outputFullValue} readOnly />
      <h2>MINIMAL</h2>
      <textarea className="app-main-textarea-min" value={outputMinValue} readOnly />
    </div>
  );
}

export default App;
