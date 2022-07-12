import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button 
            className="square"
            onClick={props.onClick}
        >

        </button> 
    );
}
  
class Board extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            squares: Array(9).fill(null),
            turn: 'X'
        };
    }

    renderSquare(i) {
        return (
            <Square
                value={this.state.squares[i]}
                onClick={() => this.handleClick(i)}
            />
        );
    }

    handleClick(i) {
        const squares = this.state.squares.slice();

        if(checkWinner(squares) || squares[i]) return;

        squares[i] = this.state.turn;

        this.setState({
            squares,
            turn: this.state.turn === 'X' ? 'Y' : 'X'
        });
    }
  
    render() {
        const winner = checkWinner(this.state.squares);
        let status;
        
        if(winner) {
            status = `Winner: ${winner}`;
        } else {
            status = `Turn: ${this.state.turn}`;
        }
  
        return (
            <div>
            <div className="status">{status}</div>
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
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

function checkWinner(squares) {
    for(let row = 0; row < 3; row++) {
        let player = '-';
        let streak = 0;

        for(let col = 0; col < 3; col++) {
            let value = squares[row*3 + col];
            streak = (value === null || player !== value) ? 1 : streak + 1;

            player = value;
            if(streak === 3) return player;
        }
    }

    for(let col = 0; col < 3; col++) {
        let player = '-';
        let streak = 0;

        for(let row = 0; row < 3; row++) {
            let value = squares[row*3 + col];
            streak = (value === null || player !== value) ? 1 : streak + 1;

            player = value;
            if(streak === 3) return player;
        }
    }

    for(let i = 0; i < 2; i++) {
        for(let row = 0; row < 3; row++) {
            for(let col = 0; col < 3; col++) {
                let player = '-';
                let streak = 0;

                for(let tempCol = col, tempRow = row; tempCol < 3 && tempRow < 3; i === 0 ? tempCol++ : tempCol--, tempRow++) {
                    let value = squares[tempRow*3 + tempCol];
                    streak = (value === null || player !== value) ? 1 : streak + 1;

                    player = value;
                    if(streak === 3) return player;
                }
            }
        }
    }

    return null;
}
  
// ========================================
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
  