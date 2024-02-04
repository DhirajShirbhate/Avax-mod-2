import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";


export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, put_balance] = useState(undefined);
  const [tx_History, put_tx_History] = useState([]);

  
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;


  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  }

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  }

  const connectAccount = async () => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  }

  const fetch_balance = async () => {
    if (atm) {
      const newBalance = await atm.fetch_balance();
      put_balance(newBalance.toString());
    }
  }

  const deposit = async () => {
    if (atm) {
      let agreement = await atm.deposit(1);
      await agreement.wait();
      fetch_balance();
      fetch_tx_History();
    }
  }

  const withdraw = async () => {
    if (atm) {
      let agreement = await atm.withdraw(1);
      await agreement.wait();
      fetch_balance();
      fetch_tx_History();
    }
  }




  const fetch_tx_History = async () => {
    if (atm) {
      const history = await atm.fetch_tx_History();
      const formattedHistory = history.map(agreement => ({
        from: agreement.from.toString(),
        amount: agreement.amount.toNumber(),
        timestamp: agreement.timestamp.toNumber(),
      }));
      put_tx_History(formattedHistory);
    }

  }

  const initUser = () => {
    if (!ethWallet) {
      
      <p>Welcome to Metacrafters DEFI ATM</p>
      return <p style={{textAlign:"center"}}>Please install Metamask in order to use this ATM.</p>
    }

    if (!account) {
      return <div style={{position:""}}>
        <div>
          <p  style={{textAlign:"center", fontSize:"2vh"}}>Please connect your Metamask account to use this ATM.</p>
       
      
        </div>

        <div style={{position:"center"}}>
          <center>
        <button onClick={connectAccount} style={{ 
        backgroundColor: '#fff',
        
       color: '#E8831D',
       fontWeight: 'bold',
        fontSize: '18px',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
       }}>
            <img src="https://blui.io/wp-content/uploads/2023/07/metamask-icon.svg" alt="MetaMask Icon" style={{ width: '20px',
        height: '20px',
        marginRight: '10px'}} />
            Connect MetaMask
        </button>
       </center>
       </div>
      
      </div>

      
    }

    if (balance === undefined) {
      fetch_balance();
    }

    return (
      <div className="main" >
        
        <p style={{textAlign:"center", fontWeight:"bold"}}>Your Account: {account}</p>
        
        <p style={{textAlign:"center", fontWeight:"bold"}}>Your Balance: {balance}</p>
        <hr >
        </hr>
        <h2 style={{textAlign:"center"}}>Token deposition section </h2>

        <center>
          <button style={{backgroundColor: '#fff',
        fontWeight: 'bold',
         fontSize: '18px',
         padding: '10px 20px',
         border: 'none',
         borderRadius: '5px',
         cursor: 'pointer',
         display: 'flex',
         justifyContent: 'center',
         }} onClick={deposit}>Deposit 1 ETH</button>

</center>
<p></p>
        <hr >
        </hr>
        <h2 style={{textAlign:"center"}}>Token withdraw section </h2>
<center>
<button style={{backgroundColor: '#fff',
        fontWeight: 'bold',
         fontSize: '18px',
         padding: '10px 20px',
         border: 'none',
         borderRadius: '5px',
         cursor: 'pointer',
         display: 'flex',
         justifyContent: 'center',
         }} onClick={withdraw}>Withdraw 1 ETH</button>
</center>
        <hr >
        </hr>
        
      
        
     
        <h2 style={{textAlign:"center"}}>Transaction History</h2>
        <br></br>
        <div style={{textAlign:"center"}}>
        <ul style={{listStyle:"none"}}>
          {tx_History.map((agreement, index) => (
            <li key={index} style={{'::before': { content: '"✔"', marginRight: '5px' , fontWeight:"bold", fontSize:"1.5vh"} }}>
            From: {agreement.from}, Amount: {agreement.amount}, Timestamp: {agreement.timestamp}
            </li>
       
          ))}
               <br></br>
        </ul>
        </div>
      </div>
    )
  }

  useEffect(() => { getWallet(); }, []);

  return (

    <div className="bo">
      <div style={{ backgroundImage: `url('./background.jpg')`}}></div>
      <h1 style={{padding:"12vh"}}></h1>
    <main className="container">
    
      <header><h1>Welcome Dhiraj Shirbate</h1></header>
      {initUser()}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800&display=swap');

        *,
        *::before,
        *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Comfortaa', cursive;
        }
          .bo{
          padding: 100vh;
          background-color: #EDBB99 ;
        }
        .container {
          background-color:#EDBB99 ;
          text-align: center
          border: 5px solid;
          margin: auto;
          width: 50%;
          padding: 10px;
          border-radius: 10px;          
         
        }
        h1{
          padding: 10px;
          text-align: center;
          font-size: 5vh;
         }

        p{
          padding: 10px;
          text-align: center;
        }
        .body{
          background-color: #85C1E9 ;
 
        }
        .main{
          background-color: #85C1E9 ;
          border: 3px solid black;

   
        }
        p{
          padding: 10px;
          text-align: center;
        
        }

      `}
      </style>
    </main>
    </div>
  )
} 