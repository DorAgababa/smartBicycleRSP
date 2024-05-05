import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemButton from '@mui/joy/ListItemButton';
import { useState } from 'react';
import { IconButton, ModalClose } from '@mui/joy';
import { Colors } from '../data/constants';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

function adjustArray(arr) {
  while (arr.length <= 2) {
      arr.push("");
  }

  // Ensure the array has at most size 3
  while (arr.length > 3) {
      arr.pop();
  }
  console.log(arr)
  return arr;
}

export default function ImageUploadView({data=[]}) {
  data= adjustArray(data) 
  console.log(data)
 return (
    <Card sx={{padding:'0 5px 0 5px'}}>
      <List >
        {data.map((e) => (
          <React.Fragment >
            <ListItem sx={{position:'relative'}}>
            <HighlightOffIcon
            className='delete'
            sx={{position:'absolute',right:"10px",top:'5px',zIndex:2,borderRadius:'50%',cursor:'pointer'}}
      ></HighlightOffIcon>
              <ListItemButton sx={{ gap: 2 }}>
                <AspectRatio sx={{ flexBasis: 120 }}>
                {e!= "" && <img
                    src={`${e}?fit=crop&auto=format`}
                  />}
                </AspectRatio>
                <ListItemContent>
                </ListItemContent>
              </ListItemButton>
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Card>
  );
}