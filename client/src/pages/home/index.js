import styles from './styles.module.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; //umí přesměrování na jinou stránku

    const Home = ({ username, setUsername, room, setRoom, socket }) => { //pracuje s hodnotami userName, room, socket
    const [roomUsers, setRoomUsers] = useState([]);
  
    //const [roomUsers, setRoomUsers] = useState([]);
    const navigate = useNavigate(); //místo pro přesměrování
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
      socket.on('chatroom_users', (data) => {
        console.log(data);
        setRoomUsers(data);
      });
  
      return () => socket.off('chatroom_users');
    }, [socket]);

    useEffect(() => {
      socket.on('clearParams', (data) => {
        setUsername('');
        setRoom('');
      });
  
      return () => socket.off('clearParams');
    }, [socket]);


    // Callback, který realizuje přihlášení po zadání jména a místnosti
    const joinAttempt = () => {
      setErrorMessage('');
      setRoomUsers([]);
      socket.emit('join_attempt', { username, room });

      if (roomUsers.includes(username)) {          
        setErrorMessage('Username is already taken in this room');          
      } else {
        joinRoom();
      } 

      /*if (room !== '' && username !== '') {
          socket.emit('join_room', { username, room }); //posílá událost na server
          navigate('/chat', { replace: true });
        } else {
            setErrorMessage('Username and room must not be empty');
        } 
      */

    };

    const joinRoom = () =>{
      if (room !== '' && username !== '') {
        socket.emit('join_room', { username, room }); //posílá událost na server
        navigate('/chat', { replace: true });  
      } else if (username.length < 3) {
        setErrorMessage('Username must have at least three characters');
        setUsername('');
      } else {
        setErrorMessage('Username and room must not be empty');
      }
    }
  
  
    return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1>{`My chat rooms`}</h1>
        
        {/*input, čeká až něco zadám - jméno*/}
        <input 
            className={styles.input}
            placeholder='Username...' 
            onChange={(e) => setUsername(e.target.value)} //při změně uloží novou hodnotu jména
        />

        {/*//možnosti výběru místností*/}
        <select 
            className={styles.input}
            onChange={(e) => setRoom(e.target.value)} // při změně uloží novou hodnotu místnosti
        >
            <option>-- Select Room --</option>
          <option value='Room 1'>Room 1</option>
          <option value='Room 2'>Room 2</option>
          <option value='Room test'>Room test</option>
        </select>

        {/*//tlačítko pro přihlášení do místnosti*/}
        <button
            className='btn btn-secondary joinBtn'
            style={{ width: '100%' }}
            onClick={joinAttempt} // po kliknutí odkáže na callback přihlášení
        >Join Room</button>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      </div>
    </div>
  );
};

export default Home;