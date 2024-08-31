import '../App.css'
import { useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import startImg from '../images/start_button.png';
import { setPage } from '../App';
import { Colors, Pages } from '../data/constants';
import { connectWebSocket, resetCounter } from '../webSocket';
import { slideAllElementToLeft } from '../utils';

export let socket = null;
export let totalCycles = 0;
export let saved_cyclesss = 0;
let currentTime;

function Start() {
  const [wheelDiameter, setWheelDiameter] = useState(30); // Initialize with 30 instead of 0.3
  const [open, setOpen] = useState(false);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function growWheel() {
    if (wheelDiameter < 150) {
      setWheelDiameter(wheelDiameter + 5);
    }
  }

  function shrinkWheel() {
    if (wheelDiameter > 5) {
      setWheelDiameter(wheelDiameter - 5);
    }
    console.log(wheelDiameter)
  }

  useEffect(() => {
    currentTime = Date.now();
    if (socket == null)
      socket = connectWebSocket();
    resetCounter(socket);
    socket.onmessage = async function (event) {
      totalCycles = JSON.parse(event.data).data * (3.14 * (wheelDiameter / 100)); 
      saved_cyclesss = JSON.parse(event.data).data;
      if (totalCycles >= 2 && document.querySelector('.startDiv')) {
        if (Date.now() - elapsedTime >= 3000) {
          currentTime = Date.now();
          totalCycles = 0;
          saved_cyclesss = 0;
        } else {
          await slideAllElementToLeft(Colors.DarkColor);
          setPage(Pages.play);
        }
      }
    };
  });

  return (
    <div className='content startDiv' style={{ left: 0, top: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.SemiDarkColor, width: '100vw', height: '100vh',position: 'relative' }}>
      
      <div className ='buttonSemiLight' style={{top: '20px', right: '20px', position: 'absolute',alignItems:'center', display:'inline-flex'}}>
      <IconButton onClick={handleClickOpen} >
          <SettingsIcon fontSize= 'large' />
        </IconButton>
      </div>
      
      

      <img className="startButton" src={startImg} onClick={async (e) => { e.preventDefault(); await slideAllElementToLeft(Colors.DarkColor); setPage(Pages.play); }} style={{ width: '40%', borderRadius: '70%' }} />
      <Button className='buttonSemiLight' sx={{ fontSize: '48px', padding: '20px 40px' }} onClick={async (e) => { e.preventDefault(); await slideAllElementToLeft(Colors.DarkColor); setPage(Pages.play); }}>Start workout</Button>

      

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Adjust Wheel Diameter</DialogTitle>
        <DialogContent>
          <div style={{ alignItems: 'center', display: 'inline-flex' }}>
            <Button className='buttonLight' sx={{ padding: '14px', fontWeight: 600, fontSize: '18px' }} onClick={shrinkWheel}><RemoveCircleIcon /></Button>
            <div style={{ textAlign: 'center', padding: '25px', display: 'flex', flexDirection: 'column', fontSize: '24px', fontWeight: 700 }}>
              <div>Wheel Diameter (cm)</div>
              <div>{wheelDiameter}</div>
            </div>
            <Button className='buttonLight' sx={{ padding: '14px', fontWeight: 600, fontSize: '18px' }} onClick={growWheel}><AddCircleIcon /></Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
      
    </div>
  );
}

export default Start;
