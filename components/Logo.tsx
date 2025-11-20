import React from 'react';

const logoUrl = 'https://servinformacion.com/wp-content/uploads/2020/10/LogoServinformacion-02-1-600x177.png.webp';

export const Logo: React.FC = () => {
    return (
        <img src={logoUrl} alt="Servinformación Logo" className="h-12 w-auto" />
    );
};
