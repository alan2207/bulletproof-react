/* eslint-disable @typescript-eslint/no-unused-vars */
import { createStyles, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

interface IHeading {
  text: string;
  variant: any;
  color?: string;
  textAlign?: any;
  fontSize?: string;
  className?: any;
}

export const Heading: React.FC<IHeading> = (props: IHeading) => {
  const useStyles = makeStyles(() =>
    createStyles({
      title: {
        color: props.color,
        textAlign: props.textAlign,
        fontSize: props.fontSize,
      },
    })
  );

  const classes = useStyles();

  return (
    <Typography variant={props.variant} className={classes.title}>
      {props.text}
    </Typography>
  );
};
