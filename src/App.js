import React, { Component } from "react";
import "./App.css";
import logo from "./logo.svg";
import web3 from "./web3";
import lottery from "./lottery";

class App extends Component {
    state = {
        manager: "",
        winner: "",
        players: [],
        balance: "",
        value: "",
        message: "",
    };

    async componentDidMount() {
        const manager = await lottery.methods.manager().call();
        const winner = "";
        const players = await lottery.methods.getPlayers().call();
        const balance = await web3.eth.getBalance(lottery.options.address);

        this.setState({ manager, winner, players, balance });
    }

    onSubmit = async (event) => {
        event.preventDefault();

        const accounts = await web3.eth.getAccounts();

        this.setState({ message: "Waiting on transaction success..." });

        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei(this.state.value, "ether"),
        });

        this.setState({ message: "You have been entered!" });
    };

    onClick = async () => {
        const accounts = await web3.eth.getAccounts();
        this.setState({ message: "Waiting on transaction success..." });

        const winner = await lottery.methods.pickWinner().send({
            from: accounts[0],
        });

        console.log(winner);

        this.setState({
            message: "The winner is: " + winner.from,
            winner: winner.from,
        });
    };

    render() {
        console.log(this.state);
        return (
            <div className="App">
                <div className="header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1>Blockchain Lottery</h1>
                    <img src={logo} className="App-logo" alt="logo" />
                </div>
                <hr />
                <div className="data">
                    <h4>
                        This Ethereum smart contract is managed by{" "}
                        {this.state.manager}
                        <br />
                        <br />
                        There are currently {this.state.players.length} people
                        participating
                        <br />
                        <br />
                        Competing to win{" "}
                        {web3.utils.fromWei(this.state.balance, "ether")} Ether
                    </h4>
                </div>
                <br />
                <br />
                <br />
                <form className="form" onSubmit={this.onSubmit}>
                    <h4>Want to try your luck?</h4>
                    <div>
                        <label>Amount of Ether to Enter:</label>
                        <br />
                        <br />
                        <div className="value">
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        Ether
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={this.state.value}
                                    placeholder="Minimum .01 Ether"
                                    onChange={(event) =>
                                        this.setState({
                                            value: event.target.value,
                                        })
                                    }
                                />
                            </div>
                            <button className="btn btn-primary">
                                Enter Lottery
                            </button>
                        </div>
                    </div>
                </form>
                <br />
                <div className="form">
                    <h4>Ready to pick a winner?</h4>
                    <br />
                    <button className="btn btn-primary" onClick={this.onClick}>
                        Pick Winner
                    </button>
                    <br />
                    <br />
                    <h4>{this.state.message}</h4>
                </div>
            </div>
        );
    }
}

export default App;
