import React, { useState } from 'react';
import axios from 'axios';
import './Datoscontacto.css';
import './index.css';
import Botones from './Botones';

const API_URL = process.env.REACT_APP_BACKEND_URL;

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

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwt');

        if (!token) {
            alert('No tienes permiso para realizar esta acción. Inicia sesión.');
            return;
        }

        setLoading(true); 

        try {
            await axios.post(`${API_URL}/students`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert('Datos guardados con éxito');
            setFormData({
                fullName: '',
                idNumber: '',
                phoneNumber: '',
                personalEmail: '',
                institutionalEmail: '',
                residence: '',
                semester: '',
                university: ''
            });
        } catch (error) {
            console.error('Error al enviar los datos', error);
            alert('Hubo un error al guardar los datos');
        }

        setLoading(false);
    };

    return (
        <div className="container">
            <div className="sidebar">
                <Botones />
                <div className='logo-container'> 
                    <img src="/logo.png" className="logo" alt="logo" />
                </div>  
            </div>
    
            <div className="white-square">
                <div className="form-grid">     
                    <h2>Datos del estudiante</h2>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div>
                            <label>Nombre completo</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
                        </div>
    
                        <div>
                            <label>Número de identificación</label>
                            <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} required />
                        </div>
    
                        <div>
                            <label>Número de celular</label>
                            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                        </div>
    
                        <div>
                            <label>Correo personal</label>
                            <input type="email" name="personalEmail" value={formData.personalEmail} onChange={handleChange} required />
                        </div>
    
                        <div>
                            <label>Correo institucional</label>
                            <input type="email" name="institutionalEmail" value={formData.institutionalEmail} onChange={handleChange} required />
                        </div>
    
                        <div>
                            <label>Lugar de residencia</label>
                            <input type="text" name="residence" value={formData.residence} onChange={handleChange} required />
                        </div>
    
                        <div>
                            <label>Semestre</label>
                            <input type="text" name="semester" value={formData.semester} onChange={handleChange} required />
                        </div>
    
                        <div>
                            <label>Universidad</label>
                            <input type="text" name="university" value={formData.university} onChange={handleChange} required />
                        </div>
    
                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? "Guardando..." : "Guardar"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
    
};

export default ContactForm;
