import { useState, useEffect } from 'react';
import styles from '../ui/precompute.module.css';

const Precompute = () => {
    const [count, setCount] = useState(1);
    const images = Array.from({ length: 8 }, () => '/stylereference.png');

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prev) => (prev < 100 ? prev + 1 : 100));
        }, 30);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className={styles.spinner}>
                {images.map((src, i) => (
                    <div
                        key={i}
                        className={styles.imageContainer}
                        style={{
                            transform: `rotate(${i * 45}deg) translate(120px)`
                        }}
                    >
                        <img
                            src={src}
                            alt="orbit"
                            className={styles.image}
                            style={{ transform: 'rotate(105deg)' }} // Дополнительный поворот если нужно
                        />
                    </div>
                ))}
            </div>
            <div className={styles.centerText}>{count}</div>
        </div>
    );
};

export default Precompute;