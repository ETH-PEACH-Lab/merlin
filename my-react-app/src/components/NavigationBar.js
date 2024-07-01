// src/components/NavigationBar.js
import React from 'react';
import './NavigationBar.css';

const NavigationBar = ({ items, onSelect }) => {
  return (
    <div className="navigation-bar">
      <div className="navigation-bar-content">
        <div className="navigation-bar-header">Examples</div>
        <ul className="navigation-bar-list">
          {items.map((item, index) => (
            <li
              key={index}
              className="navigation-bar-item"
              onClick={() => onSelect(item)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NavigationBar;
