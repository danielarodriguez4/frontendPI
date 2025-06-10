import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Estilos/StudentTable.css';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

const StudentTable = () => {
    const [students, setStudents] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                console.log('Fetching students from:', `${process.env.REACT_APP_BACKEND_URL}/api/v0/user/all`);
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v0/user/all`);
                console.log('Response data:', response.data);
                
                // Si response.data es un array, úsalo directamente
                // Si está envuelto en un objeto, accede a la propiedad correcta
                const studentsData = Array.isArray(response.data) ? response.data : response.data.data || response.data.users || [];
                
                setStudents(studentsData);
            } catch (error) {
                console.error('Error al obtener los estudiantes:', error);
                console.error('Error details:', error.response?.data);
            }
        };

        fetchStudents();
    }, []);

    const handleEditClick = (student) => {
        setEditingStudent(student.id);
        setFormData({ ...student });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        const updatedStudents = students.map((student) =>
            student.id === editingStudent ? { ...student, ...formData } : student
        );
        setStudents(updatedStudents);
        alert('Estudiante actualizado correctamente');
        setEditingStudent(null);
    };

    // Agregar loading state
    if (students.length === 0) {
        return <div>Cargando estudiantes...</div>;
    }

    return (
        <div className="tabla-estudiantes">
            <h2 className="titulo-tabla">Estudiantes registrados</h2>
            <div className="tabla-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cédula</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Correo institucional</th>
                            <th>Correo personal</th>
                            <th>Semestre</th>
                            <th>Universidad</th>
                            <th>Teléfono</th>
                            <th>Dirección</th>
                            <th>Creación</th>
                            <th>Última actualización</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) =>
                            editingStudent === student.id ? (
                                <tr key={student.id}>
                                    <td><input name="id" value={formData.id || ''} onChange={handleChange} disabled /></td>
                                    <td><input name="id_number" value={formData.id_number || ''} onChange={handleChange} /></td>
                                    <td><input name="first_name" value={formData.first_name || ''} onChange={handleChange} /></td>
                                    <td><input name="last_name" value={formData.last_name || ''} onChange={handleChange} /></td>
                                    <td><input name="institution_email" value={formData.institution_email || ''} onChange={handleChange} /></td>
                                    <td><input name="email" value={formData.email || ''} onChange={handleChange} /></td>
                                    <td><input name="semester" value={formData.semester || ''} onChange={handleChange} /></td>
                                    <td><input name="university_id" value={formData.university_id || ''} onChange={handleChange} /></td>
                                    <td><input name="phone_number" value={formData.phone_number || ''} onChange={handleChange} /></td>
                                    <td><input name="residence_address" value={formData.residence_address || ''} onChange={handleChange} /></td>
                                    <td><input name="created_at" value={formData.created_at || ''} onChange={handleChange} disabled /></td>
                                    <td><input name="updated_at" value={formData.updated_at || ''} onChange={handleChange} disabled /></td>
                                    <td className="acciones">
                                        <Button onClick={handleSave} color="success" variant="contained" size="small" style={{ marginRight: 5 }}>
                                            <SaveIcon />
                                        </Button>
                                        <Button onClick={() => setEditingStudent(null)} color="error" variant="contained" size="small">
                                            <CloseIcon />
                                        </Button>
                                    </td>
                                </tr>
                            ) : (
                                <tr key={student.id}>
                                    <td>{student.id}</td>
                                    <td>{student.id_number}</td>
                                    <td>{student.first_name}</td>
                                    <td>{student.last_name}</td>
                                    <td>{student.institution_email}</td>
                                    <td>{student.email}</td>
                                    <td>{student.semester}</td>
                                    <td>{student.university_id}</td>
                                    <td>{student.phone_number}</td>
                                    <td>{student.residence_address}</td>
                                    <td>{student.created_at}</td>
                                    <td>{student.updated_at}</td>
                                    <td className="acciones">
                                        <Button onClick={() => handleEditClick(student)} variant="contained" size="small" color="primary">
                                            <EditIcon />
                                        </Button>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentTable;