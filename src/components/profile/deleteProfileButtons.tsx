import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../app/providers/storeContext';
import ButtonWrapper from '../shared/buttonWrapper';
import FullScreenButton from '../shared/fullScreenButton';
import styles from '../ui/profile/profile.module.css';

type DeleteProfileButtonsProps = {
    onCancel: () => void;
};

const DeleteProfileButtons = ({ onCancel }: DeleteProfileButtonsProps) => {
    const navigate = useNavigate();
    const { deleteAccount } = useAuth();
    const [confirmStep, setConfirmStep] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        setError(null);

        try {
            await deleteAccount();
            navigate('/account-deleted');
        } catch (deleteError) {
            console.error('Ошибка при удалении аккаунта:', deleteError);
            setError(
                deleteError instanceof Error
                    ? deleteError.message
                    : 'Не удалось удалить аккаунт',
            );
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteClick = () => {
        if (confirmStep === 0) {
            setConfirmStep(1);
            return;
        }

        void handleDeleteAccount();
    };

    return (
        <ButtonWrapper>
            {confirmStep === 1 && (
                <p className={styles.confirmDelete}>
                    Вы уверены, что хотите удалить аккаунт?
                </p>
            )}

            {error && <p className={styles.errorMessage}>{error}</p>}

            <FullScreenButton
                variant="light"
                onClick={handleDeleteClick}
                disabled={isDeleting}
            >
                {isDeleting ? 'Удаление...' : confirmStep === 0 ? 'Удалить аккаунт' : 'Да, удалить'}
            </FullScreenButton>

            <FullScreenButton
                onClick={confirmStep === 0 ? onCancel : () => setConfirmStep(0)}
                disabled={isDeleting}
            >
                Отменить
            </FullScreenButton>
        </ButtonWrapper>
    );
};

export default DeleteProfileButtons;
