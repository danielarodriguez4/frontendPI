import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Estilos/StudentForm.css';

const StudentForm = ({ formId }) => {

  const [formConfig, setFormConfig] = useState(null);
  const [studentInfo, setStudentInfo] = useState({
    number_id: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    email: ''
  });
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.title = 'Caracterización FATV';

    if (!formId) {
      setError('Enlace inválido.');
      setLoading(false);
      return;
    }

    const loadForm = async () => {
      try {
        console.log("Cargando formulario con ID:", formId);

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v2/forms/${formId}`
        );

        const config = response.data?.data || response.data;

        let questions = config.questions;

        if (!questions && Array.isArray(config.questions_info)) {
          questions = config.questions_info.map(q => ({
            id: q.id_question,
            text: q.question ||"Pregunta",
            type: q.type,
            options: q.options || q.needed_answers || [],
          }));
        }

        if (!questions || !Array.isArray(questions)) {
          throw new Error("Formato de formulario inválido.");
        }

        setFormConfig({
          ...config,
          questions,
        });

        // Información del estudiante
        if (config.student_info) {
          setStudentInfo({
            number_id: config.student_info.number_id || '',
            first_name: config.student_info.first_name || '',
            last_name: config.student_info.last_name || '',
            phone_number: config.student_info.phone_number || '',
            email: config.student_info.email || ''
          });
        }

        // Respuestas iniciales
        const initial = {};
        questions.forEach(q => {
          initial[q.id] = q.type === 'multiple_choice' ? [] : '';
        });
        setAnswers(initial);



      } catch (err) {
        console.error('Error cargando formulario:', err);
        setError('No se pudo cargar el formulario.');
      } finally {
        setLoading(false);
      }
    };

    loadForm();

    return () => {
      document.title = 'Administrador FATV';
    };
  }, [formId]);

  const handleAnswerChange = (questionId, value, type) => {
    setAnswers(prev => {
      if (type === 'multiple_choice') {
        const exists = prev[questionId]?.includes(value);
        const updated = exists
          ? prev[questionId].filter(v => v !== value)
          : [...prev[questionId], value];
        return { ...prev, [questionId]: updated };
      }
      return { ...prev, [questionId]: value };
    });
  };

  const validateForm = () => {
    if (!studentInfo.first_name.trim()) {
      setError('Por favor ingresa tu nombre');
      return false;
    }
    if (!studentInfo.last_name.trim()) {
      setError('Por favor ingresa tu apellido');
      return false;
    }
    if (!studentInfo.email.trim()) {
      setError('Por favor ingresa tu correo electrónico');
      return false;
    }

    const unanswered = formConfig.questions.filter(q => {
      const value = answers[q.id];
      if (q.type === 'multiple_choice') return !value || value.length === 0;
      return !value || value.trim() === '';
    });

    if (unanswered.length > 0) {
      setError('Por favor responde todas las preguntas');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setError(null);

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        id_form: formId,
        answers: formConfig.questions.map(q => ({
          id_question: q.id,
          answers: Array.isArray(answers[q.id])
            ? answers[q.id]                     
            : [answers[q.id]]                   
          }))
          };
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v2/forms/answers`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error('Error enviando respuestas:', err);
      setError(err.response?.data?.message || 'Error al enviar respuestas');
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (q, index) => {
    const answer = answers[q.id];

    return (
      <div key={q.id} className="gform-question-card">
        <div className="gform-question-title">
          {index + 1}. {q.text}
          <span className="gform-required">*</span>
        </div>

        {q.type === 'text' && (
          <input
            type="text"
            className="gform-text-input"
            value={answer}
            onChange={(e) => handleAnswerChange(q.id, e.target.value, q.type)}
          />
        )}

        {q.type === 'single_choice' && (
          <div className="gform-options">
            {q.options.map((op, i) => (
              <label key={i} className="gform-radio-option">
                <input
                  type="radio"
                  name={q.id}
                  value={op}
                  checked={answer === op}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value, q.type)}
                />
                {op}
              </label>
            ))}
          </div>
        )}

        {q.type === 'multiple_choice' && (
          <div className="gform-options">
            {q.options.map((op, i) => (
              <label key={i} className="gform-checkbox-option">
                <input
                  type="checkbox"
                  value={op}
                  checked={answer.includes(op)}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value, q.type)}
                />
                {op}
              </label>
            ))}
          </div>
        )}

        {q.type === 'true_false' && (
          <div className="gform-options">
            {['Verdadero', 'Falso'].map((op, i) => (
              <label key={i} className="gform-radio-option">
                <input
                  type="radio"
                  name={q.id}
                  value={op}
                  checked={answer === op}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value, q.type)}
                />
                {op}
              </label>
            ))}
          </div>
        )}

      </div>
    );
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="gform-error">{error}</div>;
  if (success) return <div className="gform-success">¡Formulario enviado con éxito!</div>;

return (
    <div className="gform-container">
      <div className="gform-header">
        <h1 className="gform-title">{formConfig.name}</h1>
        <p className="gform-description">{formConfig.description}</p>
      </div>
      <div className="gform-section">
        <h2 className="gform-section-title">Información del estudiante</h2>

        <div className="gform-field">
          <label className="gform-label">
            Documento de identidad <span className="gform-required">*</span>
          </label>
          <input
            type="text"
            className="gform-input"
            value={studentInfo.number_id}
            onChange={(e) =>
              setStudentInfo({ ...studentInfo, number_id: e.target.value })
            }
          />
        </div>

        <div className="gform-field">
          <label className="gform-label">Nombre *</label>
          <input
            type="text"
            className="gform-input"
            value={studentInfo.first_name}
            onChange={(e) =>
              setStudentInfo({ ...studentInfo, first_name: e.target.value })
            }
          />
        </div>

        <div className="gform-field">
          <label className="gform-label">Apellido *</label>
          <input
            type="text"
            className="gform-input"
            value={studentInfo.last_name}
            onChange={(e) =>
              setStudentInfo({ ...studentInfo, last_name: e.target.value })
            }
          />
        </div>

        <div className="gform-field">
          <label className="gform-label">Correo *</label>
          <input
            type="email"
            className="gform-input"
            value={studentInfo.email}
            onChange={(e) =>
              setStudentInfo({ ...studentInfo, email: e.target.value })
            }
          />
        </div>
      </div>

      {/* PREGUNTAS */}
      {formConfig.questions.map((q, index) => (
        <div key={q.id} className="gform-question-card">
          <div className="gform-question-title">{q.text}</div>
          {renderQuestion(q, index)}
        </div>
      ))}

      {/* FOOTER */}
      <div className="gform-footer">
        <button
          className="gform-submit-btn"
          disabled={submitting}
          onClick={handleSubmit}
        >
          {submitting ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
);
};

export default StudentForm;
 