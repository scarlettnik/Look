import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from '../../../app/providers/storeContext';

import Sidebar from "../../navigation/sidebar";
import CustomSkeleton from "../../shared/customSkeleton";

import styles from "../../ui/catalog/compare/comparing.module.css";

const Comparing = observer(() => {
    const store  = useStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("trends");
    const { popularStore } = store;

    useEffect(() => {
        if (activeTab === "trends") {
            void popularStore.fetchGlobalTrends();
            void popularStore.fetchPersonalTrends();
        } else {
            void popularStore.fetchGlobalBrands();
            void popularStore.fetchPersonalBrands();
        }
    }, [activeTab, popularStore]);

    const isTrendsTab = activeTab === "trends";

    const items = isTrendsTab
        ? popularStore.globalTrendCollections
        : popularStore.globalBrandCollections;
    const collections = isTrendsTab
        ? popularStore.personalTrendCollections
        : popularStore.personalBrandCollections;

    const isItemsLoading = isTrendsTab
        ? popularStore.isGlobalTrendsLoading
        : popularStore.isGlobalBrandsLoading;
    const isCollectionsLoading =
        popularStore.isPersonalTrendsLoading || popularStore.isPersonalBrandsLoading;

    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.tabs}>
                <button
                    className={activeTab === "trends" ? styles.active : ""}
                    onClick={() => setActiveTab("trends")}
                >
                    Тренды
                </button>
                <button
                    className={activeTab === "brands" ? styles.active : ""}
                    onClick={() => setActiveTab("brands")}
                >
                    Бренды
                </button>
            </div>

            <p className={styles.trandsTitle}>
                {isTrendsTab ? "Тренды сезона" : "Популярные бренды"}
            </p>

            <div className={styles.scrollBlock}>
                {isItemsLoading
                    ? Array.from({ length: 4 })
                        .map((_, i) => (
                            <div key={i} className={styles.card}>
                                <CustomSkeleton
                                    className={`${styles.cardImg} ${styles.cardImageSkeleton}`}
                                />
                                <CustomSkeleton
                                    className={`${styles.cardTitle} ${styles.cardTitleSkeleton}`}
                                />
                            </div>
                        ))
                    : Array.from({ length: 1 })
                        .flatMap(() => items || [])
                        .map((item, index) => (
                            <div
                                key={`${item.id}-${index}`}
                                className={styles.card}
                                onClick={() => navigate(`/trands/${item.id}`)}
                            >
                                <img
                                    className={styles.cardImg}
                                    src={item.cover_image_url}
                                    alt={item.name}
                                />
                                <p className={styles.cardTitle}>{item.name}</p>
                            </div>
                        ))}
            </div>

            <p className={styles.trandsTitle}>Подборки</p>
            <div className={styles.collectionsBlock}>
                {isCollectionsLoading
                    ? Array.from({ length: 4 })
                        .map((_, i) => (
                            <div key={i} className={styles.collectionCard}>
                                <CustomSkeleton
                                    className={`${styles.collectionImg} ${styles.collectionImageSkeleton}`}
                                />
                                <CustomSkeleton
                                    className={`${styles.collectionTitle} ${styles.collectionTitleSkeleton}`}
                                />
                            </div>
                        ))
                    : Array.from({ length: 1 })
                        .flatMap(() => collections || [])
                        .map((item, index) => (
                            <div
                                key={`${item.id}-${index}`}
                                className={styles.collectionCard}
                                onClick={() => navigate(`/trands/collection/${item.id}`)}
                            >
                                <img
                                    className={styles.collectionImg}
                                    src={item.cover_image_url}
                                    alt={item.name}
                                />
                                <p className={styles.collectionTitle}>{item.name}</p>
                            </div>
                        ))}
            </div>
        </div>
    );
});

export default Comparing;
