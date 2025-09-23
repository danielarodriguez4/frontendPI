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
          const [res1, res2] = await Promise.all([
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/notifications`),
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/alerts`)
          ]);
          // Filtrar por notifications por fecha
          const all = [...res1.data, ...res2.data];
          all.sort((a, b) => new Date(b.date) - new Date(a.date));
          setNotifications(all);
        } catch (err) {
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
                  <div className="notification-title">{n.title || n.message || 'Notificación'}</div>
                  {n.date && <div className="notification-date">{new Date(n.date).toLocaleString()}</div>}
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
