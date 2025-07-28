export const filterProducts = (products, filters) => {
    if (!products || !Array.isArray(products)) return [];

    return products.filter(product => {
        // Фильтрация по размеру
        if (filters.sizes?.length > 0) {
            const hasSize = filters.sizes.some(size =>
                product.sizes.includes(size) ||
                (size === 'NO SIZE' && product.sizes.includes('один размер'))
            );
            if (!hasSize) return false;
        }

        // Фильтрация по бренду
        if (filters.brands?.length > 0) {
            if (!filters.brands.includes(product.brand)) return false;
        }

        // Фильтрация по цене
        if (filters.price) {
            const price = product.discount_price || product.price;
            if (filters.price.min && price < filters.price.min) return false;
            if (filters.price.max && price > filters.price.max) return false;
        }

        // Фильтрация по типу (категории)
        if (filters.types?.length > 0) {
            const categoryPath = product.category.split('/');
            const hasType = filters.types.some(type =>
                categoryPath.includes(type.toLowerCase())
            );
            if (!hasType) return false;
        }

        return true;
    });
};

export const getProductTypes = (products) => {
    const types = new Set();
    products?.forEach(product => {
        const [mainType] = product.category.split('/');
        if (mainType) types.add(mainType.charAt(0).toUpperCase() + mainType.slice(1));
    });
    return Array.from(types);
};