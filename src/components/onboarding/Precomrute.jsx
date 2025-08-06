import React, { useState, useEffect } from 'react';
import styles from '../ui/precompute.module.css';
import FullScreenButton from "../FullScrinButton.jsx";

const Precompute = ({onNext}) => {
    const [count, setCount] = useState(1);
    const images = Array.from({ length: 8 }, () => '/stylereference.png');

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prev) => (prev < 100 ? prev + 1 : 100));
        }, 60);

        return () => clearInterval(interval);
    }, []);


    return (
        <>
            <p>
                Собираем гардероб, <br/>секундочку...
            </p>
        <div className={styles.wrapper}>
            <div className={styles.spinner}>
                {images.map((src, i) => (
                    <div
                        key={i}
                        className={styles.imageContainer}
                        style={{
                            transform: `rotate(${i * 45}deg) translate(100px)`
                        }}
                    >
                        <img
                            src={src}
                            alt="orbit"
                            className={styles.image}
                            style={{ transform: 'rotate(105deg)' }}
                        />
                    </div>
                ))}
            </div>
            <div className={styles.centerText}>{count}%</div>
            <FullScreenButton
                color='var(--beige)'
                textColor='var(--black)'
                onClick={onNext}
            >
                Далее
            </FullScreenButton>
        </div>
            </>
    );
};

export default Precompute;