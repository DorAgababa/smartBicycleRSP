import '../App.css'
import { render } from 'react-dom';
import { Sleep, calculateTimeDifferenceInMinutes, downloadImage, getFromLocalStorage, getFromLocalStorageKeyTime, postRequest, removeFromLocalStorage, saveToLocalStorage, slideAllElementToLeft, updateTimestamp } from '../utils';
import AlertCustomeModule from '../components/Alert';
const { AlertCustome,State } = AlertCustomeModule;
import PopUpBox from '../components/PopUpBoxs'
import { createRoot } from 'react-dom/client';
import { Colors, Pages } from '../data/constants';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@mui/material';
import { SetAlert, setPage } from '../App';
import { ShowPop } from '../App';
import startImg from '../images/start_button.png'
import { connectWebSocket, resetCounter } from '../webSocket';

export let socket = null;
export let totalCycles = 0;

function Start() {
  useEffect(() => {
    socket = connectWebSocket();
    resetCounter(socket);
    socket.onmessage = async function(event) {
      totalCycles = JSON.parse(event.data).data; 
      if(totalCycles>=3 && document.querySelector('.startDiv')){
        await slideAllElementToLeft(Colors.DarkColor);setPage(Pages.play)
      }
  };
})

  return (
    <div className='content startDiv' style={{left:0,top:0,display: 'flex' ,  flexDirection:"column",  justifyContent:'center',    alignItems:'center',backgroundColor:Colors.SemiDarkColor, width:"100vw",height:"100vh"}}>
        <img className="startButton" src={startImg} style={{width:"20%", borderRadius:"70%"}}/>
        <Button className='buttonSemiLight' sx={{fontSize:"18px",padding:'5px 15px 5px 15px'}} onClick={async (e)=>{e.preventDefault();await slideAllElementToLeft(Colors.DarkColor);setPage(Pages.play)}}>Start workout</Button>
    </div>
  )
}

export default Start

