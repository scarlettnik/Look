import styles from '../ui/shopping/shoppingCard.module.css';
import Sidebar from "../navigation/sidebar";

const ShoppingCard = () => {
    return (
        <div className={styles.container}>
            <div className={styles.contentWrapper}>
                <div className={styles.inCreate}>
                    <p className={styles.developmentMessage}>
                        Страница находится в разработке
                    </p>
                </div>
            </div>
            <Sidebar/>
        </div>
    );
};

export default ShoppingCard;
