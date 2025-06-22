import React, { useState } from 'react';
import styles from './ui/addList.module.css';
import ButtonWrapper from "./ButtonWrapper.jsx";
import FullScreenButton from "./FullScrinButton.jsx";

const coverImages = [
    { url: 'https://avatars.mds.yandex.net/i?id=022c655b21f79d8837185f96c6e208dd_l-10767434-images-thumbs&n=13'},



]

function AddList() {
    const [closetName, setClosetName] = useState('');
    const [selectedCover, setSelectedCover] = useState(coverImages[0].url);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h2 className={styles.title}>Создать подборку</h2>
                <label className={styles.label}>Название</label>
                <input
                    type="text"
                    value={closetName}
                    onChange={(e) => setClosetName(e.target.value)}
                    className={styles.input}
                />

                <label className={styles.label}>Обложка</label>
                <div className={styles.selectedCover}>
                    <img src={selectedCover} alt="Selected Cover"/>
                    <span className={styles.coverText}>{closetName}</span>
                </div>

                <div className={styles.coverGrid}>
                    {coverImages.map((img) => (
                        <div key={img.url}>
                            <img
                                src={img.url}
                                className={`${styles.coverThumb} ${selectedCover === img ? styles.active : ''}`}
                                onClick={() => setSelectedCover(img.url)}
                            />
                        </div>
                    ))}

                </div>
            </div>

            <ButtonWrapper>
                <FullScreenButton>
                    Сохранить подборку
                </FullScreenButton>
            </ButtonWrapper>
        </div>
    );
}
export default AddList;