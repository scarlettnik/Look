import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type TouchEvent,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { NAVIGATION_ICON_ASSETS, UI_ICON_ASSETS } from '../../../lib/assets';
import type { ProductCard, ProductColorVariant } from '../../../types/domain';

import SaveToCollectionModal from '../../collections/saveToCollectionsModal';
import Sidebar from '../../navigation/sidebar';
import CustomSkeleton from '../../shared/customSkeleton';
import FullScreenButton from '../../shared/fullScreenButton';
import styles from '../../ui/catalog/product/productPage.module.css';

import { useProductDetails } from './useProductDetails';

type ProductSize = NonNullable<ProductCard['sizes']>[number];

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        product,
        loading,
        error,
        currentColorId,
        handleColorChange,
        setProductSavedState,
    } = useProductDetails(id);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [dragX, setDragX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const touchStartX = useRef(0);
    const sliderTrackRef = useRef<HTMLDivElement | null>(null);

    const imageUrls = product?.image_urls ?? [];
    const descriptionLines = product?.description?.split('\n') ?? [];

    useEffect(() => {
        setCurrentIndex(0);
        setSelectedSize(null);
        setIsDescriptionExpanded(false);
    }, [product?.id]);

    useEffect(() => {
        if (!sliderTrackRef.current) {
            return;
        }

        sliderTrackRef.current.style.transform = `translateX(calc(${-currentIndex * 100}% + ${dragX}px))`;
        sliderTrackRef.current.style.transition = isDragging
            ? 'none'
            : 'transform 0.3s ease';
    }, [currentIndex, dragX, isDragging]);

    const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
        touchStartX.current = event.touches[0]?.clientX ?? 0;
        setIsDragging(true);
    };

    const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
        const moveX = (event.touches[0]?.clientX ?? 0) - touchStartX.current;
        setDragX(moveX);
    };

    const handleTouchEnd = () => {
        if (dragX > 80 && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else if (dragX < -80 && currentIndex < imageUrls.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }

        setDragX(0);
        setIsDragging(false);
    };

    const openSellerPage = useCallback(() => {
        const productUrl = product?.original_url;

        if (!productUrl) {
            return;
        }

        if (window.Telegram?.WebApp?.openLink) {
            window.Telegram.WebApp.openLink(productUrl);
            return;
        }

        window.open(productUrl, '_blank', 'noopener,noreferrer');
    }, [product?.original_url]);

    const handleColorSelect = useCallback((color: ProductColorVariant) => {
        void handleColorChange(color);
    }, [handleColorChange]);

    if (error) {
        return <div className={styles.error}>Ошибка загрузки товара: {error}</div>;
    }

    return (
        <div className={styles.container}>
            <div
                className={styles.slider}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <button
                    type="button"
                    className={styles.backButton}
                    onClick={() => navigate(-1)}
                >
                    <img className={styles.backIcon} src={UI_ICON_ASSETS.arrowLeft} alt="Назад" />
                </button>

                {loading ? (
                    <CustomSkeleton className={styles.fullPageSkeleton} />
                ) : (
                    <>
                        <div
                            ref={sliderTrackRef}
                            className={styles.sliderInner}
                        >
                            {imageUrls.map((src, index) => (
                                <img
                                    key={`${src}-${index}`}
                                    src={src}
                                    alt={`${product?.name ?? 'Product'} ${index + 1}`}
                                    className={styles.image}
                                />
                            ))}
                        </div>
                        <div className={styles.progressDots}>
                            {imageUrls.map((src, index) => (
                                <span
                                    key={`${src}-${index}`}
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
                        <CustomSkeleton className={styles.textLineSecondarySkeleton} />
                        <CustomSkeleton className={styles.priceLineSkeleton} />
                        <FullScreenButton>
                            <p className={styles.sellerButtonContent}>
                                На сайт продавца <img src={UI_ICON_ASSETS.shoppingBag} alt="Корзина" />
                            </p>
                        </FullScreenButton>
                    </>
                ) : (
                    <>
                        <p className={styles.title}>{product?.name}</p>
                        <p className={styles.brand}>{product?.brand}</p>
                        <div className={styles.header}>
                            <p className={styles.price}>
                                {product?.discount_price && product.discount_price !== product.price ? (
                                    <>
                                        <span className={styles.oldPrice}>
                                            {product.price} ₽
                                        </span>
                                        {product.discount_price} ₽
                                    </>
                                ) : (
                                    product?.price != null ? `${product.price} ₽` : ''
                                )}
                            </p>
                            <button
                                type="button"
                                className={styles.iconButton}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setIsSaveModalOpen(true);
                                }}
                            >
                                <img
                                    className={styles.saveIcon}
                                    src={product?.is_contained_in_user_collections
                                        ? NAVIGATION_ICON_ASSETS.active.save
                                        : NAVIGATION_ICON_ASSETS.inactive.save}
                                    alt={product?.is_contained_in_user_collections ? 'Сохранено' : 'Сохранить'}
                                />
                            </button>
                        </div>
                        <FullScreenButton onClick={openSellerPage}>
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
                    <div className={styles.description}>
                        <div
                            className={`${styles.description} ${!isDescriptionExpanded ? styles.clamped : ''}`}
                        >
                            {descriptionLines.map((line, index) => (
                                <p key={`${line}-${index}`}>{line}</p>
                            ))}
                        </div>

                        {descriptionLines.length > 4 && (
                            <button
                                type="button"
                                onClick={() => setIsDescriptionExpanded((current) => !current)}
                                className={styles.readMoreButton}
                            >
                                {isDescriptionExpanded ? 'Скрыть' : 'Подробнее'}
                            </button>
                        )}
                        <div className={styles.descriptionDivider} />
                    </div>
                )}

                {loading ? (
                    <CustomSkeleton className={styles.sectionSkeleton} />
                ) : (
                    product?.sizes && (
                        <>
                            <p className={styles.blockTitle}>Размеры</p>
                            <div className={styles.bar}>
                                {product.sizes.map((size, index) => (
                                    <button
                                        key={`${String(size)}-${index}`}
                                        type="button"
                                        className={`${styles.sizeOption} ${
                                            selectedSize === size ? styles.active : ''
                                        }`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            <p className={styles.aboutSize}>Размер подобран на основе ваших параметров</p>
                            <div className={styles.contentDivider} />
                        </>
                    )
                )}

                {loading ? (
                    <CustomSkeleton className={styles.sectionSkeleton} />
                ) : (
                    product?.color_group && product.color_group.length > 0 && (
                        <>
                            <div className={styles.colorHeader}>
                                <p className={styles.blockTitle}>Цвет</p>
                                <p className={styles.colorTitle}>{product.color_name}</p>
                            </div>
                            <div className={styles.colorsContainer}>
                                {product.color_group.map((color, index) => (
                                    <ColorSwatch
                                        key={`${String(color.product_id)}-${index}`}
                                        className={styles.colorCircleWrapper}
                                        colorCode={color.color_code}
                                        isSelected={
                                            color.product_id != null
                                            && currentColorId != null
                                            && String(color.product_id) === String(currentColorId)
                                        }
                                        onClick={() => handleColorSelect(color)}
                                    />
                                ))}
                            </div>
                            <div className={styles.contentDividerCompact} />
                        </>
                    )
                )}

                <p className={styles.blockTitle}>О товаре</p>
                <div className={styles.infoSection}>
                    {loading ? (
                        <>
                            <CustomSkeleton className={styles.detailRowSkeleton} />
                            <CustomSkeleton className={styles.detailRowSkeleton} />
                            <CustomSkeleton className={styles.detailRowSkeleton} />
                        </>
                    ) : (
                        product?.details && Object.entries(product.details).map(([label, value]) => (
                            <div key={label} className={styles.infoRow}>
                                <span className={styles.infoLabel}>{label}</span>
                                <span className={styles.infoValue}>{String(value ?? '')}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <SaveToCollectionModal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                productId={product?.id}
                productName={product?.name}
                productInCollection={product?.is_contained_in_user_collections}
                onSaveSuccess={setProductSavedState}
            />
            <Sidebar />
        </div>
    );
};

export default ProductPage;

type ColorSwatchProps = {
    colorCode?: string;
    isSelected: boolean;
    onClick: () => void;
    className?: string;
};

const ColorSwatch = ({
    colorCode,
    isSelected,
    onClick,
    className = '',
}: ColorSwatchProps) => (
    <button
        type="button"
        className={className}
        onClick={onClick}
        aria-label="Выбрать цвет"
    >
        <span
            className={`${styles.colorCircle} ${isSelected ? styles.selected : ''}`.trim()}
            style={{ backgroundColor: colorCode || 'transparent' }}
        />
    </button>
);
