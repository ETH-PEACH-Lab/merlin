// src/components/NavigationBar.jsx
import React from 'react';

const NavigationBar = ({ items, onSelect }) => {
  return (
    <div className="navigation-bar">
      <div className="navigation-bar-content">
        <div className="navigation-bar-header">Examples</div>
        <ul className="navigation-bar-list">
          {items.map((item) => (
            <li
              key={item.id}
              className="navigation-bar-item"
              onClick={() => onSelect(item)}
            >
              {item.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NavigationBar;
