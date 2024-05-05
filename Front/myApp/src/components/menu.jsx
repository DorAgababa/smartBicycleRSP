import * as React from 'react';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Drawer from '@mui/joy/Drawer';
import Input from '@mui/joy/Input';
import List from '@mui/joy/List';
import ListItemButton from '@mui/joy/ListItemButton';
import Typography from '@mui/joy/Typography';
import ModalClose from '@mui/joy/ModalClose';
import Menu from '@mui/icons-material/Menu';
import Search from '@mui/icons-material/Search';
import { Colors } from '../data/constants';
import logo from '../images/blackPurpleLogo.png'

export default function MenuComponent() {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <IconButton className='hoverEffect' variant="outlined" sx={{color:Colors.DarkColor, border:'none',borderRadius:'10px',background:'white'}} onClick={() => setOpen(true)}>
        <Menu />
      </IconButton>
      <Drawer open={open} onClose={() => setOpen(false)} >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            ml: 'auto',
            mt: 1,
            mr: 2,
            overflow:'hidden'
          }}
        >
          <Typography
            component="label"
            htmlFor="close-icon"
            fontSize="sm"
            fontWeight="lg"
            sx={{ cursor: 'pointer' }}
          >
            
          </Typography>
          <ModalClose id="close-icon" sx={{ position: 'initial' }} />
        </Box>
        
        <List
          size="lg"
          component="nav"
          sx={{
            fontSize: '20px',
            '& > div': { justifyContent: 'center' },
            
          }}
        >
                  <div style={{display:"flex",justifyContent:"center"}}>
        <img src={logo} style={{ width:'70px'}}/>
        </div>
          <ListItemButton sx={{ fontWeight: 'lg' }}>דף הבית</ListItemButton>
          <ListItemButton>עדכון פרטים</ListItemButton>
          <ListItemButton>היסטורית חייובים</ListItemButton>
          <ListItemButton>יצירת הצבעה</ListItemButton>
          <ListItemButton>צור קשר</ListItemButton>
          <ListItemButton sx={{fontWeight:500,fontSize:'md'}}>התנתקות </ListItemButton>
        </List>
        
      </Drawer>
    </React.Fragment>
  );
}
