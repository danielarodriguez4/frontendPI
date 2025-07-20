import React from 'react';
import { Button } from '@mui/material';
import '../Estilos/Botones.css';

function Botones({ onNavigate }) {
  const buttonData = [
    {
      id: 'registrar',
      title: 'Registro de estudiantes',
      buttonText: 'Registrar datos',
      image: 'registrar.png',
      alt: 'registrar'
    },
    {
      id: 'editar',
      title: 'Editar datos',
      description: 'Edita o actualiza la información de los estudiantes',
      buttonText: 'Editar datos',
      image: 'editar.png',
      alt: 'editar'
    },
    {
      id: 'acompañar',
      title: 'Acompañamientos',
      description: 'Añade nuevos acompañamientos',
      buttonText: 'Añadir acompañamiento',
      image: 'acompañar.png',
      alt: 'acompañar'
    },
    {
      id: 'acompanamientos',
      title: 'Consulta de acompañamientos',
      buttonText: 'Acompañamientos',
      image: 'metricas.png',
      alt: 'acompanamientos'
    }
  ];

  return (
      <div className="button-container">
        {buttonData.map((item) => (
          <div key={item.id} className="button-item">
            <img src={item.image} className="images" alt={item.alt} />
            <h3 className="button-title">{item.title}</h3>
            <p className="button-description">{item.description}</p>
            <Button
              className="button"
              variant="contained"
              onClick={() => onNavigate(item.id)}
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
              {item.buttonText}
            </Button>
          </div>
        ))}
      </div>
  );
}

export default Botones;