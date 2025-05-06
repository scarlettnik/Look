import styles from './ui/save.module.css'
import Sidebar from './Sidebar';
import {Link} from "react-router-dom";
import {useEffect, useRef, useState} from "react";

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
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!window.visualViewport) return;

        const handleResize = () => {
            const newHeight = window.visualViewport.height;
            const keyboardHeight = window.innerHeight - newHeight;
            setKeyboardHeight(keyboardHeight > 100 ? keyboardHeight : 0);

            if (containerRef.current) {
                containerRef.current.style.height = `${newHeight}px`;
            }
        };

        const handleScroll = () => {
            // Прокручиваем input в видимую область
            const activeElement = document.activeElement;
            if (activeElement?.tagName === 'INPUT') {
                activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };

        window.visualViewport.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.visualViewport?.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const sidebar = document.querySelector('.sidebar');
            const visualViewport = window.visualViewport;

            if (visualViewport) {
                // Вычисляем положение относительно видимой области
                const viewportBottom = visualViewport.height + visualViewport.offsetTop;
                const windowHeight = window.innerHeight;

                // Если клавиатура открыта (видимая область меньше окна)
                if (viewportBottom < windowHeight * 0.9) {
                    sidebar.style.transform = `translateY(${windowHeight - viewportBottom}px)`;
                } else {
                    sidebar.style.transform = 'translateY(0)';
                }
            }
        };

        // Для устройств с visualViewport API
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleResize);
        } else {
            // Фолбэк для других устройств
            window.addEventListener('resize', handleResize);
        }

        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', handleResize);
            } else {
                window.removeEventListener('resize', handleResize);
            }
        };
    }, []);

    return (
        <>
            <div
                ref={containerRef}
                className={styles.container}
                style={{
                    height: `${window.innerHeight}px`,
                    paddingBottom: '60px' // Высота Sidebar
                }}
            >
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
                        <Link to={`/save/${save.id}`} key={save.id} state={{save}}>
                            <div className={styles.card}>
                                <img
                                    src='https://salehard.артстена.рф/storage/categories-created/abstrakciya/fotooboi-abstraktsiya-22285540_-_id___20730.jpg'
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

                <div style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    transform: `translateY(-${keyboardHeight}px)`,
                    transition: 'transform 0.3s ease',
                    zIndex: 1000
                }}>

                </div>
            </div>
            <Sidebar/>
        </>

    );
};

export default Save;