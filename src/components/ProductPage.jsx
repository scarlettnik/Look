import {useLocation, useNavigate} from 'react-router-dom';
import {useEffect} from "react";

const ProductPage = () => {
    const location = useLocation();
    const { product } = location.state || {};
    const telegram = window.Telegram?.WebApp;
    const navigate = useNavigate();

    const handleBack = () => {
        if (location.pathname.startsWith('/product')) {
            navigate('/');
        } else {
            telegram.close();
        }
    };

    useEffect(() => {
        const telegram = window.Telegram?.WebApp;
        if (!telegram) return;

        const handleBack = () => {
            if (window.history.state && window.history.state.idx > 0) {
                navigate(-1);
            } else {
                telegram.close();
            }
        };

        if (location.pathname !== '/') {
            telegram.BackButton.show();
            telegram.BackButton.onClick(handleBack);
        } else {
            telegram.BackButton.hide();
        }

        return () => {
            telegram.BackButton.offClick(handleBack);
            telegram.BackButton.hide();
        };
    }, [navigate, location.pathname]);



    if (!product) {
        return <div>Товар не найден</div>;
    }
    telegram.onEvent('viewportChanged', () => {
        telegram.BackButton[location.pathname !== '/' ? 'show' : 'hide']();
    });

    return (
        <div>
            <button onClick={handleBack}>Назад</button>
            <h1>{product.name}</h1>
            {product.position && <p>Позиция: {product.position}</p>}
            {product.experience && <p>Опыт: {product.experience}</p>}
            <p>Описание: {product.description}</p>
            {product.skills && (
                <>
                    <h3>Навыки:</h3>
                    <ul>
                        {product.skills.map((skill, index) => (
                            <li key={index}>{skill}</li>
                        ))}
                    </ul>
                </>
            )}
            {product.links && (
                <>
                    <h3>Ссылки:</h3>
                    <ul>
                        {product.links.map((link, index) => (
                            <li key={index}>
                                <a href={link}>{link}</a>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default ProductPage;