import React, { useState, useEffect, useRef } from 'react';
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
  const [mode, setMode] = useState('select'); // 'select' or 'manual'
  const [manualQuestions, setManualQuestions] = useState([{ id: 'm1', text: '', type: 'text', options: [] }]);
  const [configuredQuestions, setConfiguredQuestions] = useState({});
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  const toggleQuestion = (id) => {
    setSelected(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      if (!prev.includes(id)) {
        setConfiguredQuestions(cfg => ({ ...cfg, [id]: { type: 'text', options: [] } }));
      }
      if (prev.includes(id)) {
        setConfiguredQuestions(cfg => {
          const copy = { ...cfg };
          delete copy[id];
          return copy;
        });
      }
      return next;
    });
  };

  const handleSend = async () => {
    setFormError(null);
    setFormSuccess(null);
    const questionsPayload = mode === 'select'
      ? questions.filter(q => selected.includes(q.id)).map(q => ({ id: q.id, text: q.text, type: configuredQuestions[q.id]?.type || 'text', options: configuredQuestions[q.id]?.options || [] }))
      : manualQuestions.filter(m => (m.text || '').trim()).map((m, idx) => ({ id: `manual_${idx + 1}`, text: m.text, type: m.type || 'text', options: m.options || [] }));

    if (!selectedStudent) {
      setFormError('Seleccione un estudiante antes de enviar.');
      return;
    }
    if (!questionsPayload || questionsPayload.length === 0) {
      setFormError('Agregue al menos una pregunta con texto antes de enviar.');
      return;
    }

    const payload = {
      first_name: selectedStudent.id,
      questions: questionsPayload
    };

    console.log('Payload a enviar:', payload);

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const resp = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v2/forms`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      console.log('Respuesta del backend:', resp.data);
      setFormSuccess('Formulario enviado correctamente.');
    } catch (err) {
      console.error('Error enviando formulario:', err);
      const msg = err?.response?.data?.message || err.message || 'Error al enviar formulario';
      setFormError(msg);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v2/students/all`,
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

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
              <div className="student-row">
                <div className="student-suggestions-wrapper" ref={suggestionsRef}>
                  <input
                    type="text"
                    className="student-search-input"
                    placeholder="Buscar estudiante por nombre..."
                    value={selectedStudent ? selectedStudent.fullName : searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowSuggestions(true);
                      setSelectedStudent(null);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                  />
                  {showSuggestions && (
                    <ul className="student-suggestions">
                      {students.filter(s => (s.fullName || '').toLowerCase().includes((searchTerm || '').toLowerCase())).slice(0, 50).map(s => (
                        <li key={s.id} onMouseDown={() => { setSelectedStudent(s); setShowSuggestions(false); setSearchTerm(''); }}>
                          <span className="s-name">{s.fullName || `${s.first_name} ${s.last_name}`}</span>
                          <span className="s-email">{s.email}</span>
                        </li>
                      ))}
                      {students.filter(s => (s.fullName || '').toLowerCase().includes((searchTerm || '').toLowerCase())).length === 0 && (
                        <li className="no-students">No se encontraron</li>
                      )}
                    </ul>
                  )}
                </div>

                <input
                  type="email"
                  readOnly
                  value={selectedStudent ? selectedStudent.email : ''}
                  placeholder="Email del estudiante"
                  className="student-email-input"
                />
                <button className="clear-student-btn" onClick={() => { setSelectedStudent(null); setSearchTerm(''); setShowSuggestions(false); }}>Limpiar</button>
              </div>
            </div>

            <div className="mode-switch">
              <button className={"mode-btn " + (mode === 'select' ? 'active' : '')} onClick={() => setMode('select')}>Seleccionar preguntas</button>
              <button className={"mode-btn " + (mode === 'manual' ? 'active' : '')} onClick={() => setMode('manual')}>Crear preguntas manualmente</button>
            </div>

            {mode === 'select' ? (
              <>
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
                {/* Configuration area for selected questions */}
                {selected.length > 0 && (
                  <div className="selected-config">
                    <h4>Configurar respuestas para preguntas seleccionadas</h4>
                    {selected.map((id) => {
                      const q = questions.find(x => x.id === id) || { id, text: id };
                      const cfg = configuredQuestions[id] || { type: 'text', options: [] };
                      return (
                        <div key={id} className="config-row">
                          <div className="config-question-text">{q.text}</div>
                          <select value={cfg.type} onChange={(e) => setConfiguredQuestions(c => ({ ...c, [id]: { ...c[id], type: e.target.value, options: e.target.value === 'true_false' ? ['Verdadero','Falso'] : (c[id]?.options || []) } }))} className="config-type-select">
                            <option value="text">Texto libre</option>
                            <option value="single_choice">Opción única</option>
                            <option value="multiple_choice">Múltiple respuesta</option>
                            <option value="true_false">Verdadero / Falso</option>
                          </select>
                          {(cfg.type === 'single_choice' || cfg.type === 'multiple_choice') && (
                            <div className="options-editor">
                              {(cfg.options || []).map((opt, idx) => (
                                <div key={idx} className="option-row">
                                  <input value={opt} onChange={(e) => setConfiguredQuestions(c => {
                                    const copy = { ...c };
                                    copy[id] = { ...copy[id], options: (copy[id].options || []).map((o, i) => i === idx ? e.target.value : o) };
                                    return copy;
                                  })} className="option-input" />
                                  <button className="remove-option-btn" onClick={() => setConfiguredQuestions(c => {
                                    const copy = { ...c };
                                    copy[id] = { ...copy[id], options: (copy[id].options || []).filter((_, i) => i !== idx) };
                                    return copy;
                                  })}>Eliminar</button>
                                </div>
                              ))}
                              <button className="add-option-btn" onClick={() => setConfiguredQuestions(c => ({ ...c, [id]: { ...c[id], options: [...(c[id]?.options || []), ''] } }))}>Agregar opción</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <>
                <h3>Crear preguntas manualmente</h3>
                <div className="manual-questions">
                  {manualQuestions.map((mq, idx) => (
                    <div key={mq.id} className="manual-question-row">
                      <input
                        type="text"
                        placeholder={`Pregunta ${idx + 1}`}
                        value={mq.text}
                        onChange={(e) => {
                          const txt = e.target.value;
                          setManualQuestions(prev => prev.map(p => p.id === mq.id ? { ...p, text: txt } : p));
                        }}
                        className="manual-question-input"
                      />
                      <select value={mq.type} onChange={(e) => setManualQuestions(prev => prev.map(p => p.id === mq.id ? { ...p, type: e.target.value, options: e.target.value === 'true_false' ? ['Verdadero','Falso'] : (p.options || []) } : p))} className="manual-type-select">
                        <option value="text">Texto libre</option>
                        <option value="single_choice">Opción única</option>
                        <option value="multiple_choice">Múltiple respuesta</option>
                        <option value="true_false">Verdadero / Falso</option>
                      </select>
                      {(mq.type === 'single_choice' || mq.type === 'multiple_choice') && (
                        <div className="manual-options-editor">
                          {(mq.options || []).map((opt, i) => (
                            <div key={i} className="manual-option-row">
                              <input value={opt} onChange={(e) => setManualQuestions(prev => prev.map(p => p.id === mq.id ? { ...p, options: p.options.map((o, idx2) => idx2 === i ? e.target.value : o) } : p))} className="option-input" />
                              <button className="remove-option-btn" onClick={() => setManualQuestions(prev => prev.map(p => p.id === mq.id ? { ...p, options: p.options.filter((_, ii) => ii !== i) } : p))}>Eliminar</button>
                            </div>
                          ))}
                          <button className="add-option-btn" onClick={() => setManualQuestions(prev => prev.map(p => p.id === mq.id ? { ...p, options: [...(p.options || []), ''] } : p))}>Agregar opción</button>
                        </div>
                      )}
                      <button className="remove-question-btn" onClick={() => setManualQuestions(prev => prev.filter(p => p.id !== mq.id))}>Eliminar</button>
                    </div>
                  ))}
                  <div style={{ marginTop: 8 }}>
                    <button className="add-question-btn" onClick={() => setManualQuestions(prev => [...prev, { id: `m${Date.now()}`, text: '', type: 'text', options: [] }])}>Agregar pregunta</button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="formcreator-footer">
            <div className="form-footer-row">
              {formError && <div className="form-error">{formError}</div>}
              {formSuccess && <div className="form-success">{formSuccess}</div>}
              <Button variant="contained" color="primary" onClick={handleSend} disabled={sending} className="send-btn">{sending ? 'Enviando...' : 'Enviar formulario'}</Button>
            </div>
          </div>
         </div>
       </div>
     </div>
   );
};

export default FormCreator;
