import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../Estilos/UserInfoBar.css';

const NotificationCenter = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setError(null);
      const fetchNotifications = async () => {
        try {
          console.log('URL priority:', `${process.env.REACT_APP_BACKEND_URL}/api/v2/priorities/all`);
          console.log('URL alert:', `${process.env.REACT_APP_BACKEND_URL}/api/v2/alerts/all`);
          const [res1, res2] = await Promise.all([
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v2/priorities/all`),
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v2/alerts/all`)
          ]);
          console.log('Respuesta priority:', res1.data);
          console.log('Respuesta alerts:', res2.data);
          // Usar array correcto según estructura de la respuesta
          // Extraer correctamente el array de prioridades y alertas
          const priorityArray = Array.isArray(res1.data.data) ? res1.data.data : [];
          const alertsArray = Array.isArray(res2.data.data) ? res2.data.data : [];
          console.log('priorityArray:', priorityArray);
          console.log('alertsArray:', alertsArray);
          // Combinar sin filtrar por fecha para depuración
          const all = [...priorityArray, ...alertsArray];
          setNotifications(all);
        } catch (err) {
          console.error('Error al cargar notificaciones:', err);
          setError('Error al cargar notificaciones');
        } finally {
          setLoading(false);
        }
      };
      fetchNotifications();
    }
  }, [open]);

  // Click al dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="notification-center" ref={dropdownRef}>
      <button className="notification-icon" onClick={() => setOpen((v) => !v)}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/3557/3557778.png"
          alt="Notificaciones"
          style={{ width: 28, height: 28, display: 'block' }}
        />
        {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
      </button>
      {open && (
        <div className="notification-dropdown">
          {loading ? (
            <div className="notification-loading">Cargando...</div>
          ) : error ? (
            <div className="notification-error">{error}</div>
          ) : notifications.length === 0 ? (
            <div className="notification-empty">Sin notificaciones</div>
          ) : (
            <ul className="notification-list">
              {notifications.map((n, i) => (
                <li key={i} className="notification-item">
                  {/* Prioridad: mostrar aunque falte algún campo */}
                  {n.name && (
                    <>
                      <div className="notification-title">Prioridad: {n.name}</div>
                      {n.level !== undefined && <div className="notification-level">Nivel: {n.level}</div>}
                      {n.sessions_per_month !== undefined && <div className="notification-sessions">Sesiones/mes: {n.sessions_per_month}</div>}
                      {n.created_at && <div className="notification-date">Creado: {new Date(n.created_at).toLocaleString()}</div>}
                    </>
                  )}
                  {/* Alerta */}
                  {(n.title || n.message) && (
                    <>
                      <div className="notification-title">{n.title || 'Alerta'}</div>
                      {n.message && <div className="notification-message">{n.message}</div>}
                      {n.date && <div className="notification-date">{new Date(n.date).toLocaleString()}</div>}
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
