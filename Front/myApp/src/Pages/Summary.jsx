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
import { calories, highestSpeed, avgSpeed, speedArray, totalTime } from './Play';
import { Typography } from '@mui/joy';
import { socket, totalCycles } from './Start';

function Summary() {
  return (
    <div className='content' style={{left:0,top:0,display: 'flex' ,  flexDirection:"column",  justifyContent:'center',    alignItems:'center',backgroundColor:Colors.SemiDarkColor, width:"100vw",height:"100vh"}}>
      <div style={{position: 'absolute', left: '10vw', top: "2vh", width: '80vw', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
        <WorkoutCard title={"Total time"} percent={0} describe={`${totalTime}`} color={'buttonLight'} SX={{width: '250px', height: '100px'}} />
        <WorkoutCard title={"Total distance"} percent={0} describe={`${totalCycles/1000} Km`} color={'buttonLight'} SX={{width: '250px', height: '100px'}} />
        <WorkoutCard title={"Total pace"} percent={0} describe={`${avgSpeed.toFixed(2)} Km/H`} color={'buttonLight'} SX={{width: '250px', height: '100px'}} />
        <WorkoutCard title={"Total calories Burned"} percent={0} describe={`${calories.toFixed(1)} Cal`} color={'buttonLight'} SX={{width: '250px', height: '100px'}} />
      </div>
      <div style={{position: 'absolute', left: '10vw', bottom: "2vh", width: '80vw', display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
      <div style={{position:'relative',display:'flex',justifyContent:'center',flexDirection:'column',paddingTop:'15px',background: Colors.LightColor, borderRadius: '20px'}}>
        <Typography sx={{textAlign:'center'}} level="title-md">Workout Graph</Typography>
      <LineChart
      series={[
        {
          data: speedArray.map((e) => e<2?0:highestSpeed),
          label: 'exercising',
          color:'purple',
          area: true,
          valueFormatter: (value) => value<2?"Break": "Exercising",
        },
        {
          data: speedArray,
          label: 'Speed',
          color:'pink',
          valueFormatter: (value) => value.toFixed(1).toString() + " Km/H",
        },
      ]}
      xAxis = {[{ data: speedArray.map((_, index) => index + 1), scaleType: 'linear' ,label:"time (10s cycle)"}]}
      yAxis=  {[{ label:"Speed"}]}
      width={600}
      height={300}
      sx={ {background: Colors.LightColor, borderRadius: '20px', padding: '5px 0 5px 0'}}
    />
      </div>
    <div style={{ alignItems:'center', display:'flex', flexDirection:'column',justifyContent:'center'}}>
        <Button className='buttonSemiLight' sx={{fontSize: '16px',fontWeight:'600', marginBottom:'10px'}} onClick={async (e)=>{e.preventDefault();await slideAllElementToLeft(Colors.DarkColor);resetCounter(socket);setPage(Pages.play)}}>Restart Workout</Button>
        <Button className='buttonSemiLight' sx={{fontSize: '16px',fontWeight:'600'}} onClick={async (e)=>{e.preventDefault();resetCounter(socket);await slideAllElementToLeft(Colors.DarkColor);setPage(Pages.start)}}>End</Button>
      </div>

      </div>
    </div>
  )
}

export default Summary

