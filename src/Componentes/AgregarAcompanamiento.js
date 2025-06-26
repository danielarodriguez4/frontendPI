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

  // Estado para almacenar la lista de estudiantes
  const [students, setStudents] = useState([]);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/session`, 
        formData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Creada:', response.data);
      
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
      Swal.fire({
        title: 'Error',
        text: 'Error al registrar el acompañamiento',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#d33'
      });
    }
  };

  // Cargar estudiantes al montar el componente
  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="form-container">
      <h2>Añadir Acompañamiento</h2>
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
          <option value="Asesoría Sociopedagógica">Asesoría Sociopedagógica</option>
          <option value="Orientación Sociofamiliar">Orientación Sociofamiliar</option>
          <option value="Psicología">Psicología</option>
        </select>

        <label>Profesional Responsable:</label>
        <input 
          name="profesional" 
          value={formData.profesional} 
          onChange={handleChange} 
          placeholder="Nombre del profesional"
          required 
        />

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