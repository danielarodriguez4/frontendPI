import React, { useState, useEffect, useRef } from 'react';
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

  // Estados para el autocompletado de estudiantes
  const [studentQuery, setStudentQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const studentInputRef = useRef(null);

  // Estados para listas
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
      
      const filteredStudents = (response.data.data || []).map(student => ({
        id: student.id,
        first_name: student.first_name,
        last_name: student.last_name,
        fullName: `${student.first_name} ${student.last_name}`
      }));
      
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
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/session-type/all`, 
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

  // Función para filtrar estudiantes basado en la búsqueda
  const handleStudentInputChange = (e) => {
    const query = e.target.value;
    setStudentQuery(query);
    
    if (query.length > 0) {
      const filtered = students.filter(student =>
        student.fullName.toLowerCase().includes(query.toLowerCase()) ||
        student.first_name.toLowerCase().includes(query.toLowerCase()) ||
        student.last_name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredStudents(filtered);
      setShowStudentDropdown(true);
    } else {
      setFilteredStudents([]);
      setShowStudentDropdown(false);
      setSelectedStudent(null);
      setFormData(prev => ({ ...prev, estudiante: '' }));
    }
  };

  // Función para seleccionar un estudiante
  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setStudentQuery(student.fullName);
    setShowStudentDropdown(false);
    setFormData(prev => ({ ...prev, estudiante: student.id }));
  };

  // Función para manejar el clic fuera del dropdown
  const handleClickOutside = (event) => {
    if (studentInputRef.current && !studentInputRef.current.contains(event.target)) {
      setShowStudentDropdown(false);
    }
  };

  // Effect para manejar clics fuera del componente
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedStudent) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor selecciona un estudiante válido',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#d33'
      });
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      const backendData = {
        id_student: formData.estudiante,
        id_companion: formData.profesional,
        id_session_type: formData.tipo,
        notes: formData.observaciones,
        date: `${formData.fecha}T${formData.hora}`
      };

      console.log('Datos enviados al backend:', backendData);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/session/`, 
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
      setStudentQuery('');
      setSelectedStudent(null);
      setShowStudentDropdown(false);
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
        <div className="autocomplete-container" ref={studentInputRef}>
          <input
            type="text"
            value={studentQuery}
            onChange={handleStudentInputChange}
            placeholder="Buscar estudiante por nombre..."
            required
            style={{ 
              minHeight: '40px', 
              padding: '8px',
              width: '100%',
              border: selectedStudent ? '2px solid #28a745' : '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          {showStudentDropdown && filteredStudents.length > 0 && (
            <div className="autocomplete-dropdown">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="autocomplete-item"
                  onClick={() => handleStudentSelect(student)}
                  style={{
                    padding: '10px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee',
                    backgroundColor: '#fff'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f0f0f0';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#fff';
                  }}
                >
                  {student.fullName}
                </div>
              ))}
            </div>
          )}
          {showStudentDropdown && filteredStudents.length === 0 && studentQuery.length > 0 && (
            <div className="autocomplete-dropdown">
              <div className="autocomplete-item" style={{ padding: '10px', color: '#666' }}>
                No se encontraron estudiantes
              </div>
            </div>
          )}
        </div>

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