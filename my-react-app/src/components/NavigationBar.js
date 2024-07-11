import React from 'react';
import './NavigationBar.css';

const NavigationBar = ({ items, savedItems, onSelect, activeTab, onTabChange }) => {
  return (
    <div className="nav-container">
      <div className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === 'examples' ? 'active' : ''}`}
          onClick={() => onTabChange('examples')}
        >
          Examples
        </button>
        <button
          className={`nav-tab ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => onTabChange('saved')}
        >
          Saved
        </button>
      </div>
      <div className="nav-content">
        {activeTab === 'examples' ? (
          items.map(item => (
            <div
              key={item.id}
              className="nav-item"
              onClick={() => onSelect(item)}
            >
              <div className="nav-item-title">{item.title}</div>
            </div>
          ))
        ) : savedItems.length > 0 ? (
          savedItems.map(item => (
            <div
              key={item.timestamp}
              className="nav-item"
              onClick={() => onSelect(item)}
            >
              <div className="nav-item-title">{new Date(item.timestamp).toLocaleString()}</div>
            </div>
          ))
        ) : (
          <div className="nav-empty">No saved diagrams</div>
        )}
      </div>
    </div>
  );
};

export default NavigationBar;
