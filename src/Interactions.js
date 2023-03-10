import {React , useState, useEffect} from "react";
import './Wallet.css';
//tarnsfer için

const Interactions = (props)=>{
    const [transferHash,setTransferHash]=useState(null);

    const transferHandler=async(e)=>{
        e.preventDefault();
        let transferAmount=e.target.sendAmount.value;
        let receiverAddress=e.target.receiverAddress.value;

        let txt=await props.contract.transfer(receiverAddress,transferAmount);
        setTransferHash(txt.hash);

    }
    return(
        <div className="interactionsCard">
            <form onSubmit={transferHandler}>
                <h3>Transfer Coins</h3>
                <p>Receiver Address </p>
                <input type="text" id="receiverAddress" className="addressInput"/>

                <p>Send Amount</p>
                <input type="number" id="sendAmount" min='0' step='1' />
                <button type="submit"className="button6">Send</button>
                <div>
                    {transferHash}
                </div>
            </form>

        </div>
    )

}

export default Interactions;