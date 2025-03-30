import React, { useState } from 'react';
import axios from 'axios';
import './Datoscontacto.css';
import './index.css';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        idNumber: '',
        phoneNumber: '',
        personalEmail: '',
        institutionalEmail: '',
        residence: '',
        semester: '',
        university: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('jwt');
            await axios.post('https://your-backend.com/api/students', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert('Datos guardados con éxito');
        } catch (error) {
            console.error('Error al enviar los datos', error);
            alert('Hubo un error al guardar los datos');
        }
    };

    return (
        <div className="contact-form-container">
            <h2>Datos del Estudiante</h2>
            <form onSubmit={handleSubmit} className="contact-form">
                <label>Nombre Completo</label>
                <input type="text" name="fullName" onChange={handleChange} required />

                <label>Número de Identificación</label>
                <input type="text" name="idNumber" onChange={handleChange} required />

                <label>Número de Celular</label>
                <input type="text" name="phoneNumber" onChange={handleChange} required />

                <label>Correo Personal</label>
                <input type="email" name="personalEmail" onChange={handleChange} required />

                <label>Correo Institucional</label>
                <input type="email" name="institutionalEmail" onChange={handleChange} required />

                <label>Lugar de Residencia</label>
                <input type="text" name="residence" onChange={handleChange} required />

                <label>Semestre</label>
                <input type="text" name="semester" onChange={handleChange} required />

                <label>Universidad</label>
                <input type="text" name="university" onChange={handleChange} required />

                <button type="submit" className="submit-button">Guardar</button>
            </form>
        </div>
    );
};

export default ContactForm;
