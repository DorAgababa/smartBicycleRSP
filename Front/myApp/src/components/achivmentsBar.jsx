import * as React from 'react';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CircularProgress from '@mui/joy/CircularProgress';
import { Colors } from '../data/constants';
import { State } from './Alert';

export default function AchivmentsBar({achhivments=[]}) {
  return (
    <>
    {achhivments.length!=0 && (
      <div className='AchivmentsBar' style={{ position: 'absolute', top: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '23vw', background: Colors.LightColor, borderRadius: '20px', padding: '5px 0 5px 0' }}>
        {achhivments.map((achivment, index) => (
          <CircularProgress key={index} size="md" value={achivment.percent * 100} color={State.neutral.color} sx={{ margin: '0 5px 0 5px' }}>
            <EmojiEventsIcon sx={{ fontSize: '30px' }} />
          </CircularProgress>
        ))}
      </div>
    )}
    </>
  );
}