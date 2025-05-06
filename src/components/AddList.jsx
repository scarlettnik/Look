import React, { useState } from 'react';
import styles from './ui/addList.module.css';

const coverImages = [
    { url: 'https://avatars.mds.yandex.net/i?id=022c655b21f79d8837185f96c6e208dd_l-10767434-images-thumbs&n=13'},
    { url: 'https://i.pinimg.com/736x/31/bd/9d/31bd9dcd26c6395e06f9a55011ae4856.jpg'},
    { url: 'https://avatars.mds.yandex.net/i?id=022c655b21f79d8837185f96c6e208dd_l-10767434-images-thumbs&n=13'},
    { url: 'https://i.pinimg.com/736x/31/bd/9d/31bd9dcd26c6395e06f9a55011ae4856.jpg'},
    { url: 'https://avatars.mds.yandex.net/i?id=022c655b21f79d8837185f96c6e208dd_l-10767434-images-thumbs&n=13'},
    { url: 'https://avatars.mds.yandex.net/i?id=022c655b21f79d8837185f96c6e208dd_l-10767434-images-thumbs&n=13'},
    { url: 'https://avatars.mds.yandex.net/i?id=022c655b21f79d8837185f96c6e208dd_l-10767434-images-thumbs&n=13'},
    { url: 'https://avatars.mds.yandex.net/i?id=022c655b21f79d8837185f96c6e208dd_l-10767434-images-thumbs&n=13'},
    { url: 'https://avatars.mds.yandex.net/i?id=022c655b21f79d8837185f96c6e208dd_l-10767434-images-thumbs&n=13'},
    { url: 'https://avatars.mds.yandex.net/i?id=022c655b21f79d8837185f96c6e208dd_l-10767434-images-thumbs&n=13'},
    { url: 'https://avatars.mds.yandex.net/i?id=022c655b21f79d8837185f96c6e208dd_l-10767434-images-thumbs&n=13'},
    { url: 'https://avatars.mds.yandex.net/i?id=022c655b21f79d8837185f96c6e208dd_l-10767434-images-thumbs&n=13'},
    { url: 'https://avatars.mds.yandex.net/i?id=022c655b21f79d8837185f96c6e208dd_l-10767434-images-thumbs&n=13'},
    { url: 'https://avatars.mds.yandex.net/i?id=022c655b21f79d8837185f96c6e208dd_l-10767434-images-thumbs&n=13'},
    { url: 'https://avatars.mds.yandex.net/i?id=022c655b21f79d8837185f96c6e208dd_l-10767434-images-thumbs&n=13'},
    { url: 'https://avatars.mds.yandex.net/i?id=022c655b21f79d8837185f96c6e208dd_l-10767434-images-thumbs&n=13'},
    { url: 'https://i.pinimg.com/736x/31/bd/9d/31bd9dcd26c6395e06f9a55011ae4856.jpg'},
    { url: 'https://avatars.mds.yandex.net/i?id=022c655b21f79d8837185f96c6e208dd_l-10767434-images-thumbs&n=13'},
    { url: 'https://i.pinimg.com/736x/31/bd/9d/31bd9dcd26c6395e06f9a55011ae4856.jpg'},
    { url: 'https://avatars.mds.yandex.net/i?id=022c655b21f79d8837185f96c6e208dd_l-10767434-images-thumbs&n=13'},
    { url: 'https://avatars.mds.yandex.net/i?id=022c655b21f79d8837185f96c6e208dd_l-10767434-images-thumbs&n=13'},
    { url: 'https://avatars.mds.yandex.net/i?id=022c655b21f79d8837185f96c6e208dd_l-10767434-images-thumbs&n=13'},
    { url: 'https://avatars.mds.yandex.net/i?id=022c655b21f79d8837185f96c6e208dd_l-10767434-images-thumbs&n=13'},

]

function AddList() {
    const [closetName, setClosetName] = useState('');
    const [selectedCover, setSelectedCover] = useState(coverImages[0].url);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h2 className={styles.title}>Create a Closet</h2>
                <button className={styles.close}>×</button>

                <label className={styles.label}>Choose a Closet Name:</label>
                <input
                    type="text"
                    value={closetName}
                    onChange={(e) => setClosetName(e.target.value)}
                    className={styles.input}
                />

                <label className={styles.label}>Cover Image:</label>
                <div className={styles.selectedCover}>
                    <img src={selectedCover} alt="Selected Cover"/>
                    <span className={styles.coverText}>{closetName}</span>
                </div>

                <div className={styles.coverGrid}>
                    {coverImages.map((img) => (
                        <div>
                            <img
                                key={img._key}
                                src={img.url}
                                className={`${styles.coverThumb} ${selectedCover === img ? styles.active : ''}`}
                                onClick={() => setSelectedCover(img.url)}
                            />
                        </div>
                    ))}

                </div>
            </div>

            <div className={styles.buttons}>
                <button className={styles.cancel}>Cancel</button>
                <button className={styles.create}>Create Closet</button>
            </div>
        </div>
    );
}
export default AddList;