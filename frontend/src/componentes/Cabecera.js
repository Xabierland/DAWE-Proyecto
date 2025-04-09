import React from 'react';

const Cabecera = ({ titulo }) => {
    return (
        <header className="my-4">
            <h1 className="text-center">{titulo}</h1>
        </header>
    );
};

export default Cabecera;