import { useState, useRef } from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import styles from './ui/productPage.module.css';
import Share from "./utils/Share.jsx";
import Modal from "./utils/Modal.jsx";
import FullScreenButton from "./FullScrinButton.jsx";

const Compilation = () => {
    const navigate = useNavigate();
    const [isShareOpen, setIsShareOpen] = useState(false);
    const handleShare = () => setIsShareOpen(true);
    const handleCloseShare = () => setIsShareOpen(false);
    const images = [
        "https://ir.ozone.ru/s3/multimedia-1-a/wc1000/7333611418.jpg",
        "https://i.pinimg.com/736x/f8/af/cd/f8afcdbd0cd75cba2978005baf44f75a.jpg",
        "https://ir.ozone.ru/s3/multimedia-1-a/wc1000/7333611418.jpg",
        "https://ir.ozone.ru/s3/multimedia-1-a/wc1000/7333611418.jpg",
        "https://ir.ozone.ru/s3/multimedia-1-a/wc1000/7333611418.jpg",
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [dragX, setDragX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const touchStartX = useRef(0);
    const [selectedColor, setSelectedColor] = useState(null);

    const sizes = [
        'XS / 42-44',
        'S / 46-48',
        'M / 50-52',
        'L / 54-56',
        'XL / 58-60',
        'XXL / 62-64',
        '3XL / 66-68',
        '4XL / 70-72'
    ];
    const colors = [
        { name: 'Черный', code: '#000000' },
        { name: 'Белый', code: '#FFFFFF' },
        { name: 'Красный', code: '#FF0000' },
        { name: 'Синий', code: '#0000FF' },
        { name: 'Зеленый', code: '#61a361' },
        { name: 'Серый', code: '#772222' },
        { name: 'Красный2', code: '#c52d2d' },
        { name: 'Синий2', code: '#7c7cbf' },
        { name: 'Зеленый2', code: '#00FF00' },
        { name: 'Серый2', code: '#808080' },
    ];

    const [selectedSize, setSelectedSize] = useState(null);
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        setIsDragging(true);
    };

    const handleTouchMove = (e) => {
        const moveX = e.touches[0].clientX - touchStartX.current;
        setDragX(moveX);
    };

    const handleTouchEnd = () => {
        if (dragX > 80 && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else if (dragX < -80 && currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
        setDragX(0);
        setIsDragging(false);
    };
    return (
        <>
        <div className={styles.container}>

            <div
                className={styles.slider}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <button className={styles.backButton} onClick={() => {
                    navigate(-1)
                }}>
                    <img style={{width: '30px'}} src='/subicons/arrowleft.svg'/>
                </button>
                <button className={styles.shareButton} onClick={handleShare}>
                    <img style={{width: '20px'}}  src='/subicons/darkshare.svg'/>
                </button>
                <div
                    className={styles.sliderInner}
                    style={{
                        transform: `translateX(calc(${-currentIndex * 100}% + ${dragX}px))`,
                        transition: isDragging ? 'none' : 'transform 0.3s ease',
                    }}
                >
                    {images.map((src, index) => (
                        <img key={index} src={src} alt={`Slide ${index}`} className={styles.image}/>
                    ))}
                </div>
                <div className={styles.progressDots}>
                    {images.map((_, index) => (
                        <span
                            key={index}
                            className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
                        />
                    ))}
                </div>
            </div>
            <Modal isOpen={isShareOpen} onClose={handleCloseShare}>
                <Share url={window.location.href}/>
            </Modal>
            <div className={styles.infoCard}>
                <p className={styles.title}>
                    Рубашка 12storeez
                </p>
                <p className={styles.brand}>
                    Recycle Boucle Knit Cardigan Pink
                </p>
                <div className={styles.header}>
                    <p className={styles.price}>7500 ₽</p>
                    <img src='/menuIcons/unactive/save.svg'/>
                </div>

                <FullScreenButton>
                    <p style={{display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center'}}> На сайт
                        продавца <img src='/subicons/shoppingBag.svg'/></p>
                </FullScreenButton>

                <p className={styles.blockTitle}>О товаре</p>
                <p className={styles.description} style={{color: 'var(--black)'}}>
                    Рубашка отлично сочетается с ремнями, галстуками и другими аксессуарами, дополняя любой стиль — от
                    делового до Casual.
                </p>

                <p className={styles.blockTitle}>Размеры</p>

                <div className={styles.bar}>
                    {sizes.map((size, index) => (
                        <button
                            key={index}
                            className={`${styles.sizeOption} ${
                                selectedSize === size ? styles.active : ''
                            }`}
                            onClick={() => setSelectedSize(size)}
                        >
                            {size}
                        </button>
                    ))}
                </div>
                <p className={styles.description} style={{color: 'var(--light-cold-gray)'}}>
                    Размер подобран на основе ваших параметров
                </p>

                <div style={{display: "flex", alignItems: 'center'}}>
                    <p className={styles.blockTitle}>Цвет</p>
                    <p className={styles.colorTitle}>{selectedColor?.name}</p>
                </div>
                <div className={`${styles.bar} ${styles.border}`}>
                    {colors.map((color, index) => (
                        <div
                            key={index}
                            className={styles.colorCircleWrapper}
                            onClick={() => setSelectedColor(color)}
                        >
                            <div
                                className={`${styles.colorCircle} ${
                                    selectedColor?.code === color?.code ? styles.selected : ''
                                }`}
                                style={{backgroundColor: color?.code}}
                            />
                        </div>
                    ))}
                </div>
                <p className={styles.blockTitle}>О товаре</p>
                <div className={styles.infoSection}>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Производитель</span>
                        <span className={styles.infoValue}>Nike</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Состав</span>
                        <span className={styles.infoValue}>Хлопок 80%, Полиэстер 20% Хлопок 80%, Полиэстер 20%</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Страна изготовитель</span>
                        <span className={styles.infoValue}>Вьетнам</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Дополнительн0</span>
                        <span className={styles.infoValue}>Сезон: Весна-Лето 2023</span>
                    </div>
                </div>
            </div>
            <Sidebar/>
        </div>

        </>
    );
};

export default Compilation;
