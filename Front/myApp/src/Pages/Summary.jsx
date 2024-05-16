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
import WorkoutCard from '../components/WorkoutCard';
import { LineChart } from '@mui/x-charts/LineChart';
import { resetCounter } from '../webSocket';
import { calories, pace, totalCycles, totalTime } from './Play';

const keyToLabel = {
  AVGspeed: 'avgSpeed',
  isRunning: 'Is Running',
  time:"time"
};

const results = [
  {
    time: "00:30",
    AVGspeed: 11.2,
    isRunning: 0,
  },
  {
    time: "00:30",
    AVGspeed: 11.2,
    isRunning: 20,
  },
  {
    time: "01:00",
    AVGspeed: 14.2,
    isRunning: 20,
  },
  {
    time: "01:30",
    AVGspeed: 13.2,
    isRunning: 0,
  },
  {
    time: "02:00",
    AVGspeed: 4.2,
    isRunning: 0,
  },
  {
    time: "02:30",
    AVGspeed: 11.2,
    isRunning: 0,
  },]

  const stackStrategy = {
    stack: 'total',
    area: true,
    stackOffset: 'none', // To stack 0 on top of others
  };

  const colors = {
    AVGspeed: 'lightgreen',
    isRunning: 'orange',
  };

function Summary() {

  return (
    <div className='content' style={{left:0,top:0,display: 'flex' ,  flexDirection:"column",  justifyContent:'center',    alignItems:'center',backgroundColor:Colors.SemiDarkColor, width:"100vw",height:"100vh"}}>
      <div style={{position: 'absolute', left: '10vw', top: "20vh", width: '80vw', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
        <WorkoutCard title={"Total time"} percent={0} describe={`${totalTime}`} color={'buttonLight'} SX={{width: '250px', height: '120px'}} />
        <WorkoutCard title={"Total distance"} percent={0} describe={`${totalCycles/1000} Km`} color={'buttonLight'} SX={{width: '250px', height: '120px'}} />
        <WorkoutCard title={"Total Pase"} percent={0} describe={`${pace} Km/H`} color={'buttonLight'} SX={{width: '250px', height: '120px'}} />
        <WorkoutCard title={"Total calories Burned"} percent={0} describe={`${calories.toFixed(1)} Cal`} color={'buttonLight'} SX={{width: '250px', height: '120px'}} />
      </div>
      <div style={{position: 'absolute', left: '10vw', bottom: "15vh", width: '80vw', display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
      <div style={{position:'relative',display:'flex',justifyContent:'center'}}>
        <div style={{fontFamily:"'Assistant', sans-serif" ,  fontSize:'20px',position:'absolute',left:'20px',top:'15px',zIndex:'2  ',fontWeight:'600'}}>Speed summary</div>
      <LineChart
      xAxis={[{ 
         label: 'time (M)',
         dataKey: 'time',
         valueFormatter: (value) => value.toString(), }]}

      yAxis={[{ label: 'Speed (Km/H)', }]}

      series={Object.keys(keyToLabel).map((key) => ({
        dataKey: key,
        label: keyToLabel[key],
        color: colors[key],
        ...stackStrategy,
      }))}
      
      dataset={results}
      width={700}
      height={300}
      sx={ {background: Colors.LightColor, borderRadius: '20px', padding: '5px 0 5px 0'}}
    />
      </div>
    <div style={{ alignItems:'center', display:'flex'}}>
        <Button className='buttonSemiLight' sx={{fontSize: '18px',fontWeight:'600', marginRight:'10px'}} onClick={async (e)=>{e.preventDefault();await slideAllElementToLeft(Colors.DarkColor);resetCounter();setPage(Pages.play)}}>Restart Workout</Button>
        <Button className='buttonSemiLight' sx={{fontSize: '18px',fontWeight:'600'}} onClick={async (e)=>{e.preventDefault();await slideAllElementToLeft(Colors.DarkColor);setPage(Pages.start)}}>End</Button>
      </div>

      </div>
    </div>
  )
}

export default Summary

