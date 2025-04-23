import React, { useEffect, useState } from 'react';
import './StudentTable.css';

const StudentTable = () => {
    const [students, setStudents] = useState([
        { id: 1, firstName: 'Juan', lastName: 'Pérez', institutionalEmail: 'juan.perez@universidad.com', university: 'Universidad Nacional' },
        { id: 2, firstName: 'Ana', lastName: 'García', institutionalEmail: 'ana.garcia@universidad.com', university: 'Universidad Autónoma' },
        { id: 3, firstName: 'Luis', lastName: 'Martínez', institutionalEmail: 'luis.martinez@universidad.com', university: 'Universidad Central' },
    ]);

    const [editingStudent, setEditingStudent] = useState(null);
    const [formData, setFormData] = useState({});

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
