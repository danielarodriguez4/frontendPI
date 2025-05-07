import React from 'react';
import './UserInfoBar.css';

const UserInfoBar = ({ name, role }) => {
    return (
        <div className="user-info-bar">
            <div className="user-text">
                <div className="user-name">{name}</div>
                <div className="user-role">{role}</div>
            </div>
            <img
                src="https://www.w3schools.com/howto/img_avatar.png"
                alt="Avatar"
                className="user-avatar"
            />
        </div>
    );
};

export default UserInfoBar;
