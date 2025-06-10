/* Componente para registrar estudiantes. Aquí se encuentra toda la lógica de la visualización del form */
import React, { useState } from 'react';
import axios from 'axios';
import './Estilos/Datoscontacto.css';
import './index.css';
import Botones from './Componentes/Botones';
import StudentTable from './Componentes/StudentTable';
import UserInfoBar from './Componentes/UserInfoBar';
import DashboardMetrica from './Componentes/DashboardMetrica';
import AgregarAcompañamiento from './Componentes/AgregarAcompanamiento';

const API_URL = process.env.REACT_APP_BACKEND_URL;

/*El back debe regresar en esta sección el nombre y rol de la persona que ingresó. De momento, se hace de forma local */
const ContactForm = () => {
    const user = {
        name: 'Daniel León',
        role: 'Administrador'
    };

    /*Datos que se envían al backend luego de llenar el form*/
    const [formData, setFormData] = useState({
        id_number: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        email: '',
        institution_email: '',
        streetType: '',
        streetNumber: '',
        buildingNumber: '',
        apartment: '',
        municipality: '',
        semester: '',
        university_id: ''
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

        /*Envía todos los detalles de la dirección del estudiante como un solo string al back. Se hace con la finalidad de
        mantener un solo formato de direcciones */
        const fullAddress = `${formData.streetType} ${formData.streetNumber} #${formData.buildingNumber}` +
            (formData.apartment ? ` Apt ${formData.apartment}` : '') +
            `, ${formData.municipality}`;

        const dataToSend = {
            id_number: formData.id_number,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone_number: formData.phone_number,
            email: formData.email,
            institution_email: formData.institution_email,
            residence_address: fullAddress,
            semester: parseInt(formData.semester, 10),
            university_id: formData.university_id
        };

        /*Endpoint al que se envía la información registrada */
        try {
            const response = await axios.post(
                `${API_URL}/api/v0/user/`, 
                dataToSend, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            alert('Datos guardados con éxito');
            console.log('Token JWT:', token);
            console.log('Usuario creado exitosamente:', response.data);

            // Limpiar el formulario después del envío exitoso
            setFormData({
                id_number: '',
                first_name: '',
                last_name: '',
                phone_number: '',
                email: '',
                institution_email: '',
                streetType: '',
                streetNumber: '',
                buildingNumber: '',
                apartment: '',
                municipality: '',
                semester: '',
                university_id: ''
            });
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            
            // Manejo específico del error
            if (error.response) {
                console.error('Error del servidor:', error.response.data);
                alert(`Error del servidor: ${error.response.status} - ${error.response.data.message || 'Error desconocido'}`);
            } else if (error.request) {
                console.error('No se recibió respuesta del servidor');
                alert('No se pudo conectar con el servidor. Verifica tu conexión.');
            } else {
                console.error('Error al configurar la petición:', error.message);
                alert('Hubo un error al procesar la solicitud');
            }
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
                <UserInfoBar name={user.name} role={user.role} />
                {currentView === 'registrar' && (
                    <div>  
                        <h2>Registrar estudiante</h2>
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div>
                                <label>Nombre <span className="required-asterisk">*</span></label>
                                <input 
                                    type="text" 
                                    name="first_name" 
                                    value={formData.first_name} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>

                            <div>
                                <label>Apellido <span className="required-asterisk">*</span></label>
                                <input 
                                    type="text" 
                                    name="last_name" 
                                    value={formData.last_name} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>

                            <div>
                                <label>Número de identificación <span className="required-asterisk">*</span></label>
                                <input 
                                    type="text" 
                                    name="id_number" 
                                    value={formData.id_number} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>

                            <div>
                                <label>Número de celular <span className="required-asterisk">*</span></label>
                                <input 
                                    type="text" 
                                    name="phone_number" 
                                    value={formData.phone_number} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>

                            <div>
                                <label>Correo personal <span className="required-asterisk">*</span></label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>

                            <div>
                                <label>Correo institucional <span className="required-asterisk">*</span></label>
                                <input 
                                    type="email" 
                                    name="institution_email" 
                                    value={formData.institution_email} 
                                    onChange={handleChange} 
                                    required 
                                />
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
                                <select name="university_id" value={formData.university_id} onChange={handleChange} required>
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
                {/*Manejo del cambio de vistas */}
                {currentView === 'editar' && <StudentTable />} {/* Vista de estudiantes */}
                {currentView === 'metricas' && <DashboardMetrica />} {/* Vista de métricas */}
                {currentView === 'acompañar' && <AgregarAcompañamiento />} {/* Vista de acompañamiento */}
            </div>
        </div>
    );
};

export default ContactForm;