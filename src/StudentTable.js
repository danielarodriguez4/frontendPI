import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StudentTable.css'; 

const API_URL = process.env.REACT_APP_BACKEND_URL;

const StudentTable = () => {
    const [students, setStudents] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null);
    const [formData, setFormData] = useState({});
    
    const token = localStorage.getItem('jwt');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/info`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Estudiantes obtenidos:', res.data); 
                setStudents(res.data);
            } catch (error) {
                console.error('Error al obtener los estudiantes', error);
            }
        };
    
        fetchStudents();
    }, [token]);
    

    const handleEditClick = (student) => {
        setEditingStudent(student.id); // o el campo único que uses
        setFormData({ ...student });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            await axios.put(`${API_URL}/api/info/${editingStudent}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Estudiante actualizado correctamente');
            setEditingStudent(null);
        } catch (error) {
            console.error('Error al actualizar', error);
            alert('Error al guardar los cambios');
        }
    };

    return (
        <div className="tabla-estudiantes">
            <h2>Estudiantes registrados</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Correo institucional</th>
                        <th>Universidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) =>
                        editingStudent === student.id ? (
                            <tr key={student.id}>
                                <td><input name="firstName" value={formData.firstName} onChange={handleChange} /></td>
                                <td><input name="lastName" value={formData.lastName} onChange={handleChange} /></td>
                                <td><input name="institutionalEmail" value={formData.institutionalEmail} onChange={handleChange} /></td>
                                <td><input name="university" value={formData.university} onChange={handleChange} /></td>
                                <td>
                                    <button onClick={handleSave}>Guardar</button>
                                    <button onClick={() => setEditingStudent(null)}>Cancelar</button>
                                </td>
                            </tr>
                        ) : (
                            <tr key={student.id}>
                                <td>{student.firstName}</td>
                                <td>{student.lastName}</td>
                                <td>{student.institutionalEmail}</td>
                                <td>{student.university}</td>
                                <td>
                                    <button onClick={() => handleEditClick(student)}>Editar</button>
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StudentTable;
