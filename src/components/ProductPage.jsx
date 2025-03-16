import { useLocation, useNavigate } from 'react-router-dom';
import {MainButton} from "@twa-dev/sdk/react";

function ProductPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { product } = location.state || {};

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div>
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
            <MainButton text="Go Back to Home" onClick={() => navigate('/')} />
        </div>
    );
}

export default ProductPage;