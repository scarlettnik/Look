import { useState, useEffect } from 'react';
import styles from '../../ui/onboarding/steps/precompute.module.css';
import FullScreenButton from "../../shared/fullScreenButton";
import ButtonWrapper from "../../shared/buttonWrapper";
import { CLOTH_STYLES } from "../../../constants";

const Precompute = ({onNext}: any) => {
    const [count, setCount] = useState(1);
    const images = CLOTH_STYLES.slice(0, 8).map((style) => style.url);

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prev) => (prev < 100 ? prev + 1 : 100));
        }, 40);

        return () => clearInterval(interval);
    }, []);


    return (
        <>
            <p className={styles.title}>
                Собираем гардероб, <br/>секундочку...
            </p>
        <div className={styles.wrapper}>
            <div className={styles.spinner}>
                {images.map((src, i) => (
                    <div
                        key={i}
                        className={`${styles.imageContainer} ${styles[`orbit${i}`]}`}
                    >
                        <img
                            src={src}
                            alt="orbit"
                            className={`${styles.image} ${styles.imageTilt}`}
                        />
                    </div>
                ))}
            </div>
            <div className={styles.centerText}>{count}%</div>

        </div>
            <ButtonWrapper>
                <FullScreenButton
                    variant='beige'
                    onClick={onNext}
                    disabled={count < 100}
                >
                    Далее
                </FullScreenButton>
            </ButtonWrapper>
            </>
    );
};

export default Precompute;
