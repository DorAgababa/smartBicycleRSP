import * as React from 'react';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import UploadButton from './UploadButton';
import { getLanguage } from '../utils';
import ImageUploadView from './ImageUploadView';

const tmp = [
  'https://images.unsplash.com/photo-1502657877623-f66bf489d236',
  'https://images.unsplash.com/photo-1527549993586-dff825b37782',
  
];


export default function PopUpBox({content=(<UploadProblemBox/>)}) {
  let language = getLanguage();
  let direction= language=="HE"?"rtl":"ltr";
    const [layout, setLayout] = React.useState('center');
    return (
      <React.Fragment>
        <Modal open={!!layout} onClose={() => setLayout(undefined)}>
          <ModalDialog layout={layout} sx={{direction:direction }} >
            <ModalClose/>
            {content}
          </ModalDialog>
        </Modal>
      </React.Fragment>
    );
}

export function UploadProblemBox(){
  let text = {
    HE: {
      title: "יש לי בעיה בבניין",
      email: "Email",
      password: "Password",

    },
    EN: {
      title: "I have an issue",
      email: "דואר אלקטרוני",
      password: "סיסמא",
    },
  };
  let language = getLanguage();
  let direction= language=="HE"?"rtl":"ltr";
  text=text[language]
  return (
    <>
          <DialogTitle sx={{justifyContent:'center'}}>{text.title}</DialogTitle>
          <DialogContent>
            <div>
              This is a  modal dialog. Press  to
              close it.sss
            </div>
            <div>
              <UploadButton sx={{direction:direction}}/>
              <ImageUploadView data={tmp} />
            </div>
          </DialogContent>
          </>
  );
}