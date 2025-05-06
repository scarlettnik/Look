import React, { useState } from 'react';
import styles from './ui/addToCloset.module.css';

const AddToCloset = () => {
    const [selected, setSelected] = useState(null);

    const closets = [
        { id: 1, name: 'All Saved', img: 'https://via.placeholder.com/40?text=💖' },
        { id: 2, name: 'Birthday', img: 'https://via.placeholder.com/40?text=🎂' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <p className={styles.title}>Add to Closet</p>
                <button className={styles.closeBtn}>✕</button>
            </div>

            <input className={styles.search} placeholder="Find Closet" />

            <div className={styles.closetList}>
                {closets.map(closet => (
                    <label key={closet.id} className={styles.closetItem}>
                        <img src={closet.img} alt={closet.name} />
                        <span>{closet.name}</span>
                        <input
                            type="radio"
                            checked={selected === closet.id}
                            onChange={() => setSelected(closet.id)}
                        />
                    </label>
                ))}
            </div>

            <p className={styles.note}>
                Note: all your right and up swipes are saved into "All Saved" by default
            </p>

            <button className={styles.newClosetBtn}>+ New closet</button>

            <button className={styles.doneBtn}>Done</button>
        </div>
    );
};

export default AddToCloset;
