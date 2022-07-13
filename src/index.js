import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// https://pl.reactjs.org/tutorial/tutorial.html#adding-time-travel
function Square(props) {
    return (
        <button 
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button> 
    );
}
  
class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
  
    render() {  
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            turn: 'X'
        }
    }

    handleClick(i) {
        const history = this.state.history;
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if(checkWinner(squares) || squares[i]) return;

        squares[i] = this.state.turn;

        this.setState({
            history: history.concat([{
                squares
            }]),
            turn: this.state.turn === 'X' ? 'O' : 'X'
        });
    }

    render() {
        const history = this.state.history;
        const current = history[history.length - 1];
        const winner = checkWinner(current.squares);
        const moves = history.map((squares, move) => {
            const desc = move ? `Jump to move #${move}` : "Restart game";

            return (
                <li>
                    <button
                        onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            );
        })
        let status;
        
        if(winner && winner !== 'D') {
            status = `Winner: ${winner}`;
        } else if(winner === 'D') {
            status = "Draw";
        } else {
            status = `Turn: ${this.state.turn}`;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function checkWinner(squares) {
    for(let row = 0; row < 3; row++) {
        let player = null;
        let streak = 0;

        for(let col = 0; col < 3; col++) {
            let value = squares[row*3 + col];
            streak = (value === null || player !== value) ? 1 : streak + 1;

            player = value;
            if(streak === 3) return player;
        }
    }

    for(let col = 0; col < 3; col++) {
        let player = null;
        let streak = 0;

        for(let row = 0; row < 3; row++) {
            let value = squares[row*3 + col];
            streak = (value === null || player !== value) ? 1 : streak + 1;

            player = value;
            if(streak === 3) return player;
        }
    }

    for(let i = 0; i < 2; i++) {
        let player = null;
        let streak = 0;

        for(let j = i === 0 ? 0 : 2; j < (i === 0 ? 9 : 8); j += 3 + (i === 0 ? 1 : -1)) {
            let value = squares[j];
            streak = (value === null || player !== value) ? 1 : streak + 1;

            player = value;
            if(streak === 3) return player;
        }
    }

    if(squares.every(square => square != null)) return 'D';

    return null;
}
  
// ========================================
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
  