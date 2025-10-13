import React, { useState } from 'react';
import '../Estilos/FormCreator.css';
import { Button } from '@mui/material';

const defaultQuestions = [
  { id: 'q1', text: '¿Cómo te sientes emocionalmente esta semana?' },
  { id: 'q2', text: '¿Has asistido a tus clases regularmente?' },
  { id: 'q3', text: '¿Necesitas apoyo académico adicional?' },
  { id: 'q4', text: '¿Tienes dificultades con el acceso a recursos (internet, materiales)?' },
  { id: 'q5', text: '¿Te interesa recibir asesoría socioemocional?' }
];

const FormCreator = ({ onBack }) => {
  const [questions, setQuestions] = useState(defaultQuestions);
  const [selected, setSelected] = useState(() => questions.map(q => q.id));

  const toggleQuestion = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSend = () => {
    const payload = {
      questions: questions.filter(q => selected.includes(q.id))
    };
    // Por ahora solo console.log, la integración al backend se puede añadir luego
    console.log('Enviar formulario:', payload);
    alert('Formulario preparado para enviar. Revisa la consola para ver el payload.');
  };

  return (
    <div>
      <div className="formcreator-header-section">
        <h1 className="formcreator-title">Crear formulario</h1>
      </div>
      <div className="formcreator-container">
      <div className="formcreator-body">
        {/* Título removido por petición del usuario */}

        <div className="formcreator-questions">
          <h3>Selecciona la pregunta a enviar</h3>
          <table className="questions-table">
            <tbody>
              {questions.map(q => (
                <tr key={q.id} className="question-row">
                  <td className="q-checkbox">
                    <input type="checkbox" checked={selected.includes(q.id)} onChange={() => toggleQuestion(q.id)} />
                  </td>
                  <td className="q-text">{q.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="formcreator-footer">
          <Button variant="contained" color="primary" onClick={handleSend}>Enviar formulario</Button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default FormCreator;
