import React from 'react';
import styles from './ui/shoppingCart.module.css';
import {Trash2} from "lucide-react";
import Sidebar from "./Sidebar.jsx";

const ShoppingCard = () => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <span className={styles.clear}>Clear</span>
                <h2>My Cart</h2>
                <span className={styles.faqs}>FAQs</span>
            </header>

            <div className={styles.subtotal}>Subtotal: <span>$130</span></div>
            <div className={styles.cardItems}>
                <div className={styles.cartItem}>
                    <img src="https://ir.ozone.ru/s3/multimedia-1-p/wc1000/7333611505.jpg" alt="Christy Hoodie" className={styles.itemImage}/>
                    <div className={styles.itemDetails}>
                        <div className={styles.itemTitle}>Christy Hoodie</div>
                        <div className={styles.itemBrand}>Brandy Melville</div>
                        <select className={styles.sizeSelect}>
                            <option>RegularFit</option>
                        </select>
                        <div className={styles.quantityRow}>
                            <button>-</button>
                            <span>1</span>
                            <button>+</button>
                            <Trash2 className={styles.trashIcon}/>
                        </div>
                        <div className={styles.estimated}>Estimated arrival 19 Sep - 24 Sep</div>
                        <div className={styles.price}>$35</div>
                    </div>
                </div>

                <div className={styles.cartItem}>
                    <img src="https://ir.ozone.ru/s3/multimedia-1-p/wc1000/7333611505.jpg" alt="Stay On My Mind Set Black" className={styles.itemImage}/>
                    <div className={styles.itemDetails}>
                        <div className={styles.itemTitle}>Stay On My Mind Set Black</div>
                        <div className={styles.itemBrand}>Hello Molly</div>
                        <select className={styles.sizeSelect}>
                            <option>M</option>
                        </select>
                        <div className={styles.quantityRow}>
                            <button>-</button>
                            <span>1</span>
                            <button>+</button>
                            <Trash2 className={styles.trashIcon}/>
                        </div>
                        <div className={styles.estimated}>Estimated arrival 21 Sep - 25 Sep</div>
                        <div className={styles.price}>$95</div>
                    </div>
                </div>
                <div className={styles.cartItem}>
                    <img src="https://ir.ozone.ru/s3/multimedia-1-p/wc1000/7333611505.jpg" alt="Stay On My Mind Set Black" className={styles.itemImage}/>
                    <div className={styles.itemDetails}>
                        <div className={styles.itemTitle}>Stay On My Mind Set Black</div>
                        <div className={styles.itemBrand}>Hello Molly</div>
                        <select className={styles.sizeSelect}>
                            <option>M</option>
                        </select>
                        <div className={styles.quantityRow}>
                            <button>-</button>
                            <span>1</span>
                            <button>+</button>
                            <Trash2 className={styles.trashIcon}/>
                        </div>
                        <div className={styles.estimated}>Estimated arrival 21 Sep - 25 Sep</div>
                        <div className={styles.price}>$95</div>
                    </div>
                </div>
            </div>
            <button className={styles.dealButton}>Find the best deal</button>
            <Sidebar/>
        </div>
    );
};

export default ShoppingCard;