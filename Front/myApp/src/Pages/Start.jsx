import '../App.css'
import { render } from 'react-dom';
import { Sleep, calculateTimeDifferenceInMinutes, downloadImage, getFromLocalStorage, getFromLocalStorageKeyTime, postRequest, removeFromLocalStorage, saveToLocalStorage, slideAllElementToLeft, updateTimestamp } from '../utils';
import AlertCustomeModule from '../components/Alert';
const { AlertCustome,State } = AlertCustomeModule;
import PopUpBox from '../components/PopUpBoxs'
import { createRoot } from 'react-dom/client';
import { Colors, Pages } from '../data/constants';
import { useEffect, useRef, useState } from 'react';
import { Button, Typography } from '@mui/material';
import { SetAlert, setPage } from '../App';
import { ShowPop } from '../App';
import startImg from '../images/start_button.png'
import { connectWebSocket, resetCounter } from '../webSocket';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

export let socket = null;
export let totalCycles = 0;
export let wheelRadius = 0.3
let currentTime;

function growWheel(){
  const wheelRadiusElement = document.querySelector('.wheelRadius');
let radiusValue = parseInt(wheelRadiusElement.textContent, 10);
if(radiusValue==150) return
radiusValue += 5;
wheelRadiusElement.textContent = radiusValue;
wheelRadius=radiusValue/100
}

function shrinkWheel(){
  const wheelRadiusElement = document.querySelector('.wheelRadius');
let radiusValue = parseInt(wheelRadiusElement.textContent, 10);
if(radiusValue==5) return
radiusValue -= 5;
wheelRadiusElement.textContent = radiusValue;
wheelRadius=radiusValue/100
}
function Start() {
  useEffect(() => {
    currentTime = Date.now();
    if(socket == null)
      socket = connectWebSocket();
    resetCounter(socket);
    socket.onmessage = async function(event) {
      totalCycles = JSON.parse(event.data).data * wheelRadius; 
      if(totalCycles>=2 && document.querySelector('.startDiv')){
        if (Date.now()-elapsedTime >= 5000) {
          currentTime = Date.now();
          totalCycles = 0;
        } else {
          await slideAllElementToLeft(Colors.DarkColor);setPage(Pages.play)
        }
      }
  };
})

  return (
    <div className='content startDiv' style={{left:0,top:0,display: 'flex' ,  flexDirection:"column",  justifyContent:'center',    alignItems:'center',backgroundColor:Colors.SemiDarkColor, width:"100vw",height:"100vh"}}>
            <div style={{ top: '20px', left: '50px', position: 'absolute',alignItems:'center', display:'inline-flex'}}>
        <Button className='buttonLight' sx={{ padding:'14px' ,fontWeight:600,fontSize:'18px'}} onClick={shrinkWheel}><RemoveCircleIcon></RemoveCircleIcon></Button>
        <div style={{textAlign:'center', padding:'25px',display:'flex',flexDirection:'column',fontSize:'24px',fontWeight:700}}><div>Wheel Radius (cm)</div><div className='wheelRadius'>30</div></div>
        <Button className='buttonLight' sx={{ padding:'14px' ,fontWeight:600,fontSize:'18px'}} onClick={growWheel}><AddCircleIcon></AddCircleIcon></Button>
      </div>

        <img className="startButton" src={startImg} onClick={async (e)=>{e.preventDefault();await slideAllElementToLeft(Colors.DarkColor);setPage(Pages.play)}} style={{width:"30%", borderRadius:"70%"}}/>
        <Button className='buttonSemiLight' sx={{fontSize:"24px",padding:'5px 15px 5px 15px'}} onClick={async (e)=>{e.preventDefault();await slideAllElementToLeft(Colors.DarkColor);setPage(Pages.play)}}>Start workout</Button>
    </div>
  )
}

export default Start

