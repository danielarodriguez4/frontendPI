import React, { useState } from 'react';
import axios from 'axios';
import './Datoscontacto.css';
import './index.css';
import Botones from './Botones';
import StudentTable from './StudentTable';


const API_URL = process.env.REACT_APP_BACKEND_URL;

const ContactForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        idNumber: '',
        phoneNumber: '',
        personalEmail: '',
        institutionalEmail: '',
        streetType: '',
        streetNumber: '',
        buildingNumber: '',
        apartment: '',
        municipality: '',
        semester: '',
        university: ''
    });

    const [loading, setLoading] = useState(false);
    const [currentView, setCurrentView] = useState('registrar');

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

        const fullAddress = `${formData.streetType} ${formData.streetNumber} #${formData.buildingNumber}` +
            (formData.apartment ? ` Apt ${formData.apartment}` : '') +
            `, ${formData.municipality}`;

        const dataToSend = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            idNumber: formData.idNumber,
            phoneNumber: formData.phoneNumber,
            personalEmail: formData.personalEmail,
            institutionalEmail: formData.institutionalEmail,
            residence: fullAddress, 
            semester: formData.semester,
            university: formData.university
        };

        console.log("API_URL:", API_URL);
        console.log("Data to send:", dataToSend);
        try {
            await axios.post(`${API_URL}/api/v0/user/1`, dataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }        
            });
            alert('Datos guardados con éxito');
            console.log('Token JWT:', token);

            setFormData({
                firstName: '',
                lastName: '',
                idNumber: '',
                phoneNumber: '',
                personalEmail: '',
                institutionalEmail: '',
                streetType: '',
                streetNumber: '',
                buildingNumber: '',
                apartment: '',
                municipality: '',
                semester: '',
                university: ''
            });
        } catch (error) {
            console.error('Error al enviar los datos', error);
            alert('Hubo un error al guardar los datos');
        }
        setLoading(false);
    };

    const handleNavigate = (view) => {
        setCurrentView(view);
    };

    return (
        <div className="container">
            <div className="sidebar">
                <img src="/logo1.png" className="logo" alt="logo" />
                <Botones onNavigate={handleNavigate} />
            </div>
            <div className="form-grid">  
                {currentView === 'registrar' && (
                    <div>  
                    <h2>Registrar estudiante</h2>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div>
                            <label>Nombre <span className="required-asterisk">*</span></label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                        </div>

                        <div>
                            <label>Apellido <span className="required-asterisk">*</span></label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                        </div>

                        <div>
                            <label>Número de identificación <span className="required-asterisk">*</span></label>
                            <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} required />
                        </div>

                        <div>
                            <label>Número de celular <span className="required-asterisk">*</span></label>
                            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                        </div>

                        <div>
                            <label>Correo personal <span className="required-asterisk">*</span></label>
                            <input type="email" name="personalEmail" value={formData.personalEmail} onChange={handleChange} required />
                        </div>

                        <div>
                            <label>Correo institucional <span className="required-asterisk">*</span></label>
                            <input type="email" name="institutionalEmail" value={formData.institutionalEmail} onChange={handleChange} required />
                        </div>

                        <fieldset className="direccion-group">
                            <legend>Dirección de residencia</legend>

                            <div className="direccion-row">
                                <div className="direccion-col">
                                    <label>Tipo de vía <span className="required-asterisk">*</span></label>
                                    <select name="streetType" value={formData.streetType} onChange={handleChange} required>
                                        <option value="">Seleccione</option>
                                        <option value="Avenida">Avenida</option>
                                        <option value="Calle">Calle</option>
                                        <option value="Carrera">Carrera</option>
                                        <option value="Transversal">Transversal</option>
                                    </select>
                                </div>

                                <div className="direccion-col">
                                    <label>Número de vía <span className="required-asterisk">*</span></label>
                                    <input type="text" name="streetNumber" value={formData.streetNumber} onChange={handleChange} required />
                                </div>

                                <div className="direccion-col">
                                    <label># de casa o edificio <span className="required-asterisk">*</span></label>
                                    <input type="text" name="buildingNumber" value={formData.buildingNumber} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="direccion-row">
                                <div className="direccion-col">
                                    <label>Apartamento (si aplica)</label>
                                    <input type="text" name="apartment" value={formData.apartment} onChange={handleChange} />
                                </div>

                                <div className="direccion-col">
                                    <label>Municipio <span className="required-asterisk">*</span></label>
                                    <select name="municipality" value={formData.municipality} onChange={handleChange} required>
                                        <option value="">Seleccione</option>
                                        <option value="Bello">Bello</option>
                                        <option value="Medellín">Medellín</option>
                                        <option value="Itagüí">Itagüí</option>
                                        <option value="Sabaneta">Sabaneta</option>
                                        <option value="La Estrella">La Estrella</option>
                                    </select>
                                </div>
                            </div>
                        </fieldset>


                        <div>
                            <label>Semestre <span className="required-asterisk">*</span></label>
                            <select name="semester" value={formData.semester} onChange={handleChange} required>
                                <option value="">Seleccione</option>
                                {[...Array(9)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Universidad <span className="required-asterisk">*</span></label>
                            <select name="university" value={formData.university} onChange={handleChange} required>
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
                )}

                {currentView === 'editar' && <StudentTable />} {/* Vista de estudiantes */}
            </div>
        </div>
    );
};

export default ContactForm;