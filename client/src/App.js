import './App.css'; //import stylů (to jak to vypadá)
import { useState } from 'react'; // ukládání username a room
import Home from './pages/home'; //import složky jednotlivých stránek
import Chat from './pages/chat';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client'; // propojení se socket.io


const socket = io.connect('http://localhost:4000'); //připojení na port, na kterém poběží server
//const socket = io.connect('http://147.230.152.65:4000');

function App() {
  const [username, setUsername] = useState(''); // uložení userName, které získá z homePage po přihlášení
  const [room, setRoom] = useState(''); // uložení názvu místnosti, do které se přihlašuji

  return (
    <Router>  {/*router - nastavuje cesty ke konkrétnímu adresáři*/}
      <div className='App'>
        <Routes>
          <Route
            path='/'
            element={
              <Home
                username={username}
                setUsername={setUsername}
                room={room}
                setRoom={setRoom}
                socket={socket}
              />
            }
          />
          {/* cesta k chat page */}
          <Route
            path='/chat'
            element={<Chat username={username} room={room} socket={socket} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
