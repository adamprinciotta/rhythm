import React, { Component } from "react";
import Gamepad from "react-gamepad";
import { Howl, Howler } from "howler";
import { Container, Row, Col } from "react-bootstrap";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    //
    this.state = {
      score: 0,
      notes: [],
      gamepadConnected: false,
      gamepadIndex: null,
      gamepadButtons: {
        Up: false,
        Down: false,
        Left: false,
        Right: false,
        A: false,
        B: false,
        X: false,
        Y: false,
        RB: false,
        RT: false,
        LB: false,
        LT: false,
        DPADUP: false,
        DPADDOWN: false,
        DPADLEFT: false,
        DPADRIGHT: false
      },
    };

  //Will likely get rid of these three eventually
    //Sets timer for the notes
    this.noteTimer = null;
    //Sets noteSpeed
    this.noteSpeed = 5;
    //Sets the number of milliseconds between notes
    this.noteFrequency = 1000;

    //sets handlers for gamepad interactions
    this.handleGamepadConnect = this.handleGamepadConnect.bind(this);
    this.handleGamepadDisconnect = this.handleGamepadDisconnect.bind(this);
    this.handleGamepadButtonChange = this.handleGamepadButtonChange.bind(this);
  }

  
  componentDidMount() {
    this.noteTimer = setInterval(() => {
      const { notes } = this.state;

      //Sets the button offsets to referense for lining up with the corresponding input
      const buttonToElementMap = {
        up: "upEl",
        down: "downEl",
        left: "leftEl",
        right: "rightEl",
        K: "kickEl",
        HS: "heavySlashEl",
        P: "punchEl",
        S: "slashEl",
        Dust: "r1El",
        Dash: "r2El",
        FD: "l1El",
        RC: "l2El",
      };

      //Creates the note
      const note = {
        // id: Date.now(),

        //Buttons on the controller that will match the end point
        button: [
          "up",
          "down",
          "left",
          "right",
          "K",
          "HS",
          "P",
          "S",
          "Dust",
          "Dash",
          "FD",
          "RC",
        ]
        //Currently just have it randomly select from this list for testing purposes
        [Math.floor(Math.random() * 12)],
        // position: -100,
        //Tracks if it hit or not
        hit: false,
      };

      //Gets the offset from above and matches it horizontally with the corresponding end point
      note.left = this[buttonToElementMap[note.button]].offsetLeft

      //Adds the note to the array
      notes.push(note);
      //Sets the state to update the array
      this.setState({ notes });

    }, this.noteFrequency); //Creates a new note at the noteFrequency

    //Howler volume to 1, will test with the volume/sounds later
    Howler.volume(1);
  }

  //When the component unmounts, it clears the timer interveral
  componentWillUnmount() {
    clearInterval(this.noteTimer);
  }

  //When the gamepad is detected as connected, it updates the state accordingly
  handleGamepadConnect(gamepadIndex) {
    this.setState({ gamepadConnected: true, gamepadIndex });
  }

  //When the gamepad is detected as disconnected, it updates the state accordingly
  handleGamepadDisconnect() {
    this.setState({ gamepadConnected: false, gamepadIndex: null });
  }

  // @param buttonName: The name of the button, down: boolean of if the button is pressed down or not
  //When a button is pressed or released, it updates the gameButtons state object with the corresponding buttonName and sets it to down or up
  handleGamepadButtonChange(buttonName, down) {
    const { gamepadButtons } = this.state;

    gamepadButtons[buttonName] = down;

    console.log("BUTTON NAME: " + buttonName);

    this.setState({ gamepadButtons });
  }

  render() {
    const { notes, gamepadConnected, gamepadButtons } = this.state;

    return (
      <Gamepad
        onConnect={this.handleGamepadConnect}
        onDisconnect={this.handleGamepadDisconnect}
        onButtonChange={this.handleGamepadButtonChange}
      >
        <Container className="game-container">
          <Row>
            <Col md={{ span: 6, offset: 3 }}>
              <div className="game-area">
                <div className="gameButtons">
                  <div className="game-element up" ref={(el) => (this.upEl = el)}>Up</div>
                  <div className="game-element down" ref={(el) => (this.downEl = el)}>Down</div>
                  <div className="game-element left" ref={(el) => (this.leftEl = el)}>Left</div>
                  <div className="game-element right" ref={(el) => (this.rightEl = el)}>Right</div>
                  <div className="game-element kick" ref={(el) => (this.kickEl = el)}>K</div>
                  <div className="game-element heavySlash" ref={(el) => (this.heavySlashEl = el)}>HS</div>
                  <div className="game-element punch" ref={(el) => (this.punchEl = el)}>P</div>
                  <div className="game-element slash" ref={(el) => (this.slashEl = el)}>S</div>
                  <div className="game-element r1" ref={(el) => (this.r1El = el)}>D</div>
                  <div className="game-element r2" ref={(el) => (this.r2El = el)}>Dash</div>
                  <div className="game-element l1" ref={(el) => (this.l1El = el)}>FD</div>
                  <div className="game-element l2" ref={(el) => (this.l2El = el)}> RC</div>
                </div>

                {notes.map((note, index) => (
                  <div
                    // key={note.id}
                    className={`game-note ${note.button}`}
                    style={{ left: note.left }}
                  >
                    {note.button}
                  </div>
                ))}
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={{ span: 6, offset: 3 }}>
              <div className="game-info">
                <div>Score: {this.state.score}</div>
                {gamepadConnected ? (
                  <div>Gamepad connected</div>
                ) : (
                  <div>Gamepad disconnected</div>
                )}
                <div>Buttons: {JSON.stringify(gamepadButtons)}</div>
              </div>
            </Col>
          </Row>
        </Container>
      </Gamepad>
    );
  }
}

export default App;




//Extra potential approaches for later use

// import React, { useState, useEffect } from "react";
// import "./App.css";

// function App() {
//   const [notes, setNotes] = useState([]);
//   const [score, setScore] = useState(0);
//   const [gamepadIndex, setGamepadIndex] = useState(null);
//   const [gamepadButtons, setGamepadButtons] = useState([]);

//   useEffect(() => {
//     // Initialize the gamepad state
//     window.addEventListener("gamepadconnected", handleGamepadConnected);
//     window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);

//     // Start the game loop
//     const loopId = setInterval(() => {
//       setNotes((notes) => {
//         // Move the notes down by one step
//         return notes.map((note) => {
//           return { ...note, y: note.y + 1 };
//         });
//       });
//     }, 10);

//     // Clean up when the component unmounts
//     return () => {
//       window.removeEventListener("gamepadconnected", handleGamepadConnected);
//       window.removeEventListener(
//         "gamepaddisconnected",
//         handleGamepadDisconnected
//       );
//       clearInterval(loopId);
//     };
//   }, []);

//   useEffect(() => {
//     // Check for correct button presses
//     notes.forEach((note) => {
//       if (note.y > 360 && note.y < 380) {
//         const buttonIndex = gamepadButtons.indexOf(note.button);
//         if (
//           buttonIndex !== -1 &&
//           navigator.getGamepads()[gamepadIndex].buttons[buttonIndex].pressed
//         ) {
//           setScore((score) => score + 1);
//         } else {
//           setScore((score) => score - 1);
//         }
//         setNotes((notes) => notes.filter((n) => n !== note));
//       }
//     });
//   }, [notes, gamepadButtons, gamepadIndex]);

//   function handleGamepadConnected(event) {
//     setGamepadIndex(event.gamepad.index);
//     setGamepadButtons(
//       event.gamepad.buttons.map((button) => button.value > 0.1)
//     );
//   }

//   function handleGamepadDisconnected(event) {
//     setGamepadIndex(null);
//     setGamepadButtons([]);
//   }

//   function handleButtonDown(buttonIndex) {
//     if (
//       gamepadIndex !== null &&
//       gamepadButtons[buttonIndex] &&
//       notes.length > 0
//     ) {
//       const note = notes[0];
//       const noteButtonIndex = gamepadButtons.indexOf(note.button);
//       if (noteButtonIndex === buttonIndex) {
//         setScore((score) => score + 1);
//       } else {
//         setScore((score) => score - 1);
//       }
//       setNotes((notes) => notes.slice(1));
//     }
//   }

//   // Generate some random notes
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       const button = Math.floor(Math.random() * 4); // Generate a random button index (0-3)
//       const note = { button, y: -30 };
//       setNotes((notes) => [...notes, note]);
//     }, 1000);
//     return () => clearInterval(intervalId);
//   }, []);

//   return (
//     <div className="rhythm-game">
//       <div className="note-container">
//         {notes.map((note, index) => (
//           <div
//             key={index}
//             className="note"
//             style={{ left: `${note.button * 25 + 5}%`, top: `${note.y}px` }}
//           />
//         ))}
//       </div>
//       <div className="score-container">
//         <span className="score-label">Score:</span>
//         <span className="score-value">{score}</span>
//       </div>
//       <div className="button-container">
//         <div className="button" onClick={() => handleButtonDown(0)}>
//           Button 1
//         </div>
//         <div className="button" onClick={() => handleButtonDown(1)}>
//           Button 2
//         </div>
//         <div className="button" onClick={() => handleButtonDown(2)}>
//           Button 3
//         </div>
//         <div className="button" onClick={() => handleButtonDown(3)}>
//           Button 4
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

//OTHER POTENTIAL USEFUL CODE
// import React, { useState, useEffect } from "react";

// function App() {
//   const [notes, setNotes] = useState([]);
//   const [score, setScore] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       // Create a new note with a random button index (0-3) and corresponding letter
//       const buttonIndex = Math.floor(Math.random() * 4);
//       const buttonLetter = ["A", "B", "X", "Y"][buttonIndex];
//       const note = { buttonIndex, buttonLetter, top: 0 };
//       setNotes((notes) => [...notes, note]);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   function handleButtonDown(buttonIndex) {
//     // Check if there is a note in the correct range with the matching button index
//     const noteIndex = notes.findIndex(
//       (note) => note.buttonIndex === buttonIndex && note.top >= 70 && note.top <= 80
//     );

//     if (noteIndex !== -1) {
//       // Remove the note from the array and update the score
//       const newNotes = [...notes];
//       newNotes.splice(noteIndex, 1);
//       setNotes(newNotes);
//       setScore((score) => score + 1);
//     } else {
//       // Incorrect button press, decrease the score
//       setScore((score) => Math.max(score - 1, 0));
//     }
//   }

//   return (
//     <div className="rhythm-game">
//       <div className="note-container">
//         {notes.map((note, index) => (
//           <div key={index} className="note" style={{ top: note.top }}>
//             {note.buttonLetter}
//           </div>
//         ))}
//       </div>
//       <div className="score-container">Score: {score}</div>
//       <div className="button-container">
//         <div className="button" onClick={() => handleButtonDown(0)}>
//           A
//         </div>
//         <div className="button" onClick={() => handleButtonDown(1)}>
//           B
//         </div>
//         <div className="button" onClick={() => handleButtonDown(2)}>
//           X
//         </div>
//         <div className="button" onClick={() => handleButtonDown(3)}>
//           Y
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
