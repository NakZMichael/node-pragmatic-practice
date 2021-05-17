import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Paper, Button } from '@material-ui/core';
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  paper:{
    padding:theme.spacing(3),
    margin:theme.spacing(3),
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
  },
  textField:{
    marginTop:theme.spacing(1),
    marginBottom:theme.spacing(1),
  }
}));
export const Photo = ()=>{
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [userName,setUserName] = useState('')
  const [fileName,setFileName] = useState('')

  const handleChange =  (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  const onSubmit = async()=>{
    let status:any = 0
    try{
      status = await submitPhoto(userName,fileName)
      setUserName('')
      setFileName('')
      console.log(status)
    }catch(e){
      alert(e)
    }
  }
  return(
    <div>
      <header>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Item One"  />
          <Tab label="Item Two"/>
          <Tab label="Item Three" />
        </Tabs>
      </AppBar>
      </header>
        <Paper className={classes.paper} elevation={0}>
          <TextField id="userName" label="User Name" variant="filled" className={classes.textField} value={userName} onChange={(e)=>setUserName(e.target.value)} />
          <TextField id="fileName" label="File Name" variant="filled" className={classes.textField} value={fileName} onChange={(e)=>setFileName(e.target.value)}/>
          <Button variant="contained" color="primary" onClick={onSubmit}>
            Submit
          </Button>
        </Paper>
    </div>
  )
}

const submitPhoto = async (userName:string,fileName:string) =>{
  const res =  await axios({
      method: 'post',
      url: '/api/v1/photo/create',
      data: {
        userName:userName,
        filename:fileName
      }
    })
  return res
}