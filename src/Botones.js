import React from 'react';
import {Button} from '@mui/material';
import './Botones.css';

function Botones() {

  const buttonData = {
    text1: 'Registrar datos', 
    text2: 'Editar datos',
    text3: 'Añadir acompañamiento',
  };



  return (
    <div className="container">
      <div className="button-container">
        <img src={"registrar.png"} className="images" alt="registrar" />
        <Button 
          key={buttonData.text1} 
          variant="contained" 
        >
          {buttonData.text1}
        </Button>
        
        <img src={"editar.png"} className="images" alt="editar" />
        <Button 
          key={buttonData.text2} 
          variant="contained" 
        >
          {buttonData.text2}
        </Button>

        <img src={"acompañar.png"} className="images" alt="acompañar" />
        <Button 
          key={buttonData.text3} 
          variant="contained" 
        >
          {buttonData.text3}
        </Button>
      </div>
    </div>
  );
}

export default Botones;