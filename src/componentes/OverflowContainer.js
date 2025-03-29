import React from 'react';

const OverflowContainer = ({ isHidden, children }) => {
  // Este componente simplemente aplica la clase CSS basada en la prop isHidden
  const containerStyle = {
    overflow: isHidden ? 'hidden' : 'auto',
    width: '100%',
    height: '100%',
    position: 'relative'
  };
  
  return (
    <div style={containerStyle}>
      {children}
    </div>
  );
};

export default OverflowContainer;