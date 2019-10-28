import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import FacebookLogin from "react-facebook-login";
import NavbarApp from "./components/NavbarApp";
import { Card, ListGroup } from "react-bootstrap";
import GoogleLogin from "react-google-login";
import "./App.css";

function Square(props) {
  return (
    <div className="square" onClick={() => props.handleClick(props.id)}>
      {props.value}
    </div>
  );
}

function Board(props) {
  const handleClick = id => {
    if (props.isOver) return;
    const board = props.board.slice();
    const check = board.filter(
      contentInsideEachSquare => !contentInsideEachSquare
    ); // take s snapshot of board !!!!!
    if (!board[id]) {
      board[id] = check.length % 2 ? "X" : "O";
      props.setBoard(board);
    } else {
      alert("Choose an empty square");
      props.setBoard(board);
    }
    // dont use "check" again because "board" has changed
    if (
      board.filter(contentInsideEachSquare => !contentInsideEachSquare)
        .length === 0
    ) {
      props.setIsOver(true);
      return;
    }
    props.setBoard(board);
    if (outcome(board)) {
      props.setWinner(outcome(board));
      props.setIsOver(true);
      props.postData();
    }
  };
  return (
    <div className="board d-flex flex-container">
      {props.board.map((contentInsideEachSquare, index) => {
        return (
          <Square
            value={contentInsideEachSquare}
            id={index}
            handleClick={handleClick}
          />
        );
      })}
    </div>
  );
}

const outcome = board => {
  const winningCases = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
  ];
  // for (let i = 0; i < winningCases.length; i++) {
  //   let [a, b, c] = winningCases[i];
  //   if (board[a] && board[a] === board[b] && board[a] === board[c])
  //     console.log("casa", a, b, c);
  // }

  let winner = null;
  winningCases.map(el => {
    let [a, b, c] = el;
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      winner = board[a];
  });
  return winner;
};

function App() {
  const [board, setBoard] = useState(new Array(9).fill(null));
  const [isOver, setIsOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [listResults, setListResults] = useState(null);

  const retryGame = () => {
    setIsOver(false);
    setWinner(null);
    setBoard(new Array(9).fill(null));
  };

  const responseFB = resp => {
    setCurrentUser({
      name: resp.name,
      email: resp.email
    });
  };

  const responseGoogle = resp => {
    setCurrentUser({
      name: resp.profileObj.givenName,
      email: resp.profileObj.email
    });
  };

  const getData = async () => {
    const url = `https://ftw-highscores.herokuapp.com/tictactoe-dev`;
    const response = await fetch(url);
    const data = await response.json();
    setListResults(data.items);
  };

  const postData = async () => {
    let data = new URLSearchParams();
    data.append("player", currentUser.name);
    data.append("score", -2000000000000065456765456765456765400);
    const url = `https://ftw-highscores.herokuapp.com/tictactoe-dev`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: data.toString(),
      json: true
    });
    const resp = await response.json();
    getData();
  };

  useEffect(() => {
    getData();
  }, []);

  console.log(listResults);
  return (
    <>
      {!currentUser ? (
        <NavbarApp />
      ) : (
        <NavbarApp currentUser={currentUser.name} />
      )}
      <div className="App container d-flex flex-column col-10">
        {!currentUser ? (
          <Card>
            <Card.Header as="h5">Login</Card.Header>
            <Card.Body>
              <Card.Title>Join the #Gato community</Card.Title>
              <Card.Text>Compete with people from all over the world</Card.Text>
              <div className="my-3">
                <FacebookLogin
                  autoLoad={true}
                  appId="466381540638573"
                  fields="name,email,picture"
                  callback={resp => responseFB(resp)}
                  icon="fa-facebook"
                />
              </div>
              <GoogleLogin
                clientId="1089583441585-8eell54m2bujbii2nkh37cdp786cefif.apps.googleusercontent.com"
                buttonText="LOGIN WITH GOOGLE"
                onSuccess={resp => responseGoogle(resp)}
                onFailure={resp => responseGoogle(resp)}
              />
            </Card.Body>
          </Card>
        ) : (
          <>
            {" "}
            <div className="container d-flex flex-row">
              <div>
                <Board
                  board={board}
                  setBoard={setBoard}
                  isOver={isOver}
                  setIsOver={setIsOver}
                  setWinner={setWinner}
                  postData={postData}
                />
                <span className="display-4 my-3">
                  {isOver ? (
                    <span>
                      {winner ? (
                        <span>The winner is {winner}!</span>
                      ) : (
                        <span>Game Over, It's a draw!</span>
                      )}
                    </span>
                  ) : (
                    <span>
                      {board.filter(
                        contentInsideEachSquare => !contentInsideEachSquare
                      ).length % 2
                        ? "X "
                        : "O "}
                      It's your turn.
                    </span>
                  )}
                </span>
                <button className="btn btn-success" onClick={() => retryGame()}>
                  Retry
                </button>{" "}
              </div>
              <div className="my-2">
                <Card style={{ width: "18rem" }}>
                  <Card.Header as="h5">Top Scores</Card.Header>
                  <ListGroup variant="flush">
                    {listResults.map(item => {
                      return (
                        <ListGroup.Item>
                          {item.player} scored {item.score}
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
