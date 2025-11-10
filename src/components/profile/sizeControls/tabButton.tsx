import styles from "../../ui/profile/profile.module.css";

const TabButton = ({active, onClick, label }: any) => (
    <button
        className={active ? styles.active : ""}
        onClick={onClick}
    >
        <p className={styles.tabButtonLabel}>{label}</p>
    </button>
);

export default TabButton
