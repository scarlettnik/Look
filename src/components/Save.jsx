import styles from './ui/save.module.css'
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
    },
    {
        id: 3,
        name: "Зимний набор",
        img: "winter.jpg",
        items: [
            { id: 3, name: "Куртка", size: "XL", img: "jacket.jpg" }
        ]
    }
];

const Save = () => {

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Your Closets</h1>

            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Search for a wishlist..."
                    className={styles.input}
                />
                <div className={styles.buttons}>
                    <button className={styles.circleButton}>+</button>
                    <button className={styles.circleButton}>-</button>
                </div>
            </div>

            <div className={styles.cards}>
                {savesData.map(save => (
                    <Link to={`/save/${save.id}`} key={save.id} state={{save}} className="save-card">
                        <div className={styles.card}>
                            <img
                                src="https://avatars.mds.yandex.net/i?id=daa613f83d28069a128d737b9fc9c58b_l-7054696-images-thumbs&n=13"
                                alt="All Saved"
                                className={styles.image}
                            />
                            <div className={styles.overlay}>
                                <h3 className={styles.cardTitle}>All Saved</h3>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <Sidebar/>
        </div>
        // <div className="page-container">
        //     <div className="content">
        //         <h1>Сохранения</h1>
        //         <div className="saves-list">
        //             {savesData.map(save => (
        //                 <Link to={`/save/${save.id}`} key={save.id}  state={{ save }} className="save-card">
        //                     {/*<img src={save.img} alt={save.name} />*/}
        //                     <h3>{save.name}</h3>
        //                 </Link>
        //             ))}
        //         </div>
        //     </div>
        //     <Sidebar />
        // </div>
    );
};

export default Save;
