import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../Estilos/Acompanamiento.css';

const AgregarAcompanamiento = () => {
  const [formData, setFormData] = useState({
    estudiante: '',
    tipo: '',
    profesional: '',
    fecha: '',
    hora: '',
    observaciones: '',
  });

  // Estado para almacenar la lista de estudiantes, profesionales y tipos de sesión
  const [students, setStudents] = useState([]);
  const [companions, setCompanions] = useState([]);
  const [sessionTypes, setSessionTypes] = useState([]);

  // Función para obtener lista de estudiantes
  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/student/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      
      console.log('Estudiantes obtenidos:', response.data);
      
      // Obtener solo nombre y apellido
      const filteredStudents = (response.data.data || []).map(student => ({
        id: student.id,
        first_name: student.first_name,
        last_name: student.last_name
      }));
      console.log('Respuesta del backend:', response.data);
      
      setStudents(filteredStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al cargar la lista de estudiantes',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#d33'
      });
    }
  };

  // Función para obtener lista de profesionales
  const fetchCompanions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/companion/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Profesionales obtenidos:', response.data);

      const filteredCompanions = (response.data.data || []).map(companion => ({
        id: companion.id,
        first_name: companion.first_name,
        last_name: companion.last_name
      }));

      setCompanions(filteredCompanions);
    } catch (error) {
      console.error('Error fetching companions:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al cargar la lista de profesionales',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#d33',
      });
    }
  };

  // Función para obtener tipos de sesión
  const fetchSessionTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/session-types/all`, // Ajusta esta URL según tu API
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Tipos de sesión obtenidos:', response.data);

      const filteredSessionTypes = (response.data.data || []).map(sessionType => ({
        id: sessionType._id || sessionType.id,
        name: sessionType.name
      }));

      setSessionTypes(filteredSessionTypes);
    } catch (error) {
      console.error('Error fetching session types:', error);
      // Si no hay endpoint para tipos de sesión, usar datos del CSV como fallback
      const fallbackSessionTypes = [
        { id: '686090b367343360f5acecaa', name: 'Asesoría Sociopedagógica (ASP)' },
        { id: '686090d467343360f5acecab', name: 'Tutoría' },
        { id: '686090df67343360f5acecac', name: 'Grupo de estudio' },
        { id: '686090f367343360f5acecad', name: 'Taller socioemocional' },
        { id: '6860912167343360f5acecae', name: 'Psicorientación' },
        { id: '6860912c67343360f5acecaf', name: 'Orientación sociofamiliar' },
        { id: '6860913867343360f5acecb0', name: 'Orientación a Bienestar' }
      ];
      setSessionTypes(fallbackSessionTypes);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      // Formatear los datos según lo que espera el backend
      const backendData = {
        id_student: formData.estudiante,
        id_companion: formData.profesional,
        id_session_type: formData.tipo,
        notes: formData.observaciones,
        date: `${formData.fecha}T${formData.hora}:00.000Z` // Formato ISO con fecha y hora
      };

      console.log('Datos enviados al backend:', backendData);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/session`, 
        backendData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Sesión creada:', response.data);
      
      // Alerta de éxito
      Swal.fire({
        title: '¡Éxito!',
        text: 'Acompañamiento creado exitosamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#28a745'
      });
      
      // Limpiar el formulario después de enviar exitosamente
      setFormData({
        estudiante: '',
        tipo: '',
        profesional: '',
        fecha: '',
        hora: '',
        observaciones: '',
      });
    } catch (error) {
      console.error('Error:', error);
      console.error('Error details:', error.response?.data);
      
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Error al registrar el acompañamiento',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#d33'
      });
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchStudents();
    fetchCompanions();
    fetchSessionTypes();
  }, []);

  return (
    <div className="form-container">
      <h2>Añadir acompañamiento</h2>
      <form onSubmit={handleSubmit}>
        <label>Estudiante:</label>
        <select
          name="estudiante"
          value={formData.estudiante}
          onChange={handleChange}
          required
          style={{ minHeight: '40px', padding: '8px' }}
        >
          <option value="">Seleccione un estudiante</option>
          {students.length > 0 ? (
            students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.first_name} {student.last_name}
              </option>
            ))
          ) : (
            <option value="" disabled>Cargando estudiantes...</option>
          )}
        </select>

        <label>Tipo de Acompañamiento:</label>
        <select name="tipo" value={formData.tipo} onChange={handleChange} required>
          <option value="">Seleccione...</option>
          {sessionTypes.length > 0 ? (
            sessionTypes.map((sessionType) => (
              <option key={sessionType.id} value={sessionType.id}>
                {sessionType.name}
              </option>
            ))
          ) : (
            <option value="" disabled>Cargando tipos de sesión...</option>
          )}
        </select>

        <label>Profesional Responsable:</label>
        <select
          name="profesional"
          value={formData.profesional}
          onChange={handleChange}
          required
          style={{ minHeight: '40px', padding: '8px' }}
        >
          <option value="">Seleccione un profesional</option>
          {companions.length > 0 ? (
            companions.map((companion) => (
              <option key={companion.id} value={companion.id}>
                {companion.first_name} {companion.last_name}
              </option>
            ))
          ) : (
            <option value="" disabled>Cargando profesionales...</option>
          )}
        </select>

        <label>Fecha:</label>
        <input 
          type="date" 
          name="fecha" 
          value={formData.fecha} 
          onChange={handleChange} 
          required 
        />

        <label>Hora:</label>
        <input 
          type="time" 
          name="hora" 
          value={formData.hora} 
          onChange={handleChange} 
          required 
        />

        <label>Observaciones:</label>
        <textarea
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          placeholder="Escriba aquí las observaciones sobre el acompañamiento (opcional)"
          rows="4"
          className="observaciones-textarea"
        />

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default AgregarAcompanamiento;