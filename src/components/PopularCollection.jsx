import {useNavigate, useParams} from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {useStore} from "../provider/StoreContext.jsx";
import styles from './ui/popualCollection.module.css';
import React, {useEffect} from "react";
import Sidebar from "./Sidebar.jsx";
import CustomSkeleton from "./utils/CustomSkeleton.jsx";

const PopularCollection = observer(() => {
    const { id } = useParams();
    const navigate = useNavigate();
    const store = useStore();

    useEffect(() => {
        store.collectionStore.loadCollection(id);
    }, [id, location.pathname]);

    const { currentCollection: save, loading } = store.collectionStore;
    const currentItem = store.popular.popular.find(item => item.id === id);



    if (!currentItem) {
        return <div>Коллекция не найдена</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.stepHeader}>
                <button
                    className={styles.backButton}
                    onClick={() => navigate(-1)}
                >
                    <img src='/subicons/arrowleft.svg' className={styles.backButtonImg} alt="Назад"/>
                </button>
                <p className={styles.stepTitle}>{currentItem.name}</p>
            </div>
            <img className={styles.collectionImage} src={currentItem.cover_image_url}/>
            <div className={styles.cardContainer}>
                {loading ? (
                    [...Array(8)].map((_, i) => (
                            <CustomSkeleton className={styles.card} key={i} style={{width:'46vw', height:'46vw', marginTop: '10px'}}/>
                    ))
                ) : (
                    save?.products?.map((item) => (
                        <div key={item.id}>
                            <img className={styles.card} src={item.image_urls[0]} alt={item.name}/>
                        </div>
                    ))
                )}
            </div>
            <Sidebar/>
        </div>
    );
});

export default PopularCollection;