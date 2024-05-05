import * as React from 'react';
import Stepper from '@mui/joy/Stepper';
import Step, { stepClasses } from '@mui/joy/Step';
import StepIndicator, { stepIndicatorClasses } from '@mui/joy/StepIndicator';
import Typography, { typographyClasses } from '@mui/joy/Typography';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CottageIcon from '@mui/icons-material/Cottage';
import { Colors } from '../data/constants';

export default function StepsElement({ order = "v", data = { "done": "1","done1": "2", "current": "2","todo": "2" } }) {
  return (
    <Stepper
      orientation={order === "v" ? "vertical" : "horizontal"}
      sx={{
        '--Stepper-verticalGap': '2.5rem',
        '--StepIndicator-size': '2.5rem',
        '--Step-gap': '1rem',
        '--Step-connectorInset': '0.5rem',
        '--Step-connectorRadius': '1rem',
        '--Step-connectorThickness': '4px',
        '--joy-palette-success-solidBg': Colors.DarkColor,
        [`& .${stepClasses.completed}`]: {
          '&::after': { bgcolor: Colors.DarkColor },
        },
        [`& .${stepClasses.active}`]: {
          [`& .${stepIndicatorClasses.root}`]: {
            border: '4px solid',
            borderColor: '#fff',
            boxShadow: (theme) => `0 0 0 1px ${theme.vars.palette.primary[500]}`,
          },
        },
        [`& .${stepClasses.disabled} *`]: {
          color: 'neutral.softDisabledColor',
        },
        [`& .${typographyClasses['title-sm']}`]: {
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontSize: '10px',
        },
      }}
    >
      {Object.entries(data).map(([key, item], index) => (
        <Step
          key={index}
          completed={key.includes("done")}
          indicator={
            key.includes("done") ? (
              <StepIndicator variant="solid" sx={{background:Colors.DarkColor}}>
                <CheckRoundedIcon />
              </StepIndicator>
            ) : key.includes("current") ? (
              <StepIndicator variant="solid" sx={{background:Colors.SemiLightColor}}>
                <CottageIcon />
              </StepIndicator>
            ) : key.includes("todo") ? (
              <StepIndicator disabled variant="solid">
                {index + 1}
              </StepIndicator>
            ) : null
          }
        >
          <div>
            <Typography level="title-sm">{`STEP ${index + 1}`}</Typography>
            {item}
          </div>
        </Step>
      ))}
    </Stepper>
  );
}
