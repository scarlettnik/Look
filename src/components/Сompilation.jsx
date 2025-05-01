import Sidebar from './Sidebar';
import {useLocation, Link, useNavigate} from 'react-router-dom';
import styles from './ui/compilation.module.css'
import {ChevronDown, SlidersHorizontal} from "lucide-react";

const items = [
    {
        url: 'https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg',
        id: 1
    },
    {
        url: 'https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg',
        id: 2
    },
    {
        url: 'https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg',
        id: 3
    },
    {
        url: 'https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg'
    },
    {
        url: 'https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg'
    },
    {
        url: 'https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg'
    },
    {
        url: 'https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg'
    },    {
        url: 'https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg'
    },    {
        url: 'https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg'
    },    {
        url: 'https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg'
    },    {
        url: 'https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg'
    },    {
        url: 'https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg'
    },    {
        url: 'https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg'
    },    {
        url: 'https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg'
    },    {
        url: 'https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg'
    },    {
        url: 'https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg'
    },    {
        url: 'https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg'
    },    {
        url: 'https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg'
    },    {
        url: 'https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg'
    },    {
        url: 'https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg'
    },    {
        url: 'https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg'
    },    {
        url: 'https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg'
    },    {
        url: 'https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg'
    },    {
        url: 'https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg'
    },
    ]

const Compilation = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const save = state?.save;
    if (!save) {
        return (
            <div className="page-container">
                <div className="content">
                    <h1>Ошибка</h1>
                    <p>Данные коллекции не найдены. Перейдите через список сохранений.</p>
                </div>
                <Sidebar />
            </div>
        );
    }

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className={styles.container}>
            {/* Прокручиваемая часть */}
            <div className={styles.scrollContent}>
                <div className={styles.banner}>
                    <button onClick={handleBack} className={styles.editButton}>←</button>
                    <img
                        src="https://avatars.mds.yandex.net/i?id=daa613f83d28069a128d737b9fc9c58b_l-7054696-images-thumbs&n=13"
                        alt="All Saved"
                        className={styles.bannerImage}
                    />
                    <div className={styles.bannerText}>All Saved</div>
                    <button className={styles.editButton}>✏️</button>
                </div>

                <div className={styles.filterBar}>
                    <button className={styles.filterButton}><SlidersHorizontal size={18} /></button>
                    <button className={styles.filterButton}>Sale</button>
                    <button className={styles.filterButton}>Brand <ChevronDown size={18} /></button>
                    <button className={styles.filterButton}>Product <ChevronDown size={18} /></button>
                    <button className={styles.filterButton}>Color <ChevronDown size={18} /></button>
                </div>

                <div className={styles.itemsGrid}>
                    {items.map((item, index) => (
                        <Link
                            to={`/product/${item.id}`}
                            key={index}
                            state={{ item }}
                            className="save-card"
                        >
                            <img
                                src={item.url}
                                alt={`item-${index}`}
                                className={styles.itemImage}
                            />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Не прокручивается */}
            <Sidebar />
        </div>
    );
};

export default Compilation;