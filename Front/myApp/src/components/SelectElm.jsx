import * as React from 'react';
import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import { isMobile } from '../utils/utils';
import { Colors } from '../data/constants';

export default function SelectIndicator({data=["רחוב בן יהודה 23, תל אביב-יפו, ישראל","רחוב יפו 10, ירושלים, ישראל"]}) {
  return (
    <Select
      defaultValue="apartment1"
      className='buttonDark'
      indicator={data.length==1?"":<KeyboardArrowDown />}
      disabled={data.length==1?true:false}
      sx={{
        direction:'rtl',
        width: "100%",
        [`& .${selectClasses.indicator}`]: {
          transition: '0.2s',
          [`&.${selectClasses.expanded}`]: {
            transform: 'rotate(-180deg)',
          },
        },
        color:Colors.LightColor,backgroundColor:Colors.DarkColorOpacity,
        border:"none"
      }}
    >
      {data.map(((e,i)=>{ 
        let aptVal=`apartment${i}`;
      return (<Option value={aptVal}> {e} </Option>)
      }))}
    </Select>
  );
}