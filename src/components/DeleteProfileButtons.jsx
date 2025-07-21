import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonWrapper from "./utils/ButtonWrapper.jsx";
import styles from "./ui/profile.module.css";
import FullScreenButton from "./FullScrinButton.jsx";

const DeleteProfileButtons = ({ onDelete, onCancel }) => {
    const [confirmStep, setConfirmStep] = useState(0);
    const navigate = useNavigate();

    const handleDeleteClick = () => {
        if (confirmStep === 0) {
            setConfirmStep(1);
        } else {
            onDelete(); // удалить аккаунт
            navigate("/account-deleted");
        }
    };

    return (
        <ButtonWrapper>
            {confirmStep === 1 && (
                <p className={styles.confirmDelete}>
                    Вы уверены, что хотите удалить аккаунт?
                </p>
            )}
            <FullScreenButton
                color="var(--light-gray)"
                textColor="var(--black)"
                onClick={handleDeleteClick}
            >
                Удалить аккаунт
            </FullScreenButton>
            <FullScreenButton onClick={onCancel}>
                Отменить
            </FullScreenButton>
        </ButtonWrapper>
    );
};

export default DeleteProfileButtons;
