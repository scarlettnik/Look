import React, { useState } from 'react';
import {Link, useParams, useNavigate} from 'react-router-dom';
import styles from './ui/compilation.module.css';
import Sidebar from './Sidebar';
import Modal from './utils/Modal.jsx'
import { observer } from "mobx-react-lite";
import { useStore } from '../provider/StoreContext';
import Share from "./utils/Share.jsx";
import AddList from "./AddList.jsx"; // Путь к вашему контексту

const Compilation = observer(() => {
    const { id } = useParams();
    const store = useStore();

    const save = store.saves.find(save => save.id === parseInt(id));

    const [filters, setFilters] = useState({
        size: null,
        brand: null,
        price: null,
        type: null
    });


    if (!save) {
        return (
            <div className={styles.container}>
                <div className={styles.notFound}>
                    <h2>Коллекция не найдена</h2>
                </div>
                <Sidebar />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.scrollContent}>
                <Banner
                    save={save}
                />

                <FilterBar
                    filters={filters}
                    setFilters={setFilters}
                />

                <div className={styles.itemsGrid}>
                    {save.items?.map((item, index) => (
                        <Link
                            to={`/product/${item.id}`}
                            key={item.id}
                        >
                            <img
                                src={item.url}
                                alt={`${item.name || 'Item'} ${index}`}
                                className={styles.itemImage}
                            />
                        </Link>
                    ))}
                </div>
            </div>
            <Sidebar />
        </div>
    );
});

export default Compilation;


export const Banner = observer(({ save }) => {
    const [isShareOpen, setIsShareOpen] = useState(false);
    const handleCloseShare = () => setIsShareOpen(false);
    const [editingCollection, setEditingCollection] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const store = useStore();

    const handleCreateCollection = (name, coverUrl) => {
        store.createCollection(name, coverUrl);
        setIsModalOpen(false);
    };

    const handleUpdateCollection = (name, coverUrl) => {
        if (editingCollection) {
            store.updateCollection(editingCollection.id, {
                name,
                url: coverUrl
            });
            setIsModalOpen(false);
            setEditingCollection(null);
        }
    };
    const handleEditCollection = (collection) => {
        setEditingCollection(collection);
        setIsModalOpen(true);
    };
    return (
        <div className={styles.bannerContainer}>
            <div className={styles.banner}>
                <img
                    src={save?.url}
                    alt={save?.name}
                    className={styles.bannerImage}
                />
                <div className={styles.bannerText}>{save?.name}</div>
                <button onClick={() => setIsShareOpen(true)}><img className={styles.shareIcon} src='/subicons/share.svg'/></button>
                <button  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleEditCollection(save);
                }}><img className={styles.editIcon} src='/subicons/edit.svg'/>
                </button>
                <Modal isOpen={isShareOpen} onClose={handleCloseShare}>
                    <Share url={window.location.href}/>
                </Modal>
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <AddList  onCreate={handleCreateCollection}
                              onUpdate={handleUpdateCollection}
                              collection={editingCollection}/>
                </Modal>
            </div>
        </div>
    );
});


const FilterBar = ({filters, setFilters}) => {
    const [activeFilter, setActiveFilter] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    const openFilter = (filterName) => {
        setActiveFilter(filterName);
        setIsModalOpen(true);
    };

    const closeFilter = () => {
        setIsModalOpen(false);
        setActiveFilter(null);
    };

    const applyFilter = (value) => {
        if (activeFilter) {
            setFilters(prev => ({
                ...prev,
                [activeFilter]: value
            }));
            closeFilter();
        }
    };

    const clearFilter = (filterName, e) => {
        e.stopPropagation();
        setFilters(prev => ({
            ...prev,
            [filterName]: null
        }));
    };

    const renderFilterModal = () => {
        switch (activeFilter) {
            case 'size':
                return <SizeFilter applyFilter={applyFilter} currentValue={filters.size} />;
            case 'brand':
                return <BrandFilter applyFilter={applyFilter} currentValue={filters.brand} />;
            case 'price':
                return <PriceFilter applyFilter={applyFilter} currentValue={filters.price} />;
            case 'type':
                return <TypeFilter applyFilter={applyFilter} currentValue={filters.type} />;
            default:
                return null;
        }
    };

    const formatPriceFilter = () => {
        if (!filters.price) return 'Стоимость';

        const { min, max } = filters.price;
        if (min && max) return `${min}₽ - ${max}₽`;
        if (min) return `От ${min}₽`;
        if (max) return `До ${max}₽`;
        return 'Стоимость';
    };

    return (
        <>
            <div className={styles.filterBar}>
                <button onClick={handleBack} className={styles.filterButton}><img src='/subicons/arrowLeft.svg'/></button>
                <button className={styles.filterButton}><img src='/subicons/filter.svg'/></button>
                <button
                    className={`${styles.filterButton} ${filters.size ? styles.activeFilter : ''}`}
                    onClick={() => openFilter('size')}
                >
                    Размерhhhhhhhhhhhhhhh
                    {filters.size && (
                        <span
                            className={styles.clearFilter}
                            onClick={(e) => clearFilter('size', e)}
                        >
                            ✕
                        </span>
                    )}
                </button>

                <button
                    className={`${styles.filterButton} ${filters.brand ? styles.activeFilter : ''}`}
                    onClick={() => openFilter('brand')}
                >
                    Бренд
                    {filters.brand && (
                        <span
                            className={styles.clearFilter}
                            onClick={(e) => clearFilter('brand', e)}
                        >
                            ✕
                        </span>
                    )}
                </button>

                <button
                    className={`${styles.filterButton} ${filters.price ? styles.activeFilter : ''}`}
                    onClick={() => openFilter('price')}
                >
                    {formatPriceFilter()}
                    {filters.price && (
                        <span
                            className={styles.clearFilter}
                            onClick={(e) => clearFilter('price', e)}
                        >
                            ✕
                        </span>
                    )}
                </button>

                <button
                    className={`${styles.filterButton} ${filters.type ? styles.activeFilter : ''}`}
                    onClick={() => openFilter('type')}
                >
                    Тип
                    {filters.type && (
                        <span
                            className={styles.clearFilter}
                            onClick={(e) => clearFilter('type', e)}
                        >
                            ✕
                        </span>
                    )}
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeFilter}>
            <div className={styles.filterModal}>
                    <h3 className={styles.modalTitle}>
                        {activeFilter === 'size' && 'Выберите размер'}
                        {activeFilter === 'brand' && 'Выберите бренд'}
                        {activeFilter === 'price' && 'Укажите диапазон цены'}
                        {activeFilter === 'type' && 'Выберите тип'}
                    </h3>
                    {renderFilterModal()}
                </div>
            </Modal>
        </>
    );
};


const SizeFilter = ({ applyFilter, currentValue }) => {
    const sizes = ['XS', 'S', 'M', 'L', 'XL'];

    return (
        <>
            <div className={styles.filterOptions}>
                {sizes.map((size, index) => (
                    <button
                        key={index}
                        className={`${styles.optionButton} ${currentValue === size ? styles.selectedOption : ''}`}
                        onClick={() => applyFilter(size)}
                    >
                        {size}
                    </button>
                ))}
            </div>
            <button
                className={styles.cancelButton}
                onClick={() => applyFilter(null)}
            >
                Отмена
            </button>
        </>
    );
};


const BrandFilter = ({ applyFilter, currentValue }) => {
    const brands = ['Nike', 'Adidas', 'Zara', 'H&M', 'Gucci'];

    return (
        <>
            <div className={styles.filterOptions}>
                {brands.map((brand, index) => (
                    <button
                        key={index}
                        className={`${styles.optionButton} ${currentValue === brand ? styles.selectedOption : ''}`}
                        onClick={() => applyFilter(brand)}
                    >
                        {brand}
                    </button>
                ))}
            </div>
            <button
                className={styles.cancelButton}
                onClick={() => applyFilter(null)}
            >
                Отмена
            </button>
        </>
    );
};

const PriceFilter = ({ applyFilter, currentValue }) => {
    const [minPrice, setMinPrice] = useState(currentValue?.min || '');
    const [maxPrice, setMaxPrice] = useState(currentValue?.max || '');

    const handleApply = () => {
        applyFilter({
            min: minPrice ? parseInt(minPrice) : null,
            max: maxPrice ? parseInt(maxPrice) : null
        });
    };

    return (
        <div className={styles.priceFilterContainer}>
            <div className={styles.priceInputs}>
                <input
                    type="number"
                    placeholder="От"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className={styles.priceInput}
                />
                <span className={styles.priceSeparator}>-</span>
                <input
                    type="number"
                    placeholder="До"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className={styles.priceInput}
                />
            </div>
            <div className={styles.priceButtons}>
                <button
                    className={styles.cancelPriceButton}
                    onClick={() => applyFilter(null)}
                >
                    Сбросить
                </button>
                <button
                    className={styles.applyPriceButton}
                    onClick={handleApply}
                    disabled={!minPrice && !maxPrice}
                >
                    Применить
                </button>
            </div>
        </div>
    );
};

const TypeFilter = ({ applyFilter, currentValue }) => {
    const types = ['Одежда', 'Обувь', 'Аксессуары', 'Электроника'];

    return (
        <>
            <div className={styles.filterOptions}>
                {types.map((type, index) => (
                    <button
                        key={index}
                        className={`${styles.optionButton} ${currentValue === type ? styles.selectedOption : ''}`}
                        onClick={() => applyFilter(type)}
                    >
                        {type}
                    </button>
                ))}
            </div>
            <button
                className={styles.cancelButton}
                onClick={() => applyFilter(null)}
            >
                Отмена
            </button>
        </>
    );
};


