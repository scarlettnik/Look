import { useCallback, useEffect, useState } from 'react';

import { apiGetJson } from '../../../lib/apiClient';
import type {
    EntityId,
    ProductCard,
    ProductColorVariant,
} from '../../../types/domain';

const hasSameEntityId = (
    firstId?: EntityId | null,
    secondId?: EntityId | null,
) => (
    firstId != null
    && secondId != null
    && String(firstId) === String(secondId)
);

export const useProductDetails = (routeProductId?: EntityId) => {
    const [product, setProduct] = useState<ProductCard | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentColorId, setCurrentColorId] = useState<EntityId | undefined>(
        routeProductId,
    );
    const [isTransitioning, setIsTransitioning] = useState(false);

    const fetchProduct = useCallback(async (productId: EntityId) => {
        try {
            setLoading(true);
            return await apiGetJson<ProductCard>(`/v1/catalog/product/${productId}`);
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    }, []);

    const loadProduct = useCallback(async (productId: EntityId) => {
        try {
            setLoading(true);
            setError(null);

            const data = await fetchProduct(productId);
            setProduct(data);
            return true;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to load product');
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchProduct]);

    useEffect(() => {
        if (routeProductId == null) {
            return;
        }

        setCurrentColorId(routeProductId);
        void loadProduct(routeProductId);
    }, [routeProductId, loadProduct]);

    const handleColorChange = useCallback(async (color: ProductColorVariant) => {
        if (
            color.product_id == null
            || hasSameEntityId(color.product_id, currentColorId)
            || isTransitioning
        ) {
            return;
        }

        try {
            setIsTransitioning(true);
            const didLoadProduct = await loadProduct(color.product_id);

            if (didLoadProduct) {
                setCurrentColorId(color.product_id);
            }
        } catch (error) {
            console.error('Error changing color:', error);
        } finally {
            setIsTransitioning(false);
        }
    }, [currentColorId, isTransitioning, loadProduct]);

    const setProductSavedState = useCallback((isSaved: boolean) => {
        setProduct((currentProduct) => (
            currentProduct
                ? {
                    ...currentProduct,
                    is_contained_in_user_collections: isSaved,
                }
                : currentProduct
        ));
    }, []);

    return {
        product,
        loading,
        error,
        currentColorId,
        handleColorChange,
        setProductSavedState,
    };
};
