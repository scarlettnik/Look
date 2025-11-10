import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../app/providers/storeContext';
import { PLACEHOLDER_ASSETS, UI_ICON_ASSETS } from '../../lib/assets';
import { isSystemCollection } from '../../lib/systemCollections';
import type { ProductCollection } from '../../types/domain';

import AddList from './addList';
import ButtonWrapper from '../shared/buttonWrapper';
import CustomCheckbox from '../shared/customCheckbox';
import FullScreenButton from '../shared/fullScreenButton';
import Modal from '../shared/modal';
import Sidebar from '../navigation/sidebar';
import styles from '../ui/collections/save.module.css';

const Save = observer(() => {
  const { authStore, collectionStore } = useStore();
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<Array<number | string>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!window.visualViewport) {
      return;
    }

    const handleResize = () => {
      const newHeight = window.visualViewport?.height ?? window.innerHeight;
      const nextKeyboardOffset = window.innerHeight - newHeight;
      const safeKeyboardOffset = nextKeyboardOffset > 100 ? nextKeyboardOffset : 0;

      if (containerRef.current) {
        containerRef.current.style.setProperty('--viewport-height', `${newHeight}px`);
        containerRef.current.style.setProperty('--keyboard-offset', `${safeKeyboardOffset}px`);
      }
    };

    const handleScroll = () => {
      const activeElement = document.activeElement;
      if (activeElement?.tagName === 'INPUT') {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    handleResize();

    window.visualViewport.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const filteredCollections = authStore.collections.filter((collection: ProductCollection) =>
    collection.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleCollectionSelection = (collectionId: number | string) => {
    setSelectedCollectionIds((currentSelectedCollectionIds) =>
      currentSelectedCollectionIds.includes(collectionId)
        ? currentSelectedCollectionIds.filter(
            (selectedCollectionId) => selectedCollectionId !== collectionId,
          )
        : [...currentSelectedCollectionIds, collectionId],
    );
  };

  const toggleDeleteMode = () => {
    setIsModalOpen(false);
    setIsDeleteMode((currentValue) => !currentValue);
  };

  const handleDelete = async () => {
    try {
      await collectionStore.deleteCollections(selectedCollectionIds);
      setSelectedCollectionIds([]);
      setIsDeleteMode(false);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleCreateCollection = async (name: string, coverUrl: string) => {
    if (!name.trim()) {
      return;
    }

    setIsModalOpen(false);

    try {
      await collectionStore.createCollection(name, coverUrl);
    } catch (error) {
      console.error('Create failed:', error);
      alert('Не удалось создать коллекцию. Попробуйте снова.');
    }
  };

  return (
    <>
      <div ref={containerRef} className={styles.container}>
        <div className={styles.searchBar}>
          <div className={styles.searchContainer}>
            <span className={styles.searchIcon}>
              <img src={UI_ICON_ASSETS.search} alt="Поиск" />
            </span>
            <input
              type="text"
              placeholder="Search for a wishlist..."
              className={styles.input}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <div className={styles.buttons}>
            <button className={styles.circleButton} onClick={() => setIsModalOpen(true)}>
              <img src={UI_ICON_ASSETS.plus} alt="Создать" />
            </button>
            <button className={styles.circleButton} onClick={toggleDeleteMode}>
              <img src={UI_ICON_ASSETS.minus} alt="Удалить" />
            </button>
          </div>
        </div>

        <div className={`${styles.cards} ${isDeleteMode ? styles.cardsWithDeleteActions : ''}`.trim()}>
          {filteredCollections.length > 0 ? (
            filteredCollections.map((collection) => (
              <div key={collection.id} className={styles.cardContainer}>
                {isDeleteMode && !isSystemCollection(collection) && (
                  <div>
                    <CustomCheckbox
                      id={`save-${collection.id}`}
                      checked={selectedCollectionIds.includes(collection.id)}
                      onChange={() => toggleCollectionSelection(collection.id)}
                      className={styles.checkBox}
                    />
                  </div>
                )}
                <Link to={`/save/${collection.id}`}>
                  <div className={styles.card}>
                    <img
                      src={collection.cover_image_url || PLACEHOLDER_ASSETS.collectionBanner}
                      className={styles.image}
                      alt={collection.name}
                      onError={(event) => {
                        event.currentTarget.src = PLACEHOLDER_ASSETS.collectionBanner;
                      }}
                    />
                  </div>
                  <h3 className={styles.cardTitle}>
                    {isSystemCollection(collection) ? 'Лайки' : collection.name}
                  </h3>
                </Link>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyStateText}>Нет доступных товаров</p>
            </div>
          )}
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <AddList onCreate={handleCreateCollection} />
        </Modal>
      </div>

      {isDeleteMode && (
        <div className={styles.actionDock}>
          <ButtonWrapper>
            <FullScreenButton
              onClick={() => {
                setIsDeleteMode(false);
                setSelectedCollectionIds([]);
              }}
              variant="light"
            >
              Отменить
            </FullScreenButton>
            <FullScreenButton
              onClick={handleDelete}
              disabled={selectedCollectionIds.length === 0}
            >
              Удалить {selectedCollectionIds.length > 0 && selectedCollectionIds.length}
            </FullScreenButton>
          </ButtonWrapper>
        </div>
      )}
      <Sidebar />
    </>
  );
});

export default Save;
