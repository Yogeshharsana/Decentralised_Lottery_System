import { useState,useEffect } from 'react'
import './styles.css'
// import './contract.js'
// import './script.js'
import abi from './Lottery.json'
import { ethers } from 'ethers'
function App() {
  const [state,setState]=useState({
    provider:null,
    signer:null,
    contract:null
  })
  const [account,setAccount]=useState('Not connected');
  useEffect(()=>{
    const template=async()=>{

      const contractAddres="0x7c86f4e15291cdfc809b3b30832109f80076d161";
      const contractABI=abi.abi;
      //Metamask part
      //1. In order do transactions on goerli testnet
      //2. Metmask consists of infura api which actually help in connectig to the blockhain
      try{

        const {ethereum}=window;
        const account = await ethereum.request({
          method:"eth_requestAccounts"
        })

        window.ethereum.on("accountsChanged",()=>{
        window.location.reload()
        })
        setAccount(account);
        const provider = new ethers.providers.Web3Provider(ethereum);//read the Blockchain
        const signer =  provider.getSigner(); //write the blockchain
        
        const contract = new ethers.Contract(
          contractAddres,
          contractABI,
          signer
        )
        console.log(contract)
      setState({provider,signer,contract});
      
      }catch(error){
        console.log(error)
      }
    }
    template();
  },[])
  const joinLottery = async () => {
    try {
      const tx = await state.contract.join({ value: ethers.utils.parseEther(value) });
      await tx.wait();
      console.log('Joined the lottery successfully!');
      // Display a success message on the page
      document.getElementById('output').textContent = 'Joined the lottery successfully!';
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const getPricePool = async () => {
    try {
      const pricePool = await state.contract.getPricePool();
      console.log('Price Pool:', ethers.utils.formatEther(pricePool));
      // Display the price pool on the page
      document.getElementById('output').textContent = `Price Pool: ${ethers.utils.formatEther(pricePool)} ETH`;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const pickWinner = async () => {
    try {
      const tx = await state.contract.pickWinner();
      await tx.wait();
      const winner = await state.contract.winner();
      console.log('Winner:', winner);
      // Display the winner's address on the page
      document.getElementById('winnerStatus').textContent = `Winner: ${winner}`;
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    
      // <body className="Body">
    <div className="Body">
    <div className="firstdiv">
        <div className="firstsubdiv">
            <p id="welcome-text">Welcome to Decentralized Lottery System.</p>
        </div>
    </div>
    <section className="main-section">
        <div className="Main-div">
            <p className="account"></p>
            <p className="main-text"> Dream, Play, Win: Your Jackpot Awaits!</p>
            <p>Connected Account - {account}</p>
            <input type="text" name="value" id="value"placeholder="Enter value in ETH" ></input>
            <button id="join-btn" onClick={joinLottery} >Join</button>

            
            <button id="announceButton" onClick={pickWinner}>Announce Winner</button>
            
        </div>
    </section>

    </div>
    
  )
}

export default App
