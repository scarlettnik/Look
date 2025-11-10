import { useEffect, useState } from 'react';
import FullScreenButton from '../../../components/shared/fullScreenButton';
import useIsKeyboardOpen from '../../../hooks/useIsKeyboardOpen';
import { PLACEHOLDER_ASSETS, UI_ICON_ASSETS } from '../../../lib/assets';
import { coverImages } from '../../../constants';
import type { ProductCollection } from '../../../types/domain';
import styles from './collectionForm.module.css';

type CollectionFormSubmitHandler = (name: string, coverImageUrl: string) => void | Promise<void>;

type CollectionFormProps = {
    onCreate?: CollectionFormSubmitHandler;
    onUpdate?: CollectionFormSubmitHandler;
    collection?: ProductCollection | null;
    initialCollectionName?: string;
    initialCoverImageUrl?: string;
    coverImage?: string;
};

const CollectionForm = ({
    onCreate,
    onUpdate,
    collection = null,
    initialCollectionName = '',
    initialCoverImageUrl = '',
    coverImage = '',
}: CollectionFormProps) => {
    const [collectionName, setCollectionName] = useState(initialCollectionName);
    const [selectedCoverImageUrl, setSelectedCoverImageUrl] = useState(initialCoverImageUrl || coverImage);
    const isKeyboardOpen = useIsKeyboardOpen();

    const isEditing = Boolean(collection);

    useEffect(() => {
        if (collection) {
            setCollectionName(collection.name ?? '');
            setSelectedCoverImageUrl(collection.cover_image_url || initialCoverImageUrl || coverImage || coverImages[0].url);
            return;
        }

        setCollectionName(initialCollectionName);
        setSelectedCoverImageUrl(initialCoverImageUrl || coverImage || coverImages[0].url);
    }, [collection, coverImage, initialCollectionName, initialCoverImageUrl]);

    const handleSubmit = () => {
        const trimmedCollectionName = collectionName.trim();

        if (!trimmedCollectionName) {
            return;
        }

        const submitHandler = isEditing ? onUpdate : onCreate;

        submitHandler?.(trimmedCollectionName, selectedCoverImageUrl || initialCoverImageUrl || coverImage);
    };

    return (
        <div className={styles.sheet}>
            <div className={styles.body}>
                <h2 className={styles.title}>
                    {isEditing ? 'Редактировать подборку' : 'Создать подборку'}
                </h2>

                <label className={styles.fieldLabel}>Название</label>
                <input
                    type="text"
                    value={collectionName === '__FAVOURITES__' ? 'Лайки' : collectionName}
                    onChange={(event) => setCollectionName(event.target.value)}
                    className={styles.textInput}
                    placeholder="Введите название подборки"
                />

                <label className={styles.fieldLabel}>Обложка</label>
                <div className={styles.coverPreview}>
                    <img
                        src={selectedCoverImageUrl}
                        alt="Обложка подборки"
                        className={styles.coverPreviewImage}
                        onError={(event) => {
                            event.currentTarget.src = PLACEHOLDER_ASSETS.collectionBanner;
                        }}
                    />
                </div>

                <div className={styles.coverGrid}>
                    {coverImages.map(({ url }) => {
                        const isSelected = selectedCoverImageUrl === url;

                        return (
                            <button
                                key={url}
                                type="button"
                                className={styles.coverOptionButton}
                                onClick={() => setSelectedCoverImageUrl(url)}
                            >
                                <img
                                    src={url}
                                    className={[
                                        styles.coverOptionImage,
                                        isSelected ? styles.coverOptionImageActive : '',
                                    ].filter(Boolean).join(' ')}
                                    alt="Вариант обложки"
                                />

                                {isSelected && (
                                    <div className={styles.coverOptionOverlay}>
                                        <img
                                            src={UI_ICON_ASSETS.checkmark}
                                            className={styles.coverOptionCheck}
                                            alt="Обложка выбрана"
                                        />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {!isKeyboardOpen && (
                <div className={styles.footer}>
                    <FullScreenButton onClick={handleSubmit} disabled={!collectionName.trim()}>
                        {isEditing ? 'Сохранить изменения' : 'Сохранить подборку'}
                    </FullScreenButton>
                </div>
            )}
        </div>
    );
};

export default CollectionForm;
