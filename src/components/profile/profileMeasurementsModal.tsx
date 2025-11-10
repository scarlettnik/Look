import {useEffect, useState} from 'react';
import { observer } from 'mobx-react-lite';

import { useAuth, useStore } from '../../app/providers/storeContext';
import { createPreferencesDraft } from '../../lib/preferences';
import useIsKeyboardOpen from '../../hooks/useIsKeyboardOpen';

import FitOptions from './sizeControls/fitOptions';
import FullScreenButton from '../shared/fullScreenButton';
import Modal from '../shared/modal';
import ParamsTab from './sizeControls/paramsTab';
import SizeGrid from './sizeControls/sizeGrid';
import TabButton from './sizeControls/tabButton';
import UserInfo from './userInfo';
import styles from '../ui/profile/profile.module.css';

const ProfileMeasurementsModal = observer(({ isOpen, onClose, onSuccess }: any) => {
    const { authStore } = useStore();
    const { user } = useAuth();
    const [preferences, setPreferences] = useState(() =>
        createPreferencesDraft(authStore.preferences),
    );
    const [activeTab, setActiveTab] = useState('size');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isKeyboardOpen = useIsKeyboardOpen();

    useEffect(() => {
        if (isOpen) {
            setPreferences(createPreferencesDraft(authStore.preferences));
            setActiveTab('size');
            setError(null);
        }
    }, [authStore.preferences, isOpen]);

    const updateParam = (field, value) => {
        if (['breast', 'waist', 'hip'].includes(field)) {
            setPreferences((previousState) => ({
                ...previousState,
                size_parameters: {
                    ...previousState.size_parameters,
                    [field]: value,
                },
            }));
            return;
        }

        if (field === 'wearing_styles') {
            setPreferences((previousState) => {
                const nextWearingStyles = previousState.wearing_styles.includes(value)
                    ? previousState.wearing_styles.filter(
                        (currentValue) => currentValue !== value,
                    )
                    : [...previousState.wearing_styles, value];

                return {
                    ...previousState,
                    wearing_styles: nextWearingStyles,
                };
            });
            return;
        }

        setPreferences((previousState) => ({
            ...previousState,
            [field]: value,
        }));
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        setError(null);

        try {
            await authStore.savePreferences({
                clothing_size: preferences.clothing_size,
                size_parameters: preferences.size_parameters,
                wearing_styles: preferences.wearing_styles,
                age: preferences.age,
            });

            onClose();
            onSuccess();
        } catch (saveError) {
            console.error('Failed to save profile measurements:', saveError);
            setError('Не удалось сохранить изменения');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="fullscreen"
            panelClassName={styles.profileSheet}
        >
            <div className={styles.profileSheetBody}>
                <UserInfo
                    photoUrl={user?.photo_url}
                    firstName={user?.first_name}
                    lastName={user?.last_name}
                />

                <p className={styles.manuLabel}>
                    Мои параметры
                </p>

                <div className={styles.paramsBlock}>
                    <div className={styles.tabs}>
                        <TabButton
                            active={activeTab === 'size'}
                            onClick={() => setActiveTab('size')}
                            label="Размер"
                        />
                        <TabButton
                            active={activeTab === 'params'}
                            onClick={() => setActiveTab('params')}
                            label="Параметры"
                        />
                    </div>

                    <div className={styles.tabContent}>
                        {activeTab === 'size' && (
                            <SizeGrid
                                params={preferences}
                                updateParam={updateParam}
                            />
                        )}

                        {activeTab === 'params' && (
                            <ParamsTab
                                params={preferences}
                                updateParam={updateParam}
                            />
                        )}

                        <div className={styles.fitOptionsWrapper}>
                            <p className={styles.textwear}>Ношу одежду</p>
                            <FitOptions
                                params={preferences}
                                updateParam={(value) => updateParam('wearing_styles', value)}
                            />
                        </div>
                    </div>
                </div>

                {error && <p className={styles.errorMessage}>{error}</p>}

                {!isKeyboardOpen && (
                    <div className={styles.profileSheetFooter}>
                        <FullScreenButton
                            variant='light'
                            onClick={handleSaveChanges}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Сохранение...' : 'Изменить значения'}
                        </FullScreenButton>
                        <FullScreenButton
                            onClick={onClose}
                            disabled={isSaving}
                        >
                            Отменить
                        </FullScreenButton>
                    </div>
                )}
            </div>
        </Modal>
    );
});

export default ProfileMeasurementsModal;
