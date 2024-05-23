import './App.css'
import { render } from 'react-dom';
import { Sleep, calculateTimeDifferenceInMinutes, downloadImage, getFromLocalStorage, getFromLocalStorageKeyTime, postRequest, removeFromLocalStorage, saveToLocalStorage, updateTimestamp } from './utils';
import AlertCustomeModule from './components/Alert';
const { AlertCustome,State } = AlertCustomeModule;
import PopUpBox from './components/PopUpBoxs'
import { createRoot } from 'react-dom/client';
import { Colors, Pages } from './data/constants';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@mui/material';
import ContainerBox from './components/ContainerBox';
import Start from './Pages/Start';
import { connectWebSocket, resetCounter } from './webSocket.js';
import { totalCycles } from './Pages/Play.jsx';

let obj
let current_page =(<Pages.summary/>)

export function ClearObjBox(){
  const domNode = document.getElementById('obj');
  obj=""
  const root = createRoot(domNode);
  root.render()
}

export async function SetAlert(title,description,state=State.neutral) {
  const domNode = document.getElementById('obj');
  obj=""
  const root = createRoot(domNode);
  root.render(<AlertCustome title={title} text={description} state={state}/>, document.getElementById('obj'));  
  await Sleep(6)
  root.render()
}

export function ShowPop(content=null) {
  const domNode = document.getElementById('obj');
  const root = createRoot(domNode);
  let pop = (<PopUpBox />);
  if(content!= null)
    pop = (<PopUpBox content={content}/>)
  root.render(pop);
}

export function setPage(Page) {
  const domNode = document.getElementById('page');
  const root = createRoot(domNode);
  current_page = ""
  root.render(<Page/>,document.getElementById('page'));
}

function App() {

  return (
    <>
    <div id='obj' >
      {obj}
      </div>
    <ContainerBox>
      <div id='page' style={{top:0,left:0,position:"relative"}}>
        {current_page}
      </div>
    </ContainerBox>
    </>
  )
}

export default App

