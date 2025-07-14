import React, { useState, useEffect } from 'react';
import { Edit, MessageCircle, ChevronLeft, ChevronRight, Calendar, User, BookOpen, Clock, FileText } from 'lucide-react';
import '../Estilos/TutoringHistoryView.css';
import Swal from 'sweetalert2';

const TutoringHistoryView = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingSession, setEditingSession] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const sessionsPerPage = 5;

const fetchSessions = async (page = 1) => {
  try {
    setLoading(true);
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}api/v1/session/all?page=${page}&limit=${sessionsPerPage}`
    );

    if (!response.ok) {
      throw new Error('Error al cargar las sesiones');
    }

    const data = await response.json();
    setSessions(data.sessions || data);
    setTotalPages(Math.ceil((data.total || data.length) / sessionsPerPage));
  } catch (err) {
    Swal.fire({
      title: 'Error',
      text: err.message,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#d33'
    });
  } finally {
    setLoading(false);
  }
};


  // Función para actualizar una sesión
  const updateSession = async (sessionId, updates) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}api/v1/session/${sessionId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        }
      );
      
      if (!response.ok) {
        throw new Error('Error al actualizar la sesión');
      }
      
      // Recargar las sesiones después de actualizar
      fetchSessions(currentPage);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchSessions(currentPage);
  }, [currentPage]);

  // Función para formatear fechas
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para obtener el color de estado
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completado':
      case 'completed':
        return 'status-completed';
      case 'pendiente':
      case 'pending':
        return 'status-pending';
      case 'cancelado':
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  };

  // Función para manejar la edición
  const handleEdit = (session) => {
    setEditingSession(session.id);
    setEditNotes(session.notes || '');
  };

  // Función para guardar cambios
  const handleSave = async (sessionId) => {
    await updateSession(sessionId, { notes: editNotes });
    setEditingSession(null);
    setEditNotes('');
  };

  // Función para cancelar edición
  const handleCancel = () => {
    setEditingSession(null);
    setEditNotes('');
  };

  // Función para añadir comentario
  const handleAddComment = async (sessionId) => {
    if (!newComment.trim()) return;
    
    const currentSession = sessions.find(s => s.id === sessionId);
    const updatedNotes = currentSession.notes 
      ? `${currentSession.notes}\n\n--- Comentario ${formatDate(new Date())} ---\n${newComment}`
      : `--- Comentario ${formatDate(new Date())} ---\n${newComment}`;
    
    await updateSession(sessionId, { notes: updatedNotes });
    setNewComment('');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="tutoring-history-container">
      <div className="tutoring-history-card">
        {/* Header */}
        <div className="header">
          <h1 className="header-title">Historial de Tutorías</h1>
          <p className="header-subtitle">Gestiona y revisa las sesiones de tutoría</p>
        </div>

        {/* Filtros */}
        <div className="filters-container">
          <div className="filters">
            <div className="filter-group">
              <User className="filter-icon" />
              <span className="filter-label">Filtros:</span>
            </div>
            <select className="filter-select">
              <option>Todos</option>
              <option>Completado</option>
              <option>Pendiente</option>
              <option>Cancelado</option>
            </select>
            <select className="filter-select">
              <option>Todas las especialidades</option>
              <option>Matemáticas</option>
              <option>Física</option>
              <option>Química</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="table-container">
          <table className="sessions-table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">
                  <div className="header-content">
                    <User className="header-icon" />
                    Estudiante
                  </div>
                </th>
                <th className="table-header-cell">
                  <div className="header-content">
                    <BookOpen className="header-icon" />
                    Acompañante
                  </div>
                </th>
                <th className="table-header-cell">
                  Especialidad
                </th>
                <th className="table-header-cell">
                  <div className="header-content">
                    <FileText className="header-icon" />
                    Notas
                  </div>
                </th>
                <th className="table-header-cell">
                  <div className="header-content">
                    <Calendar className="header-icon" />
                    Fecha
                  </div>
                </th>
                <th className="table-header-cell">
                  Estado
                </th>
                <th className="table-header-cell">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="table-body">
              {sessions.map((session, index) => (
                <tr key={session.id || index} className="table-row">
                  <td className="table-cell">
                    <div className="student-info">
                      <div className="student-avatar">
                        <span className="avatar-text">
                          {(session.first_name || 'N')[0]}{(session.last_name || 'N')[0]}
                        </span>
                      </div>
                      <div className="student-details">
                        <div className="student-name">
                          {session.first_name} {session.last_name}
                        </div>
                        <div className="student-role">Estudiante</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="companion-name">
                      {session.first_name_companion} {session.last_name_companion}
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="specialty-badge">
                      {session.companion_specialty}
                    </span>
                  </td>
                  <td className="table-cell">
                    {editingSession === session.id ? (
                      <div className="edit-notes-container">
                        <textarea
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          className="edit-textarea"
                          rows="3"
                          placeholder="Añadir notas..."
                        />
                        <div className="edit-buttons">
                          <button
                            onClick={() => handleSave(session.id)}
                            className="save-button"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={handleCancel}
                            className="cancel-button"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="notes-content">
                        {session.notes || 'Sin notas'}
                      </div>
                    )}
                  </td>
                  <td className="table-cell">
                    <div className="date-info">
                      <span className="date-created">Creado: {formatDate(session.created_at)}</span>
                      {session.updated_at && (
                        <span className="date-updated">
                          <Clock className="clock-icon" />
                          Actualizado: {formatDate(session.updated_at)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`status-badge ${getStatusClass(session.status)}`}>
                      {session.status || 'Completado'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="actions">
                      <button
                        onClick={() => handleEdit(session)}
                        className="action-button edit-button"
                        title="Editar"
                      >
                        <Edit className="action-icon" />
                      </button>
                      <div className="comment-dropdown">
                        <button
                          className="action-button comment-button"
                          title="Añadir comentario"
                        >
                          <MessageCircle className="action-icon" />
                        </button>
                        <div className="comment-menu">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="comment-textarea"
                            rows="3"
                            placeholder="Añadir comentario..."
                          />
                          <button
                            onClick={() => handleAddComment(session.id)}
                            className="add-comment-button"
                          >
                            Añadir
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="pagination-container">
          <div className="pagination-info">
            <p className="pagination-text">
              Mostrando página <span className="pagination-current">{currentPage}</span> de{' '}
              <span className="pagination-total">{totalPages}</span>
            </p>
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="pagination-button pagination-prev"
            >
              <ChevronLeft className="pagination-icon" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`pagination-button ${page === currentPage ? 'pagination-active' : ''}`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="pagination-button pagination-next"
            >
              <ChevronRight className="pagination-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutoringHistoryView;