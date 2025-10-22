/*Lógica para mostrar el nombre y rol de usuario en la parte superior derecha*/
import React from 'react';
import NotificationCenter from './NotificationCenter';
import '../Estilos/UserInfoBar.css';

const UserInfoBar = ({ name, role }) => {
    return (
        <div className="user-info-bar">
            <div className="user-text">
                <div className="user-name">{name}</div>
                <div className="user-role">{role}</div>
            </div>

            <NotificationCenter />
        </div>
    );
};

export default UserInfoBar;
