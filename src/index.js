import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

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
                key={i}
            />
        );
    }

    renderRow(i) {
        const row = [];

        for(let j = 0; j < 3; j++) {
            row.push(this.renderSquare(i*3 + j));
        }

        return (
            <div
                className="board-row"
                key={i}
            >
                {row}
            </div>
        );
    }
  
    render() {  
        const rows = [];

        for(let i = 0; i < 3; i++) {
            rows.push(this.renderRow(i));
        }

        return (
            <div>
                {rows}
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
            historyNumber: 0,
            turn: 'X',
            reversedMoves: true
        }
    }

    renderReverseButton() {
        return (
            <button 
                className="reverse"
                onClick={() => this.setState({
                    reversedMoves: !this.state.reversedMoves
                })}
            >
                Reverse order
            </button> 
        );
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.historyNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if(checkWinner(squares) || squares[i]) return;

        squares[i] = this.state.turn;

        this.setState({
            history: history.concat([{
                squares
            }]),
            historyNumber: history.length,
            turn: this.state.turn === 'X' ? 'O' : 'X'
        });
    }

    jumpTo(move) {
        this.setState({
            historyNumber: move,
            turn: move % 2 === 0 ? 'X' : 'O'
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.historyNumber];
        const winner = checkWinner(current.squares);
        const moves = history.map((squares, move) => {
            const desc = move ? `Jump to move #${move}` : "Restart game";

            return (
                <li key={move}>
                    <button
                        className="nav"
                        onClick={() => this.jumpTo(move)}
                    >
                        {desc}
                    </button>
                </li>
            );
        });
        let status;
        
        if(winner && winner !== 'D') {
            status = `Winner: ${winner}`;
        } else if(winner === 'D') {
            status = "Draw";
        } else {
            status = `Turn: ${this.state.turn}`;
            document.querySelectorAll(".highlight").forEach(element => {
                element.classList.remove("highlight");
            });
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
                    {this.renderReverseButton()}
                    <ol>{this.state.reversedMoves ? moves.reverse() : moves}</ol>
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
            
            if(streak === 3) {
                highlightSquares(row*3 + col, row*3, 1);

                return player;
            }
        }
    }

    for(let col = 0; col < 3; col++) {
        let player = null;
        let streak = 0;

        for(let row = 0; row < 3; row++) {
            let value = squares[row*3 + col];
            streak = (value === null || player !== value) ? 1 : streak + 1;

            player = value;
            if(streak === 3) {
                highlightSquares(row*3 + col, 0, 3);

                return player;
            }
        }
    }

    for(let i = 0; i < 2; i++) {
        let player = null;
        let streak = 0;

        for(let j = i === 0 ? 0 : 2; j < (i === 0 ? 9 : 8); j += 3 + (i === 0 ? 1 : -1)) {
            let value = squares[j];
            streak = (value === null || player !== value) ? 1 : streak + 1;

            player = value;
            if(streak === 3) {
                highlightSquares(j, i === 0 ? 0 : 2, i === 0 ? 4 : 2);

                return player;
            }
        }
    }

    if(squares.every(square => square != null)) return 'D';

    return null;
}

function highlightSquares(start, condition, iteration) {
    for(let sq = start; sq >= condition; sq -= iteration) {
        document.querySelectorAll(".square")[sq].classList.add("highlight");
    }
}
  
// ========================================
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
  