import React, {useState} from 'react';
import { Button, CustomProvider, Content, Container, Toggle,Grid, Row, Col, Input, Divider, InputNumber, Message, toaster} from 'rsuite';
import axios from 'axios';
import 'rsuite/dist/rsuite.min.css'; 
import './App.css';

function App() {
  const URI = 'http://localhost:3030/generate'
  const [theme, setTheme]=useState('dark')
  const [oldLink, setOldLink]=useState('')
  const [newLink, setNewLink]=useState('')
  const [resolve, setResolve]=useState(false)
  const [show, setShow]=useState(false)
  const [type,setType]=useState(false)
  const [cant,setCant]=useState(0)
  const reset=()=>{
    setOldLink('')
    setShow(false)
    setNewLink('')
    setOldLink('')
    setCant(1)
    document.getElementById('num').value=1
    setType(false)
    document.getElementById('old').value=''
  }
  const convert=async()=>{
    console.log(oldLink)
    if (oldLink!=="") {
      setResolve(true)
      try {
        const response = await axios.post(URI, {
            link:oldLink,
            cant:cant
            }) 
        setTimeout(() => {
          setResolve(false)
          setShow(true)
          setNewLink(response.data.newLink) 
          setType(true)
        }, 500);  
      } catch (error) {
          console.log(error)
          alert('something bad happen in the server')
      } 
    } else {
      setType(false)
      toaster.push(noti, {value: 'bottomCenter' })
    }
  }
  const copy=()=>{
    navigator.clipboard.writeText(newLink)
    setType(true)
    toaster.push(noti, {value: 'bottomCenter' })
  }
  const noti = (
    <Message showIcon type={type===true?('success'):('error')}>
     {type===true?('Copied'):('The input is empty')}
    </Message>
  );
  return (
    <CustomProvider theme={theme}>
      <Container>
        <Content id="main">
          <Grid fluid id="header">
            <Row className="show-grid">
              <Col xs={22} xsOffset={1} sm={20}>              
                <p id="tittle"><img src="./sec.png" alt="secret" id='secreto' /> One time secret</p>
              </Col>
              <Col xs={24} sm={2} id="luz">
                <Toggle 
                size="lg" 
                checkedChildren="Dark" 
                unCheckedChildren="Light"
                onClick={()=>String(theme)==="light"?(setTheme('dark')):(setTheme('light'))}/>
              </Col>
            </Row>
          </Grid>
          <Grid fluid>
            <Row className="show-grid">
              <Col xs={20} xsOffset={2} id="col">
              <Input as="textarea"
                rows="10" 
                cols="500"
                id='old'
                placeholder="Write your secret" 
                size='lg'  
                onChange={value=>{setOldLink(value)}}
              />
              </Col>              
            </Row>
            <Row className="show-grid">
              <Col xsOffset={8} xs={4} id="col">
                <InputNumber 
                  id="num"
                  size="lg" 
                  min="1" 
                  defaultValue="1"
                  onChange={(value) => { setCant(value) }}
                  />
              </Col>
              <Col xs={4} id="col">                
                <Button id="send1" color="blue" appearance="primary" size='lg' onClick={convert} loading={resolve}>Obtain link</Button>
              </Col>
            </Row>
            <Row className="show-grid" id="resp" hidden={show===false?(true):(false)} >
            <Divider />
            <h1>You secret:</h1>
              <Col xs={20} xsOffset={2} smOffset={8} sm={8} id="col">
                <a id='result' href={newLink}>{newLink}</a>
              </Col>
              <Col xs={12} smOffset={6} sm={6} id="col">
              <Button id="send" color="green" appearance="primary" size='lg' onClick={reset}>Reset</Button>
              </Col>
              <Col xs={12} sm={6} id="col">
              <Button id="send" color="orange" appearance="primary" size='lg' onClick={copy}>copy</Button>
              </Col>
            </Row>
          </Grid>
         
        </Content>
      </Container>
    </CustomProvider>
  );
}

export default App;
