import React, { useState } from 'react';
import axios from 'axios';
import './Datoscontacto.css';
import './index.css';
import Botones from './Botones';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ContactForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
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
            alert('No tienes permiso para realizar esta acción.');
            return;
        }

        setLoading(true); 

        try {
            await axios.post(`${API_URL}/api/info`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert('Datos guardados con éxito');
            setFormData({
                firstName: '',
                lastName: '',
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
                    <h2>Registrar estudiante</h2>
                    <form onSubmit={handleSubmit} className="contact-form">
                    <div>
                            <label>Nombre</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                        </div>

                        <div>
                            <label>Apellido</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
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
                            <select
                                name="semester"
                                value={formData.semester}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione</option>
                                {[...Array(9)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Universidad</label>
                            <select
                                name="university"
                                value={formData.university}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione</option>
                                <option value="Universidad de Antioquia">Universidad de Antioquia</option>
                                <option value="Universidad Nacional">Universidad Nacional</option>
                                <option value="Universidad EAFIT">Universidad EAFIT</option>
                            </select>
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
