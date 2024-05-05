import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Divider } from '@mui/joy';

const size = {
  width: 1,
  height: 150,
};

const pieColors = [
  '#B990A6',
  '#5C69A5',
  '#D084A1', 
  '#8F6FAB', 
  '#A99B8F', 
  '#A57C7D', 
  '#757E98', 
  '#C094B4', 
  '#946E8C', 
  '#8C849A', 
];
const currencyFormatter = new Intl.NumberFormat('he-IL', {
  style: 'currency',
  currency: 'ILS',
}).format;



export default function PieChartsData({data , sx,txtColor="black"}) {
  let words = []
  data = data.map((item,index) => {
    words.push(`${item.label} ${item.value}₪`)
    return { ...item, color:pieColors[index % pieColors.length] };
  });

  return (
    <div style={{...sx, display:'flex',justifyContent:'center'}} dir='ltr'>
      <div style={{width:'150px', display:'flex'}}>
      <PieChart 
      series={[
        {
          highlightScope: { faded: 'global', highlighted: 'item' },
          data,
          innerRadius: 60,
          outerRadius: 45,
          paddingAngle:3,
          cornerRadius: 10,
          startAngle: 180,
          endAngle: -180,
        },
      ]}
      slotProps={{
        legend: {
          hidden:'true'
        }
      }}
      
      {...size}
    />
      </div>
    
    <div style={{}}>
      <ColorfulWordList words={words}/>
    </div>
  </div>
  );
}


export function ColorfulWordList({ words }){

  return (
    <div>
      {words.map((word, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <div
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: pieColors[index % pieColors.length],
              marginRight: '8px',
              
            }}
          />
          <span style={{ color: "white",fontWeight:600 }}>{word}</span>
        </div>
      ))}
    </div>
  );
};