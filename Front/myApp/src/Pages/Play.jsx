import { useEffect, useRef, useState } from 'react';
import { Button } from '@mui/material';
import WorkoutCard from '../components/WorkoutCard';
import { Colors, Pages } from '../data/constants';
import { Sleep, calculateCaloriesBurned, calculateSpeed, slideAllElementToLeft } from '../utils';
import { ClearObjBox, SetAlert, setPage } from '../App';
import CheerUp from '../components/CheerUp';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import AchivmentsBar from '../components/AchivmentsBar';
import { State } from '../components/Alert';
import { connectWebSocket, pauseCounter, releaseCounter, resetCounter } from '../webSocket';
import { socket, totalDistance, totalCycles, wheelDiameterCm } from './Start';
import ImageRevealer from '../components/ImageRevealer';
import audio1 from '../music/audio1.mp3'

export let achivments = [];
export let speed = 0;
export let avgSpeed =0;
export let calories = 0;
export let totalTime = 0;
export let highestSpeed = 0;
export let speedArray = [0];
let lastCyclesCounter = 0; 
let nextAchivmentDistance = 0;
const audioFiles = [];

function Play() {
  let distances = [100,300,600,1000,1250 ]
  let passedDistanceAchivemnts = 0;
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const [volume, setVolume] = useState(50);
  let currentAchivment = 0.01
  const handleVolumeUp = () => {
    setVolume(prevVolume => Math.min(prevVolume + 10, 100));
  }
  const handleVolumeDown = () => {
    setVolume(prevVolume => Math.max(prevVolume - 10, 0));
  }
  const startStopper = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
    } else {
      const startTime = Date.now() - time;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 1000);
    }
    setIsRunning(!isRunning);
    releaseCounter(socket);
  };

  const stopStopper = () => {
    clearInterval(intervalRef.current);
    pauseCounter(socket);
    setIsRunning(false);
  };

  const ImageReveal = useRef();

  const handleTriggerReveal = () => {
    if (ImageReveal.current) {
      ImageReveal.current.revealDiv();
    }
  };

  const formatTime = (time) => {
    const seconds = `0${Math.floor((time / 1000) % 60)}`.slice(-2);
    const minutes = `0${Math.floor((time / 1000 / 60) % 60)}`.slice(-2);
    const hours = `0${Math.floor((time / 1000 / 60 / 60) % 24)}`.slice(-2);
    let cyclesDuringLastSecond = totalCycles - lastCyclesCounter;
    lastCyclesCounter = totalCycles;
    speed = calculateSpeed(cyclesDuringLastSecond,wheelDiameterCm,1) //the speed of the last second
    avgSpeed = calculateSpeed(totalCycles,wheelDiameterCm,time / 1000)
    if(speed>highestSpeed)highestSpeed = speed
    if(Math.floor((time / 1000) % 60) % 10 == 0 && isNaN(speed))speedArray.push(0)
    if( Math.floor((time / 1000) % 60) % 10 == 0 && !isNaN(speed))speedArray.push(speed)
    calories = speed !=0 ? calculateCaloriesBurned(80,(time / 1000 / 60 / 60) % 24 ,avgSpeed) : calories;
    earlyActivityFinishCheck();
    if((totalDistance - distances[achivments.length]) >= 0){
      CheerUp(`Well done for doing ${distances[achivments.length]} Meters !`,audioFiles[achivments.length])
      passedDistanceAchivemnts += distances[achivments.length]
      achivments.push(State.warning.color)
      currentAchivment = 0.01
    }
    else
    {
      currentAchivment = (totalDistance / distances[achivments.length])*100
    }
    if(nextAchivmentDistance!=Math.abs((totalDistance - distances[achivments.length])) && isRunning)
      handleTriggerReveal();
    nextAchivmentDistance = Math.abs((totalDistance - distances[achivments.length]))
    totalTime = `${hours}:${minutes}:${seconds}`;
    return `${hours}:${minutes}:${seconds}`;
  };

  const earlyActivityFinishCheck = async () => {
    //TODO: David add kind of a message that will notify user that his activity end due to inactivity
    const lastTenElements = speedArray.slice(-10);
    const allZero = lastTenElements.length === 10 && lastTenElements.every(speed => speed === 0);
    if (allZero) {
      speedArray = [...speedArray.slice(0, -10), 0];
      ClearObjBox();
      stopStopper();
      pauseCounter(socket);
      await slideAllElementToLeft(Colors.SemiDarkColor);
      setPage(Pages.summary);
    }
  };

  useEffect(() => {
    resetCounter(socket);
    startStopper();
    setTime(0)
    speedArray=[]
    const loadAudioFiles = async () => {
      for (let i = 1; i <= 6; i++) {
        const audio = await import(`../music/audio${i}.mp3`);
        audioFiles.push(audio.default);
      }
    };

    loadAudioFiles();
    achivments=[]
    return () => clearInterval(intervalRef.current); // Clean up by clearing the interval when the component unmounts
  },[]);

  return (
    <div className='content' style={{left: 0, top: 0, display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.DarkColor, width: "100vw", height: "100vh", position: 'relative'}}>
      
      <div style={{position: 'absolute', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',position: 'absolute', bottom: '20px', right: '1vw'}}>
        <WorkoutCard title={"Workout timer"} percent={0} describe={formatTime(time)} color={'buttonSemiLight'} SX={{width: '210px', height: '80px'}} />
        <WorkoutCard title={"Total distance"} percent={0}  describe={`${totalDistance.toFixed(1)} m`} color={'buttonSemiLight'} SX={{ width: '210px',height: '80px',marginTop:'25px'}}/>
        <WorkoutCard title={"Distance till next Achievement"} percent={currentAchivment+0.01} describe={`${nextAchivmentDistance.toFixed(1)}m`} color={'buttonSemiLight'} SX={{width: '210px', height: '120px',marginTop:'25px'}} />
      </div>
      
      <AchivmentsBar achhivments={achivments}/>
      <div style={{ top: '20px', right: '20px', position: 'absolute',alignItems:'center', display:'inline-flex'}}>
        <Button className='buttonLight' sx={{ marginLeft: '10px',padding:'14px' ,fontWeight:600,fontSize:'18px'}} onClick={handleVolumeDown}><VolumeDownIcon/></Button>
        <Button className='buttonLight' sx={{ marginLeft: '10px',padding:'14px' ,fontWeight:600,fontSize:'18px'}} onClick={handleVolumeUp}><VolumeUpIcon/></Button>
        <Button className='buttonYellow' sx={{marginLeft: '10px',padding:'10px',fontWeight:600,fontSize:'18px'}} onClick={(e)=>{e.preventDefault();isRunning ? stopStopper() : startStopper();}}>{isRunning ? 'Pause' : 'Resume'}</Button>
        <Button className='buttonEnd' sx={{marginLeft: '10px',padding:'10px',fontWeight:600,fontSize:'18px'}} onClick={async (e)=>{e.preventDefault();ClearObjBox();stopStopper();await slideAllElementToLeft(Colors.SemiDarkColor);setPage(Pages.summary)}}>End workout</Button>
      </div>

      <div>

      <div className="App" style={{display:'flex', justifyContent:'center',alignContent:'center'}}>
            <ImageRevealer ref={ImageReveal}/>
        </div>

      </div>

      <div style={{position: 'absolute', left: '1vw', bottom: "20px", height:'90%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',alignItems:'center'}}>
        <WorkoutCard title={"Total cycles"} percent={0} describe={`${totalCycles}`} color={'buttonSemiLight'} SX={{width: '185px', height: '80px'}} />
        <WorkoutCard title={"Current Speed"} percent={0} describe={`${speed.toFixed(1)} Km/H`} color={'buttonSemiLight'} SX={{width: '185px', height: '80px'}} />
        <WorkoutCard title={"Average speed"} percent={0} describe={`${avgSpeed.toFixed(2)} Km/H`} color={'buttonSemiLight'} SX={{width: '185px', height: '80px'}} />
        <WorkoutCard title={"Calories"} percent={0} describe={`${calories.toFixed(2)} Cal`} color={'buttonSemiLight'} SX={{width: '185px', height: '80px'}} />
      </div>
    </div>
  )
}

export default Play;
