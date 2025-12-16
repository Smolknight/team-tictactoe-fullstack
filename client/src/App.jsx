// src/App.jsx
import Game from './components/Game/Game'
let christmas = new Audio("clientsrcaudiochristmas-music-448322.mp3");
christmas.play()
function App() {
  return (
    <div className="app">
      <Game />

    </div>
  );
}

export default App
