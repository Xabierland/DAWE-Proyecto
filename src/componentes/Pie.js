import React from 'react';

const Pie = ({ contenido }) => {
    return (
        <footer className="footer bg-dark py-3 sticky-bottom">
            <div className="col text-center">
                <p className="mb-0">{contenido}</p>
            </div>
        </footer>
    );
};

export default Pie;