import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { useStore } from '../provider/StoreContext.jsx';
import TinderCard from "./TinderCard"; // Предполагается, что TinderCard — это отдельный компонент
import styles from "./ui/TinderCard.module.css";
import {SKELETON_COUNT, SWIPE_CONFIG} from "../constants.js";
import CustomSkeleton from "./utils/CustomSkeleton.jsx";
import {useNavigate} from "react-router-dom";

const CardStack = observer(({
                                swipeProgress,
                                topCardPosition,
                                handleSwipe,
                                updateSwipeFeedback,
                                onSaveClick,
                                isSearchActive,
                                onboardingIsActive,
                                setExpandedCardId,
                                expandedCardId,
                                setCardRef
                            }) => {
    const store = useStore();
    const swipeConfigMemo = useMemo(() => SWIPE_CONFIG, []);
    const navigate = useNavigate();
    // Выносим рендеринг скелетонов для лучшей читаемости
    const renderSkeletons = () => {
        return Array(SKELETON_COUNT).fill(0).map((_, i) => (
            <CustomSkeleton
                key={`skeleton-${i}`}
                style={{
                    width: '92vw',
                    height: 'calc(100% - 60px - 2vh)',
                    position: 'absolute',
                    zIndex: SKELETON_COUNT - i,
                    borderRadius: '8px'
                }}
            />
        ));
    };

    const renderCards = () => {
        return store?.catalogStore?.cards?.map((card, index) => (
            <TinderCard
                key={card._key} // Используем стабильный ключ
                card={card}
                onSwipe={handleSwipe}
                updateSwipeFeedback={updateSwipeFeedback}
                zIndex={10000 - index}
                offset={index}
                swipeConfig={swipeConfigMemo}
                isExpanded={expandedCardId === card.id}
                onExpand={() => setExpandedCardId(card.id)}
                onCollapse={() => setExpandedCardId(null)}
                isPending={card._pending}
                swipeProgress={index === 0 ? swipeProgress : null}
                isTopCard={index === 0}
                setCardRef={setCardRef}
                isOnboardingActive={onboardingIsActive && index === 0}
                onSaveClick={onSaveClick}
                topCardPosition={index === 0 ? topCardPosition : null}
                style={isSearchActive ? { opacity: 0, pointerEvents: 'none' } : {}}
            />
        ));
    };

    const renderEmptyState = () => {
        if (store.catalogStore.loading || isSearchActive || store.catalogStore.cards?.length > 0) return null;

        return (
            <div className={styles.emptyState}>
                <div className={styles.notCard}>
                    <p className={styles.notCardText}>Товары из ассортимента брендов закончились</p>
                </div>
                <p className={styles.notCardCatText}>Но можно посмотреть подборки</p>
                <div className={styles.collectionsBlock}>
                    {(store?.popular?.collections || []).map((item) => (
                        <div
                            key={`${item.id}`}
                            className={styles.collectionCard}
                            onClick={() => navigate(`/trands/collection/${item.id}`)}
                        >
                            <img className={styles.collectionImg} src={item.cover_image_url} alt={item.name} />
                            <p className={styles.collectionTitle}>{item.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.cardsContainer}>
            {(store.catalogStore.loading || isSearchActive) && renderSkeletons()}
            {!store.catalogStore.loading && !isSearchActive && renderCards()}
            {renderEmptyState()}
        </div>
    );
});

export default CardStack;