/*Lógica para los botones*/
import React from 'react';
import { Button } from '@mui/material';
import '../Estilos/Botones.css';

function Botones({ onNavigate }) {
  const buttonData = {
    text1: 'Registrar datos', 
    text2: 'Editar datos',
    text3: 'Añadir acompañamiento',
    text4: 'Acompañamientos',
  };

  return (
    <div className="container">
      <div className="button-container">
        <img src="registrar.png" className="images" alt="registrar" />
        <Button
          className="button"
          variant="contained"
          onClick={() => onNavigate('registrar')}
           sx={{
              backgroundColor: '#1cc88a',
              color: 'white',
              '&:hover': {
                backgroundColor: '#17a55f',
              },
              textTransform: 'none',
              fontSize: '20px',
              padding: '8px 16px',
              borderRadius: '6px',
            }}
        >
          {buttonData.text1}
        </Button>

        <img src="editar.png" className="images" alt="editar" />
        <Button
          className="button" 
          variant="contained"
          onClick={() => onNavigate('editar')}
                     sx={{
              backgroundColor: '#1cc88a',
              color: 'white',
              '&:hover': {
                backgroundColor: '#17a55f',
              },
              textTransform: 'none',
              fontSize: '20px',
              padding: '8px 16px',
              borderRadius: '6px',
            }}
        >
          {buttonData.text2}
        </Button>

        <img src="acompañar.png" className="images" alt="acompañar" />
        <Button
          className="button" 
          variant="contained"
          onClick={() => onNavigate('acompañar')}
                     sx={{
              backgroundColor: '#1cc88a',
              color: 'white',
              '&:hover': {
                backgroundColor: '#17a55f',
              },
              textTransform: 'none',
              fontSize: '20px',
              padding: '8px 16px',
              borderRadius: '6px',
            }}
        >
          {buttonData.text3}
        </Button>

        <img src="metricas.png" className="images" alt="acompanamientos" />
        <Button
          className="button" 
          variant="contained"
          onClick={() => onNavigate('acompanamientos')}
                     sx={{
              backgroundColor: '#1cc88a',
              color: 'white',
              '&:hover': {
                backgroundColor: '#17a55f',
              },
              textTransform: 'none',
              fontSize: '20px',
              padding: '8px 16px',
              borderRadius: '6px',
            }}
        >
          {buttonData.text4}
        </Button>

      </div>
    </div>
  );
}

export default Botones;
