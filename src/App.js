import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';
import Web3 from 'web3/dist/web3.min.js';
import './App.css';

function App(props) {
  const [inputValue, setInputValue] = useState('');
  const [outputFullValue, setOuputFullValue] = useState('');
  const [outputItfValue, setOutputItfValue] = useState('');
  const [outputMinValue, setOuputMinValue] = useState('');
  const [functionValue, setFunctionValue] = useState('');
  const [encodeValue, setEncodeValue] = useState('');
  const [encodeResValue, setEncodeResValue] = useState('');
  const [decodeValue, setDecodeValue] = useState('');
  const [decodeResValue, setDecodeResValue] = useState('');

  const formatJSON = _ => {
    return prettier.format(JSON.stringify(_), {
      parser: 'json',
      plugins: [parserBabel]
    });
  };

  const onAbiInputChange = e => {
    const abiStr = e.target.value;

    try {
      const jsonAbi = JSON.parse(abiStr);
      const iface = new ethers.utils.Interface(jsonAbi);
      const abiFull = iface.format(ethers.utils.FormatTypes.full);
      const abiMini = iface.format(ethers.utils.FormatTypes.minimal);

      setOuputFullValue(formatJSON(abiFull));
      setOutputItfValue(`interface ItfSol {
    ${abiFull
      .map(_ => {
        if (_.includes('function ')) {
          if (_.includes('returns')) {
            _ = _.replace('returns', 'external returns');
          } else {
            _ = `${_} external`;
          }
        }
        return _;
      })
      .join(';\n    ')};
}`);
      setOuputMinValue(formatJSON(abiMini));
    } catch (error) {
      setOuputFullValue('');
      setOutputItfValue('')
      setOuputMinValue('');
    }

    setInputValue(e.target.value);
  };

  const trimStr = _ => _.replace(/^\s+|\s+$/g, '');

  const onFuncInputChange = e => {
    setFunctionValue(trimStr(e.target.value));
  };

  const onEncodeInputChange = e => {
    setEncodeValue(trimStr(e.target.value));
  };

  const onDecodeInputChange = e => {
    setDecodeValue(trimStr(e.target.value));
  };

  useEffect(() => {
    const encodeRaw = () => {
      if (!functionValue) return;
      if (!encodeValue) return;

      let res = '';

      try {
        const itf = new ethers.utils.Interface([`function ${functionValue.replace(/^function\s/, '')}`]);
        res = itf.encodeFunctionData(itf.fragments[0], JSON.parse(encodeValue));
      } catch (error) {
        res = error.message ? error.message : error;
      }

      setEncodeResValue(res);
    };

    const decodeRaw = () => {
      if (!functionValue) return;
      if (!decodeValue) return;

      let res = '';

      try {
        const itf = new ethers.utils.Interface([`function ${functionValue.replace(/^function\s/, '')}`]);
        res = itf.decodeFunctionData(itf.fragments[0], `0x${decodeValue.replace('0x', '')}`);
        res = formatJSON(res);
      } catch (error) {
        res = error.message ? error.message : error;
      }

      setDecodeResValue(res);
    };

    encodeRaw();
    decodeRaw();
  }, [functionValue, encodeValue, decodeValue]);

  useEffect(() => {
    window.ethers = ethers;
    window.Web3 = Web3;
    if (window.ethereum) {
      window.provider = new ethers.providers.Web3Provider(window.ethereum);
      window.web3 = new Web3(window.ethereum);
    }
  }, []);

  return (
    <div className="App">
      <h2>Human-Readable ABI</h2>
      <textarea className="app-main-textarea" value={inputValue} onChange={onAbiInputChange} />
      <h2>FULL</h2>
      <textarea className="app-main-textarea-min" value={outputFullValue} readOnly wrap="off" />
      <h2>INTERFACE</h2>
      <textarea className="app-main-textarea-min" value={outputItfValue} readOnly wrap="off" />
      <h2>MINIMAL</h2>
      <textarea className="app-main-textarea-min" value={outputMinValue} readOnly wrap="off" />
      <h2>FUNCTION</h2>
      <textarea className="app-main-textarea-line" value={functionValue} onChange={onFuncInputChange} />
      <h2>ENCODE</h2>
      <div className="app-main-encode">
        <textarea className="app-main-textarea-min" value={encodeValue} onChange={onEncodeInputChange} />
        <textarea className="app-main-textarea-min" value={encodeResValue} readOnly wrap="off" />
      </div>
      <h2>DECODE</h2>
      <div className="app-main-encode">
        <textarea className="app-main-textarea-min" value={decodeValue} onChange={onDecodeInputChange} />
        <textarea className="app-main-textarea-min" value={decodeResValue} readOnly wrap="off" />
      </div>
    </div>
  );
}

export default App;
