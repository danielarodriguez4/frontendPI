import React, { useState } from 'react';
import '../Estilos/Acompanamiento.css';

const AgregarAcompanamiento = () => {
  const [formData, setFormData] = useState({
    estudiante: '',
    tipo: '',
    profesional: '',
    fecha: '',
    hora: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/acompanamientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      alert('Error al registrar el acompañamiento');
    }
  };

  return (
    <div className="form-container">
      <h2>Añadir Acompañamiento</h2>
      <form onSubmit={handleSubmit}>
        <label>Estudiante:</label>
        <input name="estudiante" value={formData.estudiante} onChange={handleChange} required />

        <label>Tipo de Acompañamiento:</label>
        <select name="tipo" value={formData.tipo} onChange={handleChange} required>
          <option value="">Seleccione...</option>
          <option value="Asesoría Sociopedagógica">Asesoría Sociopedagógica</option>
          <option value="Orientación Sociofamiliar">Orientación Sociofamiliar</option>
          <option value="Psicología">Psicología</option>
        </select>

        <label>Profesional Responsable:</label>
        <input name="profesional" value={formData.profesional} onChange={handleChange} required />

        <label>Fecha:</label>
        <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required />

        <label>Hora:</label>
        <input type="time" name="hora" value={formData.hora} onChange={handleChange} required />

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default AgregarAcompanamiento;
