import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BackButton } from '@twa-dev/sdk/react';

function ProductPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { product } = location.state || {};

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div>
            <BackButton onClick={() => navigate(-1)} />
            <h1>{product.name}</h1>
            <p>Position: {product.position}</p>
            <p>Experience: {product.experience}</p>
            <p>Description: {product.description || 'Данные не указаны'}</p>
            <h2>Skills:</h2>
            <ul>
                {product.skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                ))}
            </ul>
        </div>
    );
}

export default ProductPage;