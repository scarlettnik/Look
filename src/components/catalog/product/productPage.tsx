import {useState, useRef, useEffect, useCallback} from 'react';
import Sidebar from '../../navigation/sidebar';
import {useNavigate, useParams} from 'react-router-dom';
import styles from '../../ui/catalog/product/productPage.module.css';
import FullScreenButton from "../../shared/fullScreenButton";
import CustomSkeleton from "../../shared/customSkeleton";
import SaveToCollectionModal from "../../collections/saveToCollectionsModal";
import { NAVIGATION_ICON_ASSETS, UI_ICON_ASSETS } from "../../../lib/assets";
import { apiGetJson } from "../../../lib/apiClient";
import type { ProductCard, ProductColorVariant } from "../../../types/domain";

const ProductPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dragX, setDragX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const touchStartX = useRef(0);
    const [product, setProduct] = useState<ProductCard | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | string[] | null>(null);
    const [currentColorId, setCurrentColorId] = useState(id);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const sliderTrackRef = useRef<any>(null);


    const handleColorChange = async (color) => {
        if (color.product_id === currentColorId || isTransitioning) return;

        try {
            setIsTransitioning(true);
            await loadProduct(color.product_id);
            setCurrentColorId(color.product_id);
        } catch (err) {
            console.error('Error changing color:', err);
        } finally {
            setIsTransitioning(false);
        }
    };

    const fetchProduct = useCallback(async (productId: string | number) => {
        try {
            setLoading(true);
            return await apiGetJson<ProductCard>(`/v1/catalog/product/${productId}`);
        } catch (err) {
            console.error('Error fetching product:', err);
            throw err;
        }
    }, []);
    const handleOpenSaveModal = useCallback(() => {
        setIsSaveModalOpen(true);
    }, []);
    const handleCloseSaveModal = useCallback(() => {
        setIsSaveModalOpen(false);
    }, []);

    const loadProduct = useCallback(async (productId: string | number) => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchProduct(productId);
            setProduct(data);
            setCurrentIndex(0);
            setSelectedSize(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load product');
        } finally {
            setLoading(false);
        }
    }, [fetchProduct]);

    useEffect(() => {
        if (id) loadProduct(id);
    }, [id, loadProduct]);

    useEffect(() => {
        if (!sliderTrackRef.current) {
            return;
        }

        sliderTrackRef.current.style.transform = `translateX(calc(${-currentIndex * 100}% + ${dragX}px))`;
        sliderTrackRef.current.style.transition = isDragging ? 'none' : 'transform 0.3s ease';
    }, [currentIndex, dragX, isDragging]);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        setIsDragging(true);
    };

    const handleTouchMove = (e) => {
        const moveX = e.touches[0].clientX - touchStartX.current;
        setDragX(moveX);
    };

    const handleTouchEnd = () => {
        if (dragX > 80 && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else if (dragX < -80 && currentIndex < (product?.image_urls?.length ?? 0) - 1) {
            setCurrentIndex(currentIndex + 1);
        }
        setDragX(0);
        setIsDragging(false);
    };

    if (error) return <div className={styles.error}>Ошибка загрузки товара: {error}</div>;

    const toggleExpanded = () => setIsExpanded(prev => !prev);

    const lines = product?.description?.split('\n') || [];

    return (
        <div className={styles.container}>
            <div
                className={styles.slider}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <button className={styles.backButton} onClick={() => navigate(-1)}>
                    <img className={styles.backIcon} src={UI_ICON_ASSETS.arrowLeft} alt="Назад"/>
                </button>

                {loading ? (
                    <CustomSkeleton className={styles.fullPageSkeleton} />
                ) : (
                    <>
                        <div
                            ref={sliderTrackRef}
                            className={styles.sliderInner}
                        >
                            {product?.image_urls?.map((src, index) => (
                                <img key={index} src={src} alt={`Slide ${index}`} className={styles.image}/>
                            ))}
                        </div>
                        <div className={styles.progressDots}>
                            {product?.image_urls?.map((_, index) => (
                                <span
                                    key={index}
                                    className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className={styles.infoCard}>
                {loading ? (
                    <>
                        <CustomSkeleton className={styles.textLinePrimarySkeleton} />
                        <CustomSkeleton className={styles.textLineSecondarySkeleton}/>
                        <CustomSkeleton className={styles.priceLineSkeleton}/>
                        <FullScreenButton>
                            <p className={styles.sellerButtonContent}>
                                На сайт продавца <img src={UI_ICON_ASSETS.shoppingBag} alt="Корзина"/>
                            </p>
                        </FullScreenButton>
                    </>
                ) : (
                    <>
                        <p className={styles.title}>{product?.name}</p>
                        <p className={styles.brand}>{product?.brand}</p>
                        <div className={styles.header}>
                            <p className={styles.price}>
                                {product?.discount_price && product?.discount_price !== product?.price ? (
                                    <>
                                        <span className={styles.oldPrice}>
                                            {product.price} ₽
                                        </span>
                                        {product?.discount_price} ₽
                                    </>
                                ) : (
                                    `${product?.price} ₽`
                                )}
                            </p>
                            <button
                                className={styles.iconButton}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenSaveModal();
                                }}
                            >
                                <img
                                    className={styles.saveIcon}
                                    src={product.is_contained_in_user_collections
                                        ? NAVIGATION_ICON_ASSETS.active.save
                                        : NAVIGATION_ICON_ASSETS.inactive.save}
                                    alt={product.is_contained_in_user_collections ? "Сохранено" : "Сохранить"}
                                />
                            </button>
                        </div>
                        <FullScreenButton onClick={() => {
                            if (window.Telegram?.WebApp?.openLink) {
                                window.Telegram.WebApp.openLink(product?.original_url);
                            } else {
                                window.open(product?.original_url, '_blank');
                            }
                        }}>
                            <div className={styles.sellerButtonContent}>
                                На сайт продавца <img src={UI_ICON_ASSETS.shoppingBag} alt="Корзина" />
                            </div>
                        </FullScreenButton>

                    </>
                )}

                <p className={styles.blockTitle}>О товаре</p>
                {loading ? (
                    <CustomSkeleton className={styles.sectionSkeleton} />
                ) : (
                    <span className={styles.description}>
                        <div>
                            <div
                                className={`${styles.description} ${!isExpanded ? styles.clamped : ''}`}
                            >
                                {lines.map((line, index) => (
                                    <p key={index}>{line}</p>
                                ))}
                            </div>

                            {lines.length > 4 && (
                                <button onClick={toggleExpanded} className={styles.readMoreButton}>
                                    {isExpanded ? 'Скрыть' : 'Подробнее'}
                                </button>
                            )}
                        </div>
                        <div className={styles.descriptionDivider}></div>
                    </span>
                )}

                {loading ? (
                    <CustomSkeleton className={styles.sectionSkeleton}/>
                ) : (
                    product?.sizes && (
                        <>
                            <p className={styles.blockTitle}>Размеры</p>
                            <div className={styles.bar}>

                                {product?.sizes?.map((size, index) => (
                                    <button
                                        key={index}
                                        className={`${styles.sizeOption} ${
                                            selectedSize === size ? styles.active : ''
                                        }`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            <p className={styles.aboutSize}>Размер подобран на основе ваших параметров </p>
                            <div className={styles.contentDivider}></div>
                        </>
                    )
                )}
                {loading ? (
                    <CustomSkeleton className={styles.sectionSkeleton} />
                ) : (
                    product?.color_group?.length > 0 && (
                        <>
                            <div className={styles.colorHeader}>
                                <p className={styles.blockTitle}>Цвет</p>
                                <p className={styles.colorTitle}>{product?.color_name}</p>
                            </div>
                            <div className={styles.colorsContainer}>
                                {product.color_group.map((color: ProductColorVariant, index) => (
                                    <ColorSwatch
                                        key={index}
                                        className={styles.colorCircleWrapper}
                                        colorCode={color.color_code}
                                        isSelected={color.product_id === currentColorId}
                                        onClick={() => handleColorChange(color)}
                                    />
                                ))}
                            </div>
                            <div className={styles.contentDividerCompact}></div>

                        </>
                    )
                )}

                <p className={styles.blockTitle}>О товаре</p>
                <div className={styles.infoSection}>
                    {loading ? (
                        <>
                            <CustomSkeleton className={styles.detailRowSkeleton}/>
                            <CustomSkeleton className={styles.detailRowSkeleton}/>
                            <CustomSkeleton className={styles.detailRowSkeleton} />
                        </>
                    ) : (
                        product?.details && Object.entries(product.details).map(([label, value], index) => (
                            <div key={index} className={styles.infoRow}>
                                <span className={styles.infoLabel}>{label}</span>
                                <span className={styles.infoValue}>{String(value ?? '')}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <SaveToCollectionModal
                isOpen={isSaveModalOpen}
                onClose={handleCloseSaveModal}
                productId={product?.id}
                productName={product?.name}
                productInCollection={product?.is_contained_in_user_collections}
                onSaveSuccess={(isSaved) => {
                    setProduct(prev => ({
                        ...prev,
                        is_contained_in_user_collections: isSaved
                    }));
                }}
            />
            <Sidebar/>
        </div>
    );
};

export default ProductPage;

const ColorSwatch = ({ colorCode, isSelected, onClick, className = '' }: any) => {
    const colorCircleRef = useRef<any>(null);

    useEffect(() => {
        if (colorCircleRef.current) {
            colorCircleRef.current.style.backgroundColor = colorCode;
        }
    }, [colorCode]);

    return (
        <div className={className} onClick={onClick}>
            <div
                ref={colorCircleRef}
                className={`${styles.colorCircle} ${isSelected ? styles.selected : ''}`.trim()}
            />
        </div>
    );
};
