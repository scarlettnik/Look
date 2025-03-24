import React from 'react'
import Sidebar from "./Sidebar.jsx";
import styles from "./ui/shoppingCart.module.css"
import {Trash2, Share2, Bookmark} from "lucide-react";

const data =
{
    "id": 1,
    "telegram_id": 1671274831,
    "username": "scarlettnik",
    "first_name": "Софья",
    "last_name": "Марчук",
    "photo_url": "https://t.me/i/userpic/320/9zQoUimkDP8GJlxHvaSdoTyyBjp-d_3fHGjyYeoPoTI.svg",
    "parameters": [],
    "preferences": [],
    "collections": [
    "__FAVOURITE__"
],
    "cart": [
    {
        "quantity": 2,
        "product": {
            "name": "1 Шуба искусственная",
            "id": "ad27239f-7fbe-4697-b39d-1b7c0914f15d",
            "category": "шуба",
            "colors": [
                "синий",
                "красный",
                "черный"
            ],
            "description": "блаблабла",
            "brand": "гуччи",
            "sizes": [
                "46 RU / S",
                "48 RU / M",
                "50 RU / L",
                "52 RU / XL",
                "54 RU / 2XL"
            ],
            "image_urls": [
                "https://ir.ozone.ru/s3/multimedia-1-v/wc1000/7208546827.jpg",
                "https://ir.ozone.ru/s3/multimedia-1-2/wc1000/7208546798.jpg"
            ],
            "price": 1000,
            "new_price": 600
        }
    },{
            "quantity": 2,
            "product": {
                "name": "1 Шуба искусственная lkbyyjtg rrefgr b jxty, lkbyyjt yfpdfybt bgfbvgfvbgf fvkjvn ervfkj refrjkn ijenferfjernf ",
                "id": "ad27239f-7fbe-4697-b39d-1b7c0914f15d",
                "category": "шуба",
                "colors": [
                    "синий",
                    "красный",
                    "черный"
                ],
                "description": "блаблабла",
                "brand": "гуччи",
                "sizes": [
                    "46 RU / S",
                    "48 RU / M",
                    "50 RU / L",
                    "52 RU / XL",
                    "54 RU / 2XL"
                ],
                "image_urls": [
                    "https://ir.ozone.ru/s3/multimedia-1-v/wc1000/7208546827.jpg",
                    "https://ir.ozone.ru/s3/multimedia-1-2/wc1000/7208546798.jpg"
                ],
                "price": 4000
            }
        },{
            "quantity": 2,
            "product": {
                "name": "1 Шуба белка некоторый текст некоторый текст некоторый текст",
                "id": "ad27239f-7fbe-4697-b39d-1b7c0914f15d",
                "category": "шуба",
                "colors": [
                    "синий",
                    "красный",
                    "черный"
                ],
                "description": "блаблабла",
                "brand": "гуччи",
                "sizes": [
                    "46 RU / S",
                    "48 RU / M",
                    "50 RU / L",
                    "52 RU / XL",
                    "54 RU / 2XL"
                ],
                "image_urls": [
                    "https://ir.ozone.ru/s3/multimedia-1-v/wc1000/7208546827.jpg",
                    "https://ir.ozone.ru/s3/multimedia-1-2/wc1000/7208546798.jpg"
                ],
                "price": 1000
            }
        },{
            "quantity": 2,
            "product": {
                "name": "1 Шуба покемон",
                "id": "ad27239f-7fbe-4697-b39d-1b7c0914f15d",
                "category": "шуба",
                "colors": [
                    "синий",
                    "красный",
                    "черный"
                ],
                "description": "блаблабла",
                "brand": "гуччи",
                "sizes": [
                    "46 RU / S",
                    "48 RU / M",
                    "50 RU / L",
                    "52 RU / XL",
                    "54 RU / 2XL"
                ],
                "image_urls": [
                    "https://ir.ozone.ru/s3/multimedia-1-v/wc1000/7208546827.jpg",
                    "https://ir.ozone.ru/s3/multimedia-1-2/wc1000/7208546798.jpg"
                ],
                "price": 1000
            }
        },{
            "quantity": 2,
            "product": {
                "name": "1 Шуба искусственная",
                "id": "ad27239f-7fbe-4697-b39d-1b7c0914f15d",
                "category": "шуба",
                "colors": [
                    "синий",
                    "красный",
                    "черный"
                ],
                "description": "блаблабла",
                "brand": "гуччи",
                "sizes": [
                    "46 RU / S",
                    "48 RU / M",
                    "50 RU / L",
                    "52 RU / XL",
                    "54 RU / 2XL"
                ],
                "image_urls": [
                    "https://ir.ozone.ru/s3/multimedia-1-v/wc1000/7208546827.jpg",
                    "https://ir.ozone.ru/s3/multimedia-1-2/wc1000/7208546798.jpg"
                ],
                "price": 1000
            }
        },{
            "quantity": 2,
            "product": {
                "name": "1 Шуба искусственная",
                "id": "ad27239f-7fbe-4697-b39d-1b7c0914f15d",
                "category": "шуба",
                "colors": [
                    "синий",
                    "красный",
                    "черный"
                ],
                "description": "блаблабла",
                "brand": "гуччи",
                "sizes": [
                    "46 RU / S",
                    "48 RU / M",
                    "50 RU / L",
                    "52 RU / XL",
                    "54 RU / 2XL"
                ],
                "image_urls": [
                    "https://ir.ozone.ru/s3/multimedia-1-v/wc1000/7208546827.jpg",
                    "https://ir.ozone.ru/s3/multimedia-1-2/wc1000/7208546798.jpg"
                ],
                "price": 1000
            }
        },
]

}

const ShoppingCard = () => {
    // const { data, loading, error } = useAuth();
    //
    // if (loading) return <div>Loading...</div>;
    // if (error) return <div>Error: {error}</div>;

    console.log(data?.cart)

    return (
        <>
            <h1>Корзина</h1>
            <div className={styles.container}>
                {data ? (<div>{data?.cart?.map((item) => (
                        <div key={item?.id} className={styles.cartItem}>
                            <img
                                src={item.product.image_urls[0]}
                                alt={item.name}
                                className={styles.productImage}
                            />
                            <div className={styles.itemDetails}>
                                <div className={styles.priceContainer}>
                                    {item.product.new_price ? (
                                        <>
                                            <div className={styles.newPrice}>
                                                {item.product.new_price * item.quantity} ₽
                                            </div>
                                            <div className={styles.oldPrice}>
                                                {item.product.price * item.quantity} ₽
                                            </div>

                                        </>
                                    ) : (
                                        <div className={styles.currentPrice}>
                                            {item.product.price * item.quantity} ₽
                                        </div>
                                    )}
                                </div>
                                <div className={styles.productName}>{item.product.brand} | {item.product.name}</div>
                                <div className={styles.brand}></div>


                                <div className={styles.attributes}>
                                    {[item.product.sizes?.[0], item.product.colors?.[0]]
                                        .filter(Boolean)
                                        .join(', ')
                                    }
                                </div>


                                <div className={styles.actionContainer}>
                                    <div className={styles.quantityControls}>
                                        <button className={styles.but}>-</button>
                                        <span className={styles.quantity}>{item.quantity}</span>
                                        <button className={styles.but}>+</button>
                                    </div>

                                    <div className={styles.del}><Trash2 style={{size:'3vw'}}/></div>
                                    <div className={styles.share}><Share2  style={{size:'3vw'}}/></div>
                                    <div className={styles.bookmark}><Bookmark  style={{size:'3vw'}}/></div>


                                    <button className={styles.orderButton}>
                                        Заказать
                                    </button>
                                </div>
                            </div>
                        </div>))}</div>
                ) : (
                    <div>Loading cart...</div>
                )}
            </div>
            <Sidebar/>
        </>

    )
}

export default ShoppingCard;
