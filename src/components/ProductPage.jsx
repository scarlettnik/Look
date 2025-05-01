import React, { useState, useRef } from 'react';
import Sidebar from './Sidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ui/productPage.module.css';
import Share from "./utils/Share.jsx";

const Compilation = () => {
    const { state } = useLocation();
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

    const handleBack = () => {
        navigate(-1);
    };

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
                <div
                    className={styles.sliderInner}
                    style={{
                        transform: `translateX(calc(${-currentIndex * 100}% + ${dragX}px))`,
                        transition: isDragging ? 'none' : 'transform 0.3s ease',
                    }}
                >
                    {images.map((src, index) => (
                        <img key={index} src={src} alt={`Slide ${index}`} className={styles.image} />
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

            <div className={styles.infoCard}>
                <div className={styles.header}>
                    <div className={styles.brand}>
                        <img src="https://i.pinimg.com/736x/f8/af/cd/f8afcdbd0cd75cba2978005baf44f75a.jpg"
                             alt="Beginning Boutique" className={styles.logo}/>
                        <span className={styles.brandName}>Beginning Boutique</span>
                    </div>
                    <button className={styles.bookmark}>🔖</button>
                </div>
                <h2 className={styles.title}>Pink Mesh Mini Dress</h2>
                <p className={styles.price}>$75</p>
                <div className={styles.description}>
                    <h3>Description</h3>
                    <button className={styles.bookmark} onClick={handleShare}>📤</button>
                    <Share isOpen={isShareOpen} onClose={handleCloseShare} url={window.location.href}/>
                    <p>
                        Pretty in pink! Go for sunset cocktails in this stunning pink mesh mini dress.
                        Whether it’s a special occasion or a night out, this dress is the perfect pick!
                        Accessories with gold jewellery, heels and a shoulder bag for a jaw dropping fit.
                        Open back. Halter neck. Mini length. V neckline. Fully lined with mesh outer layer.
                        Bodycon style. Stretch material. Frill mesh hem. Mesh rose on bottom hem.
                        Pretty in pink! Go for sunset cocktails in this stunning pink mesh mini dress.
                        Whether it’s a special occasion or a night out, this dress is the perfect pick!
                        Accessories with gold jewellery, heels and a shoulder bag for a jaw dropping fit.
                        Open back. Halter neck. Mini length. V neckline. Fully lined with mesh outer layer.
                        Bodycon style. Stretch material. Frill mesh hem. Mesh rose on bottom hem.
                        Pretty in pink! Go for sunset cocktails in this stunning pink mesh mini dress.
                        Whether it’s a special occasion or a night out, this dress is the perfect pick!
                        Accessories with gold jewellery, heels and a shoulder bag for a jaw dropping fit.
                        Open back. Halter neck. Mini length. V neckline. Fully lined with mesh outer layer.
                        Bodycon style. Stretch material. Frill mesh hem. Mesh rose on bottom hem.
                        Pretty in pink! Go for sunset cocktails in this stunning pink mesh mini dress.
                        Whether it’s a special occasion or a night out, this dress is the perfect pick!
                        Accessories with gold jewellery, heels and a shoulder bag for a jaw dropping fit.
                        Open back. Halter neck. Mini length. V neckline. Fully lined with mesh outer layer.
                        Bodycon style. Stretch material. Frill mesh hem. Mesh rose on bottom hem.Pretty in pink! Go for
                        sunset cocktails in this stunning pink mesh mini dress.
                        Whether it’s a special occasion or a night out, this dress is the perfect pick!
                        Accessories with gold jewellery, heels and a shoulder bag for a jaw dropping fit.
                        Open back. Halter neck. Mini length. V neckline. Fully lined with mesh outer layer.
                        Bodycon style. Stretch material. Frill mesh hem. Mesh rose on bottom hem.Pretty in pink! Go for
                        sunset cocktails in this stunning pink mesh mini dress.
                        Whether it’s a special occasion or a night out, this dress is the perfect pick!
                        Accessories with gold jewellery, heels and a shoulder bag for a jaw dropping fit.
                        Open back. Halter neck. Mini length. V neckline. Fully lined with mesh outer layer.
                        Bodycon style. Stretch material. Frill mesh hem. Mesh rose on bottom hem.Pretty in pink! Go for
                        sunset cocktails in this stunning pink mesh mini dress.
                        Whether it’s a special occasion or a night out, this dress is the perfect pick!
                        Accessories with gold jewellery, heels and a shoulder bag for a jaw dropping fit.
                        Open back. Halter neck. Mini length. V neckline. Fully lined with mesh outer layer.
                        Bodycon style. Stretch material. Frill mesh hem. Mesh rose on bottom hem.Pretty in pink! Go for
                        sunset cocktails in this stunning pink mesh mini dress.
                        Whether it’s a special occasion or a night out, this dress is the perfect pick!
                        Accessories with gold jewellery, heels and a shoulder bag for a jaw dropping fit.
                        Open back. Halter neck. Mini length. V neckline. Fully lined with mesh outer layer.
                        Bodycon style. Stretch material. Frill mesh hem. Mesh rose on bottom hem.Pretty in pink! Go for
                        sunset cocktails in this stunning pink mesh mini dress.
                        Whether it’s a special occasion or a night out, this dress is the perfect pick!
                        Accessories with gold jewellery, heels and a shoulder bag for a jaw dropping fit.
                        Open back. Halter neck. Mini length. V neckline. Fully lined with mesh outer layer.
                        Bodycon style. Stretch material. Frill mesh hem. Mesh rose on bottom hem.Pretty in pink! Go for
                        sunset cocktails in this stunning pink mesh mini dress.
                        Whether it’s a special occasion or a night out, this dress is the perfect pick!
                        Accessories with gold jewellery, heels and a shoulder bag for a jaw dropping fit.
                        Open back. Halter neck. Mini length. V neckline. Fully lined with mesh outer layer.
                        Bodycon style. Stretch material. Frill mesh hem. Mesh rose on bottom hem.
                    </p>
                </div>
            </div>
            <Sidebar/>
        </div>

        </>
    );
};

export default Compilation;
