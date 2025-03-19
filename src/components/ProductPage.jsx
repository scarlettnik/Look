import React from 'react'
import Sidebar from './Sidebar';
import {useLocation, useNavigate} from 'react-router-dom';


const Compilation = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const item = state?.item;
    console.log(item);

    const handleBack = () => {
        navigate(-1);
    };

    if (!item) return (
        <div className="page-container">
            <button onClick={handleBack}>
                Назад
            </button>
            <div className="content">
                <h1>Ошибка</h1>
                <p>Данные коллекции не найдены. Перейдите через список сохранений.</p>
            </div>
            <Sidebar/>
        </div>
    );

    return (
        <div className="page-container">
            <button onClick={handleBack}>
                Назад
            </button>
            <div className="content">
                <h1>{item?.name}</h1>
                <h2>{item?.size}</h2>
            </div>
            <Sidebar/>
        </div>
    );
};


export default Compilation;
