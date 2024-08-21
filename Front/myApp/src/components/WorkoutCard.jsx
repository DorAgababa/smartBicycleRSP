import * as React from 'react';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import CircularProgress from '@mui/joy/CircularProgress';
import Typography from '@mui/joy/Typography';
import SvgIcon from '@mui/joy/SvgIcon';
import { Colors } from '../data/constants';

export default function WorkoutCard({title,describe="",percent=2,color='buttonLight',SX}) {
  return (
    <Card variant="solid" className={color} sx={{...SX}}>
      <CardContent sx={{position:'relative'}}>
        {percent!=0 && 
        (<div className='carddd' style={{position:'absolute',bottom:"0px",left:"-10px"}}><CircularProgress  size="lg" determinate value={percent} color='neutral'>
          <PedalBikeIcon sx={{fontSize:'35px'}}/>
        </CircularProgress>
        </div>)}
        <CardContent sx={{justifyContent:'center', alignContent:'center',marginBottom:'17px'}}>
          <Typography sx={{textAlign:'center',fontSize:'22px', fontWeight:700}} level="title-md">{title}</Typography>
          {percent==0 && (<Typography sx={{textAlign:'center'}} level="h2">{describe}</Typography>)}
          {percent!=0 && (<Typography sx={{textAlign:'right'}} level="h2">{describe}</Typography>)}
        </CardContent>
      </CardContent>
    </Card>
  );
}