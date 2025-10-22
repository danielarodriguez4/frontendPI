import React, { useState, useEffect } from 'react';
import '../Estilos/FormCreator.css';
import { Button } from '@mui/material';
import axios from 'axios';

const defaultQuestions = [
  { id: 'q1', text: '¿Cómo te sientes emocionalmente esta semana?' },
  { id: 'q2', text: '¿Has asistido a tus clases regularmente?' },
  { id: 'q3', text: '¿Necesitas apoyo académico adicional?' },
  { id: 'q4', text: '¿Tienes dificultades con el acceso a recursos (internet, materiales)?' },
  { id: 'q5', text: '¿Te interesa recibir asesoría socioemocional?' },
  { id: 'q6', text: '¿Te gustan las papas?' },
  { id: 'q7', text: '¿Te gusta la pizza?' },
  { id: 'q8', text: '¿Te gusta el helado?' }
];

const FormCreator = ({ onBack }) => {
  const [questions] = useState(defaultQuestions);
  const [selected, setSelected] = useState(() => questions.map(q => q.id));
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const toggleQuestion = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSend = () => {
    const payload = {
      student: selectedStudent,
      questions: questions.filter(q => selected.includes(q.id))
    };
    console.log('Enviar formulario:', payload);
    alert('Formulario preparado para enviar. Revisa la consola para ver el payload.');
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v2/student/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        const raw = response.data?.data || [];
        const list = (raw || []).map(student => ({
          id: student.id || student._id || student.email || Math.random().toString(36).slice(2,9),
          first_name: student.first_name || '',
          last_name: student.last_name || '',
          email: student.email || '',
          fullName: `${(student.first_name || '').trim()} ${(student.last_name || '').trim()}`.trim()
        }));
        setStudents(list);
      } catch (err) {
        console.error('Error cargando estudiantes:', err);
        setStudents([]);
      }
    };
    fetchStudents();
  }, []);

  return (
    <div>
      <div className="formcreator-header-section">
        <h1 className="formcreator-title">Crear formulario</h1>
      </div>

      <div className="formcreator-container">
        <div className="formcreator-body">
          <div className="formcreator-questions">
            <div className="student-select-box">
              <label>Estudiante</label>
              <div className="student-row" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <select
                  className="filter-select"
                  value={selectedStudent ? selectedStudent.id : ''}
                  onChange={(e) => {
                    const id = e.target.value;
                    const stu = students.find(s => s.id === id) || null;
                    setSelectedStudent(stu);
                  }}
                  style={{ flex: 2 }}
                >
                  <option value="">Seleccione un estudiante...</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.fullName || (s.first_name + ' ' + s.last_name)}</option>
                  ))}
                </select>

                <input
                  type="email"
                  readOnly
                  value={selectedStudent ? selectedStudent.email : ''}
                  placeholder="Email del estudiante"
                  className="student-email-input"
                  style={{ flex: 1, padding: '12px 14px', fontSize: '18px' }}
                />
              </div>
            </div>

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

