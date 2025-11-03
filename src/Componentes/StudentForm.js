import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../Estilos/StudentForm.css';

const StudentForm = () => {
  const { formId } = useParams();
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
    const fetchFormConfig = async () => {
      try {
        // Intentar obtener la configuración del formulario desde el backend
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v2/forms/${formId}`
        );
        
        const config = response.data?.data || response.data;
        setFormConfig(config);
        
        // Pre-cargar la información del estudiante desde la configuración
        if (config.studentInfo) {
          setStudentInfo({
            number_id: config.studentInfo.number_id || '',
            first_name: config.studentInfo.first_name || '',
            last_name: config.studentInfo.last_name || '',
            phone_number: config.studentInfo.phone_number || '',
            email: config.studentInfo.email || ''
          });
        }
        
        // Inicializar respuestas vacías
        const initialAnswers = {};
        config.questions.forEach(q => {
          if (q.type === 'multiple_choice') {
            initialAnswers[q.id] = [];
          } else {
            initialAnswers[q.id] = '';
          }
        });
        setAnswers(initialAnswers);
        setLoading(false);
      } catch (err) {
        console.error('Error cargando formulario:', err);
        setError('No se pudo cargar el formulario. Verifica que el enlace sea correcto.');
        setLoading(false);
      }
    };

    fetchFormConfig();
  }, [formId]);

  const handleStudentInfoChange = (field, value) => {
    setStudentInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleAnswerChange = (questionId, value, questionType) => {
    setAnswers(prev => {
      if (questionType === 'multiple_choice') {
        const currentAnswers = prev[questionId] || [];
        const newAnswers = currentAnswers.includes(value)
          ? currentAnswers.filter(v => v !== value)
          : [...currentAnswers, value];
        return { ...prev, [questionId]: newAnswers };
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
      const answer = answers[q.id];
      if (q.type === 'multiple_choice') {
        return !answer || answer.length === 0;
      }
      return !answer || answer.trim() === '';
    });
    
    if (unanswered.length > 0) {
      setError('Por favor responde todas las preguntas antes de enviar');
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
      const answersPayload = formConfig.questions.map(q => ({
        question_id: q.id,
        question_text: q.text,
        answer: answers[q.id]
      }));

      const payload = {
        student: {
          number_id: studentInfo.number_id,
          first_name: studentInfo.first_name,
          last_name: studentInfo.last_name,
          phone_number: studentInfo.phone_number,
          email: studentInfo.email
        },
        answers: answersPayload
      };

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v2/forms/answers`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error enviando respuestas:', err);
      const errorMsg = err?.response?.data?.message || err.message || 'Error al enviar las respuestas';
      setError(errorMsg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question, index) => {
    const answer = answers[question.id];

    return (
      <div key={question.id} className="gform-question-card">
        <div className="gform-question-title">
          {question.text}
          <span className="gform-required">*</span>
        </div>
        
        {question.type === 'text' && (
          <input
            type="text"
            className="gform-text-input"
            value={answer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value, question.type)}
            placeholder="Tu respuesta"
          />
        )}

        {question.type === 'single_choice' && (
          <div className="gform-options">
            {question.options.map((option, idx) => (
              <label key={idx} className="gform-radio-option">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={answer === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value, question.type)}
                />
                <span className="gform-option-text">{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'multiple_choice' && (
          <div className="gform-options">
            {question.options.map((option, idx) => (
              <label key={idx} className="gform-checkbox-option">
                <input
                  type="checkbox"
                  value={option}
                  checked={(answer || []).includes(option)}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value, question.type)}
                />
                <span className="gform-option-text">{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'true_false' && (
          <div className="gform-options">
            {(question.options || ['Verdadero', 'Falso']).map((option, idx) => (
              <label key={idx} className="gform-radio-option">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={answer === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value, question.type)}
                />
                <span className="gform-option-text">{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="gform-loading">
        <div className="gform-spinner"></div>
        <p>Cargando formulario...</p>
      </div>
    );
  }

  if (error && !formConfig) {
    return (
      <div className="gform-error-page">
        <div className="gform-error-icon">⚠️</div>
        <h2>Error al cargar el formulario</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="gform-success-page">
        <div className="gform-success-icon">✓</div>
        <h1>¡Respuesta registrada!</h1>
        <p>Gracias por completar el formulario, {studentInfo.first_name}.</p>
        <p className="gform-success-subtitle">Tus respuestas han sido guardadas correctamente.</p>
      </div>
    );
  }

  return (
    <div className="gform-container">
      <div className="gform-header">
        <div className="gform-header-bar"></div>
        <h1 className="gform-title">Formulario de seguimiento</h1>
        <p className="gform-description">Por favor completa la siguiente información</p>
      </div>

      {error && (
        <div className="gform-error-banner">
          <span className="gform-error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="gform-section">
        <div className="gform-section-title">Información personal</div>
        
        <div className="gform-field">
          <label className="gform-label">
            Número de identificación
          </label>
          <input
            type="text"
            className="gform-input"
            value={studentInfo.number_id}
            onChange={(e) => handleStudentInfoChange('number_id', e.target.value)}
            placeholder="Ingresa tu número de documento"
          />
        </div>

        <div className="gform-field">
          <label className="gform-label">
            Nombre <span className="gform-required">*</span>
          </label>
          <input
            type="text"
            className="gform-input"
            value={studentInfo.first_name}
            onChange={(e) => handleStudentInfoChange('first_name', e.target.value)}
            placeholder="Ingresa tu nombre"
            required
          />
        </div>

        <div className="gform-field">
          <label className="gform-label">
            Apellido <span className="gform-required">*</span>
          </label>
          <input
            type="text"
            className="gform-input"
            value={studentInfo.last_name}
            onChange={(e) => handleStudentInfoChange('last_name', e.target.value)}
            placeholder="Ingresa tu apellido"
            required
          />
        </div>

        <div className="gform-field">
          <label className="gform-label">
            Teléfono
          </label>
          <input
            type="tel"
            className="gform-input"
            value={studentInfo.phone_number}
            onChange={(e) => handleStudentInfoChange('phone_number', e.target.value)}
            placeholder="Ingresa tu número de teléfono"
          />
        </div>

        <div className="gform-field">
          <label className="gform-label">
            Correo electrónico <span className="gform-required">*</span>
          </label>
          <input
            type="email"
            className="gform-input"
            value={studentInfo.email}
            onChange={(e) => handleStudentInfoChange('email', e.target.value)}
            placeholder="tu.email@ejemplo.com"
            required
          />
        </div>
      </div>

      {formConfig.questions.map((question, index) => renderQuestion(question, index))}

      <div className="gform-footer">
        <button
          className="gform-submit-btn"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Enviando...' : 'Enviar'}
        </button>
        <p className="gform-footer-text">
          Nunca envíes contraseñas a través de Formularios de Google.
        </p>
      </div>
    </div>
  );
};

export default StudentForm;