import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Box from '@mui/joy/Box';
import Alert from '@mui/joy/Alert';
import IconButton from '@mui/material/IconButton';
import { Typography } from '@mui/material';
import { useState } from 'react';
import Collapse from '@mui/material/Collapse';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ReportIcon from '@mui/icons-material/Report';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { LinearProgress } from '@mui/joy';

export const State = {
    success:{ color: 'success', icon: <CheckCircleIcon /> },
    warning:{ color: 'warning', icon: <WarningIcon /> },
    danger:{ color: 'danger', icon: <ReportIcon /> },
    neutral:{ color: 'neutral', icon: <InfoIcon /> },
}

const AlertCustome = ({title,text,state}) => {
    const [open, setOpen] = useState(true);
  return (
    <>
    <Box  sx={{zIndex:'5', display: 'flex', gap: 2, width: '100%', flexDirection: 'column',position:'absolute',alignItems:'center',top:0,left:0}}>
        <Collapse in={open}>
        <Alert
          
          sx={{ alignItems: 'flex-start',width:"80vw",marginTop:'10px' }}
          startDecorator={state.icon}
          variant="soft"
          color={state.color}
          endDecorator={
            <IconButton variant="soft" color={state.color} onClick={()=>setOpen(false)}>
              <CloseRoundedIcon />
            </IconButton>
          }
        >
          <div>
            <div>{title}</div>
            <Typography level="body-sm" color={state.color}>
              {text}
            </Typography>
          </div>
          <LinearProgress
          variant="solid"
          color={state.color}
          value={40}
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            borderEndEndRadius: 25,
          }}
        />
        </Alert>
        </Collapse>
    </Box>
    </>
  );
}
export default { AlertCustome, State };
