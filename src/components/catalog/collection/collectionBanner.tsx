import { useState } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../../app/providers/storeContext';
import { PLACEHOLDER_ASSETS, UI_ICON_ASSETS } from '../../../lib/assets';
import type { ProductCollection } from '../../../types/domain';

import AddList from '../../collections/addList';
import CustomSkeleton from '../../shared/customSkeleton';
import FullScreenButton from '../../shared/fullScreenButton';
import Modal from '../../shared/modal';
import Share from '../../shared/share';
import styles from '../../ui/catalog/collection/compilation.module.css';

type CollectionBannerProps = {
    collectionId?: string;
    collection: ProductCollection | null;
    isSavedCollection: boolean;
    loading: boolean;
    onEnterEditMode?: () => void;
};

const CollectionBanner = observer(({
    collectionId,
    collection,
    isSavedCollection,
    loading,
    onEnterEditMode,
}: CollectionBannerProps) => {
    const { collectionStore } = useStore();
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isCollectionFormOpen, setIsCollectionFormOpen] = useState(false);
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
    const [editableCollection, setEditableCollection] = useState<ProductCollection | null>(null);

    const handleCreateCollection = (name: string, coverUrl: string) => {
        void collectionStore.createCollection(name, coverUrl);
        setIsCollectionFormOpen(false);
    };

    const handleUpdateCollection = async (name: string, coverUrl: string) => {
        if (!editableCollection) {
            return;
        }

        try {
            await collectionStore.updateCollection(editableCollection.id, {
                name,
                cover_image_url: coverUrl,
            });
            setEditableCollection(null);
            setIsCollectionFormOpen(false);
        } catch (error) {
            console.error('Ошибка при обновлении коллекции:', error);
        }
    };

    const openEditMenu = () => {
        setEditableCollection(collection);
        setIsActionMenuOpen(true);
    };

    if (loading) {
        return (
            <div className={styles.bannerContainer}>
                <div className={styles.banner}>
                    <CustomSkeleton className={styles.bannerImage} />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.bannerContainer}>
            <div className={styles.banner}>
                <img
                    src={collection?.cover_image_url || PLACEHOLDER_ASSETS.collectionBanner}
                    alt={collection?.name}
                    className={styles.bannerImage}
                    onError={(event) => {
                        event.currentTarget.src = PLACEHOLDER_ASSETS.collectionBanner;
                    }}
                />
                <div className={styles.bannerText}>
                    {collection?.name === '__FAVOURITES__' ? 'Лайки' : collection?.name}
                </div>

                <button type="button" onClick={() => setIsShareOpen(true)}>
                    <img className={styles.shareIcon} src={UI_ICON_ASSETS.share} alt="Поделиться" />
                </button>

                {isSavedCollection && (
                    <button
                        type="button"
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            openEditMenu();
                        }}
                    >
                        <img className={styles.editIcon} src={UI_ICON_ASSETS.edit} alt="Редактировать" />
                    </button>
                )}

                {isActionMenuOpen && (
                    <div className={styles.editOverlay}>
                        <FullScreenButton
                            variant="white"
                            onClick={() => {
                                setIsCollectionFormOpen(true);
                                setIsActionMenuOpen(false);
                            }}
                        >
                            Переименовать
                        </FullScreenButton>
                        <FullScreenButton
                            variant="white"
                            onClick={() => {
                                onEnterEditMode?.();
                                setIsActionMenuOpen(false);
                            }}
                        >
                            Удалить товары из подборки
                        </FullScreenButton>
                        <FullScreenButton onClick={() => setIsActionMenuOpen(false)}>
                            Отменить
                        </FullScreenButton>
                    </div>
                )}

                <Modal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)}>
                    <Share id={collectionId} />
                </Modal>

                <Modal isOpen={isCollectionFormOpen} onClose={() => setIsCollectionFormOpen(false)}>
                    <AddList
                        onCreate={handleCreateCollection}
                        onUpdate={handleUpdateCollection}
                        collection={editableCollection}
                        coverImage={collection?.cover_image_url}
                    />
                </Modal>
            </div>
        </div>
    );
});

export default CollectionBanner;
