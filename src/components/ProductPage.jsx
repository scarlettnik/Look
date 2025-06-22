import React, { useState, useRef } from 'react';
import Sidebar from './Sidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ui/productPage.module.css';
import Share from "./utils/Share.jsx";
import Modal from "./utils/Modal.jsx";
import FullScreenButton from "./FullScrinButton.jsx";

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
                <button className={styles.backButton} onClick={() => {
                    navigate(-1)
                }}>
                    <img style={{width: '30px'}} src='/subicons/arrowLeft.svg'/>
                </button>
                <button className={styles.shareButton} onClick={handleShare}>
                    <img style={{width: '20px'}}  src='/subicons/darkShare.svg'/>
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
                    <p style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent:'center'}} > На сайт продавца <img src='/subicons/shoppingBag.svg'/> </p>
                </FullScreenButton>

                <div className={styles.description}>
                    <h3>Description</h3>
                    <button className={styles.bookmark} onClick={handleShare}>📤</button>
                    <Modal isOpen={isShareOpen} onClose={handleCloseShare}>
                       <Share url={window.location.href}/>
                    </Modal>
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
