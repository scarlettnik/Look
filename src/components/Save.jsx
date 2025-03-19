import React from 'react'
import Sidebar from './Sidebar';
import {Link} from "react-router-dom";

const savesData = [
    {
        id: 1,
        name: "Моя летняя коллекция",
        img: "summer.jpg",
        items: [
            { id: 1, name: "Футболка", size: "M", img: "t-shirt.jpg" },
            { id: 2, name: "Шорты", size: "L", img: "shorts.jpg" }
        ]
    },
    {
        id: 2,
        name: "Зимний набор",
        img: "winter.jpg",
        items: [
            { id: 3, name: "Куртка", size: "XL", img: "jacket.jpg" }
        ]
    }
];

const Save = () => {

    return (
        <div className="page-container">
            <div className="content">
                <h1>Сохранения</h1>
                <div className="saves-list">
                    {savesData.map(save => (
                        <Link to={`/save/${save.id}`} key={save.id}  state={{ save }} className="save-card">
                            {/*<img src={save.img} alt={save.name} />*/}
                            <h3>{save.name}</h3>
                        </Link>
                    ))}
                </div>
            </div>
            <Sidebar />
        </div>
    );
};

export default Save;
