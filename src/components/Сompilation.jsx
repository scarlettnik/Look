import React from 'react'
import Sidebar from './Sidebar';
import {useLocation, Link, useNavigate} from 'react-router-dom';


const Compilation = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const save = state?.save;
    console.log(save)

    if (!save) return (
        <div className="page-container">
            <div className="content">
                <h1>Ошибка</h1>
                <p>Данные коллекции не найдены. Перейдите через список сохранений.</p>
            </div>
            <Sidebar />
        </div>
    );
    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="page-container">
            <div className="content">
                <button onClick={handleBack}>
                    Назад
                </button>
                <h1>{save.name}</h1>
                <div className="items-list">
                    {save.items.map(item => (
                        <Link
                            to={`/save/${save.id}/product/${item.id}`}
                            key={item.id}
                            state={{item}}
                            className="item-card"
                        >
                            {/*<img src={item.img} alt={item.name} />*/}
                            <div>
                                <h3>{item.name}</h3>
                                <p>Размер: {item.size}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <Sidebar/>
        </div>
    );
};


export default Compilation;
