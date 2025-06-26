/*Lógica para los botones*/
import React from 'react';
import { Button } from '@mui/material';
import '../Estilos/Botones.css';

function Botones({ onNavigate }) {
  const buttonData = {
    text1: 'Registrar datos', 
    text2: 'Editar datos',
    text3: 'Añadir acompañamiento',
    text4: 'Ver métricas',
  };

  return (
    <div className="container">
      <div className="button-container">
        <img src="registrar.png" className="images" alt="registrar" />
        <Button
          className="button"
          variant="contained"
          onClick={() => onNavigate('registrar')}
        >
          {buttonData.text1}
        </Button>

        <img src="editar.png" className="images" alt="editar" />
        <Button
          className="button" 
          variant="contained"
          onClick={() => onNavigate('editar')}
        >
          {buttonData.text2}
        </Button>

        <img src="acompañar.png" className="images" alt="acompañar" />
        <Button
          className="button" 
          variant="contained"
          onClick={() => onNavigate('acompañar')}
        >
          {buttonData.text3}
        </Button>

        <img src="metricas.png" className="images" alt="metricas" />
        <Button
          className="button" 
          variant="contained"
          onClick={() => onNavigate('metricas')}
        >
          {buttonData.text4}
        </Button>

      </div>
    </div>
  );
}

export default Botones;
