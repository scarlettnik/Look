import ButtonWrapper from "./utils/ButtonWrapper.jsx";
import styles from "./ui/profile.module.css";
import FullScreenButton from "./FullScrinButton.jsx";

const DeleteProfileButtons = ({ onDelete, onCancel }) => (
    <ButtonWrapper>
        <p className={styles.confirmDelete}>Вы уверены, что хотите удалить аккаунт?</p>
        <FullScreenButton
            color="var(--light-gray)"
            textColor="var(--black)"
            onClick={onDelete}
        >
            Удалить аккаунт
        </FullScreenButton>
        <FullScreenButton onClick={onCancel}>
            Отменить
        </FullScreenButton>
    </ButtonWrapper>
);
export default DeleteProfileButtons