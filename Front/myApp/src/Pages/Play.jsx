import { useEffect, useRef, useState } from 'react';
import { Button } from '@mui/material';
import WorkoutCard from '../components/WorkoutCard';
import { Colors, Pages } from '../data/constants';
import { Sleep, slideAllElementToLeft } from '../utils';
import { setPage } from '../App';
import CheerUp from '../components/CheerUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import ssMus from '../music/daa.wav';
import AchivmentsBar from '../components/achivmentsBar';
import { State } from '../components/Alert';

let achivments = [];

function Play() {
  let distances = [5,10,20,30]
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
    }
    setIsRunning(!isRunning);
  };
  
  const stopStopper = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const formatTime = (time) => {
    const seconds = `0${Math.floor((time / 1000) % 60)}`.slice(-2);
    const minutes = `0${Math.floor((time / 1000 / 60) % 60)}`.slice(-2);
    const hours = `0${Math.floor((time / 1000 / 60 / 60) % 24)}`.slice(-2);
    if(seconds - distances[achivments.length] ==0 ){
      achivments.push(State.warning.color)
      currentAchivment = 0.01
      console.log(achivments)
    }
    else
    {
      currentAchivment = (seconds / distances[achivments.length])*100
    }
    return `${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
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
        <Button className='buttonLight' sx={{marginLeft: '10px'}} onClick={async (e)=>{e.preventDefault();await slideAllElementToLeft(Colors.SemiDarkColor);setPage(Pages.summary)}}>End workout</Button>
      </div>

      <div>
      <WorkoutCard title={"Distance till next achivment"} percent={currentAchivment+0.01} describe={`${(distances[achivments.length]-(Math.floor((time / 1000) % 60))).toFixed(1)}m`} color={'buttonSemiLight'} SX={{width: '170px'}} />
      </div>

      <div style={{position: 'absolute', left: '10vw', bottom: "25px", width: '80vw', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
        <WorkoutCard title={"Total distance"} percent={0} describe={'stringTime'} color={'buttonSemiLight'} SX={{width: '170px', height: '120px'}} />
        <WorkoutCard title={"Speed"} percent={0} describe={'stringTime'} color={'buttonSemiLight'} SX={{width: '170px', height: '120px'}} />
        <WorkoutCard title={"Total Pase"} percent={0} describe={'stringTime'} color={'buttonSemiLight'} SX={{width: '170px', height: '120px'}} />
        <WorkoutCard title={"Calories"} percent={0} describe={'stringTime'} color={'buttonSemiLight'} SX={{width: '170px', height: '120px'}} />
      </div>
    </div>
  )
}

export default Play;
