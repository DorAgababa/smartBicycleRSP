import { useEffect, useRef, useState } from 'react';
import { Button } from '@mui/material';
import WorkoutCard from '../components/WorkoutCard';
import { Colors, Pages } from '../data/constants';
import { Sleep, calculateCaloriesBurned, calculatePace, calculateSpeed, slideAllElementToLeft } from '../utils';
import { ClearObjBox, setPage } from '../App';
import CheerUp from '../components/CheerUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import ssMus from '../music/daa.wav';
import AchivmentsBar from '../components/AchivmentsBar';
import { State } from '../components/Alert';
import { connectWebSocket, pauseCounter, releaseCounter, resetCounter } from '../webSocket';
import { socket, totalCycles } from './Start';

export let achivments = [];
export let speed = 0;
export let pace =0;
export let calories = 0;
export let totalTime = 0;
export let highestSpeed = 0;
export let speedArray = [0];
let nextAchivmentDistance = 0;

function Play() {
  let distances = [5,15,25,40,1000 ]
  let passedDistanceAchivemnts = 0;
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  let currentAchivment = 0.01
  const startStopper = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
    } else {
      const startTime = Date.now() - time;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 1000);
      releaseCounter();
    }
    setIsRunning(!isRunning);
  };

  const stopStopper = () => {
    clearInterval(intervalRef.current);
    pauseCounter(socket);
    setIsRunning(false);
  };

  const formatTime = (time) => {
    const seconds = `0${Math.floor((time / 1000) % 60)}`.slice(-2);
    const minutes = `0${Math.floor((time / 1000 / 60) % 60)}`.slice(-2);
    const hours = `0${Math.floor((time / 1000 / 60 / 60) % 24)}`.slice(-2);
    speed = calculateSpeed(totalCycles,"15",time / 1000)
    if(speed>highestSpeed)highestSpeed = speed
    if( Math.floor((time / 1000) % 60) % 10 == 0 && !isNaN(speed))speedArray.push(speed)
    pace = calculatePace(time / 1000,totalCycles/1000)
    calories = calculateCaloriesBurned(80,(time / 1000 / 60 / 60) % 24 ,speed)

    if((totalCycles - distances[achivments.length]) == 0){
      CheerUp(`Well done for doing ${distances[achivments.length]} Meters !`,"")
      passedDistanceAchivemnts += distances[achivments.length]
      achivments.push(State.warning.color)
      currentAchivment = 0.01
    }
    else
    {
      currentAchivment = (totalCycles / distances[achivments.length])*100
    }
    nextAchivmentDistance = Math.abs((totalCycles - distances[achivments.length]))
    totalTime = `${hours}:${minutes}:${seconds}`;
    return `${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    resetCounter(socket);
    startStopper();
    setTime(0)
    achivments=[]
    return () => clearInterval(intervalRef.current); // Clean up by clearing the interval when the component unmounts
  },[]);

  return (
    <div className='content' style={{left: 0, top: 0, display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.DarkColor, width: "100vw", height: "100vh", position: 'relative'}}>
      <WorkoutCard title={"Workout timer"} percent={0}  describe={formatTime(time)} color={'buttonSemiLight'} SX={{position: 'absolute', top: '30px', left: '30px'}}/>
      <AchivmentsBar achhivments={achivments}/>
      <div style={{ top: '20px', right: '20px', position: 'absolute',alignItems:'center', display:'inline-flex'}}>
        <Button className='buttonLight' sx={{marginLeft: '10px'}} onClick={e=>{e.preventDefault();setIsMuted(!isMuted)}}>{isMuted ? <VolumeOffIcon/> : <VolumeMuteIcon/>}</Button>
        <Button className='buttonLight' sx={{marginLeft: '10px'}} onClick={(e)=>{e.preventDefault();isRunning ? stopStopper() : startStopper()}}>{isRunning ? 'Stop' : 'Start'}</Button>
        <Button className='buttonLight' sx={{marginLeft: '10px'}} onClick={async (e)=>{e.preventDefault();ClearObjBox();stopStopper();await slideAllElementToLeft(Colors.SemiDarkColor);setPage(Pages.summary)}}>End workout</Button>
      </div>

      <div>
      </div>

      <div style={{position: 'absolute', left: '10vw', bottom: "25px", width: '80vw', display: 'flex', flexDirection: 'row', justifyContent: 'space-between',alignItems:'center'}}>
      <WorkoutCard title={"Distance till next achivment"} percent={currentAchivment+0.01} describe={`${nextAchivmentDistance}m`} color={'buttonSemiLight'} SX={{width: '170px'}} />
        <WorkoutCard title={"Total distance"} percent={0} describe={`${totalCycles} m`} color={'buttonSemiLight'} SX={{width: '170px', height: '120px'}} />
        <WorkoutCard title={"Speed"} percent={0} describe={`${speed.toFixed(1)} Km/H`} color={'buttonSemiLight'} SX={{width: '170px', height: '120px'}} />
        <WorkoutCard title={"Total Pase"} percent={0} describe={`${pace} a km`} color={'buttonSemiLight'} SX={{width: '170px', height: '120px'}} />
        <WorkoutCard title={"Calories"} percent={0} describe={`${calories.toFixed(1)} Cal`} color={'buttonSemiLight'} SX={{width: '170px', height: '120px'}} />
      </div>
    </div>
  )
}

export default Play;
