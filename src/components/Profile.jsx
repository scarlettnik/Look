import {
    UserIcon,
    ShoppingBagIcon,
    CreditCardIcon,
    PercentIcon,
    Trash2Icon,
    HelpCircleIcon,
} from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import { useAuth } from "../provider/AuthProvider.jsx";
import React, { useState, useEffect, useRef } from "react";
import FullScreenButton from "./FullScrinButton.jsx";
import styles from "./ui/profile.module.css";
import ButtonWrapper from "./ButtonWrapper.jsx";


const SizeGrid = ({ params, updateParam }) => {
    const handleChange = (field, value) => {
        updateParam(field, value);
    };

    return (
        <div className={styles.sizesGrid}>
            {["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"].map(size => (
                <div
                    key={size}
                    className={`${styles.sizeBox} ${params.size === size ? styles.selectedSize : ''}`}
                    onClick={() => handleChange("size", size)}
                >
                    {size}
                    <span className={styles.subText}>38-40</span>
                </div>
            ))}
        </div>
    );
};

const FitOptions = ({ params, updateParam }) => (
    <div>

        <div className={styles.fitOptionsWrapper}>
            <div className={styles.fitOptions}>
                <FitOption
                    id="tight"
                    value="tight"
                    label="Облегающую"
                    currentValue={params.fit}
                    onChange={updateParam}
                />
                <FitOption
                    id="true"
                    value="true"
                    label="В размер"
                    currentValue={params.fit}
                    onChange={updateParam}
                />
                <FitOption
                    id="oversized"
                    value="oversized"
                    label="Оверсайз"
                    currentValue={params.fit}
                    onChange={updateParam}
                />
            </div>
            <div className={styles.underline}></div>
            <div className={styles.triangle} data-fit={params.fit}></div>
        </div>
    </div>
);

const FitOption = ({ id, value, label, currentValue, onChange }) => (
    <>
        <input
            type="radio"
            id={id}
            name="fit"
            value={value}
            checked={currentValue === value}
            onChange={(e) => onChange(e)}
        />
        <label htmlFor={id} className={currentValue === value ? styles.active : ""}>
            {label}
        </label>
    </>
);

const ParamControl = ({ label, value, onChange, min = 0, max = 200 }) => {
    const handleIncrement = () => {
        if (value < max) onChange(value + 1);
    };

    const handleDecrement = () => {
        if (value > min) onChange(value - 1);
    };

    return (
        <div className={styles.paramControl}>
            <div className={styles.inputGroup}>
                <div style={{position: 'relative', display: 'inline-block'}}>
                    <button
                        className={styles.decrementButton}
                        onClick={handleDecrement}
                        disabled={value <= min}
                    >
                        -
                    </button>

                    <div className={styles.valueContainer}>
                        <span>{value}</span>
                        <label>{label}</label>
                    </div>

                    <button
                        className={styles.incrementButton}
                        onClick={handleIncrement}
                        disabled={value >= max}
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
};

const ParamsTab = ({ params, updateParam }) => {
    const handleChange = (field, value) => {
        updateParam(field, value);
    };



    return (
        <div className={styles.paramsForm}>
           <div className={styles.paramsInputGroup}>
               <ParamControl
                   label="Объем груди"
                   value={params.bust}
                   onChange={(value) => handleChange("bust", value)}
                   min={40}
                   max={200}
               />
               <ParamControl
                   label="Объем талии"
                   value={params.waist}
                   onChange={(value) => handleChange("waist", value)}
                   min={40}
                   max={200}
               />

               <ParamControl
                   label="Объем бедер"
                   value={params.hip}
                   onChange={(value) => handleChange("hip", value)}
                   min={40}
                   max={200}
               />
           </div>


        </div>
    );
};

const ProfileMeasurementsModal = ({ isOpen, onClose }) => {
    const { data } = useAuth();
    const [activeTab, setActiveTab] = useState("size");
    const [params, setParams] = useState({
        size: "M",
        bust: 40,
        waist: 63,
        hip: 92,
        fit: "true",
    });

    const updateParam = (field, value) => {
        setParams(prev => ({ ...prev, [field]: value }));
    };
    const handleRadioChange = (event) => {
        updateParam("fit", event.target.value);
    };
    console.log(params)
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <UserInfo
                    photoUrl={data?.photo_url}
                    firstName={data?.first_name}
                    lastName={data?.last_name}
                />

                <p className={styles.manuLabel} style={{paddingLeft: '2%'}}>
                    Мои параметры
                </p>

                <div className={styles.paramsBlock}>
                    <div className={styles.tabs}>
                        <TabButton
                            active={activeTab === "size"}
                            onClick={() => setActiveTab("size")}
                            label="Размер"
                        />
                        <TabButton
                            active={activeTab === "params"}
                            onClick={() => setActiveTab("params")}
                            label="Параметры"
                        />
                    </div>
                    <div className={styles.tabContent}>
                        {activeTab === "size" && (
                            <>
                                <SizeGrid
                                    params={params}
                                    updateParam={updateParam}
                                />
                            </>
                        )}

                        {activeTab === "params" && (
                            <ParamsTab
                                params={params}
                                updateParam={updateParam}
                            />
                        )}

                        <div className={styles.fitOptionsWrapper}>
                            <p>Ношу одежду</p>
                            <FitOptions params={params} updateParam={handleRadioChange}/>
                        </div>
                    </div>
                </div>

                <ButtonWrapper>
                    <FullScreenButton color='var(--light-gray)' textColor='var(--black)'>
                        Изменить значения
                    </FullScreenButton>
                    <FullScreenButton onClick={onClose}>
                        Отменить
                    </FullScreenButton>
                </ButtonWrapper>
            </div>
        </div>
    );
};


const TabButton = ({active, onClick, label }) => (
    <button
        className={active ? styles.active : ""}
        onClick={onClick}
    >
        {label}
    </button>
);


const menuItems = [
    { label: "Мои параметры", icon: UserIcon },
    { label: "Заказы", icon: ShoppingBagIcon, dev: true },
    { label: "Способ оплаты", icon: CreditCardIcon, dev: true },
    { label: "Промокоды", icon: PercentIcon, dev: true },
    { label: "Удаление аккаунта", icon: Trash2Icon, delete: true },
    { label: "Поддержка", icon: HelpCircleIcon, support: true },
];

const UserInfo = ({ photoUrl, firstName, lastName }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [showSkeleton, setShowSkeleton] = useState(true);

    useEffect(() => {
        const img = new Image();
        img.src = photoUrl;
        img.onload = () => {
            setImageLoaded(true);
        };
        if (imageLoaded) setShowSkeleton(false);
    }, [photoUrl, imageLoaded]);

    return (
        <div className={styles.userInfo}>
            <div className={styles.avatar}>
                {showSkeleton && (
                    <div className={styles.skeleton} />
                )}

                <img
                    src={photoUrl}
                    className={`${styles.avatarImage} ${showSkeleton ? styles.hidden : ''}`}
                    alt="User avatar"
                    onLoad={() => setImageLoaded(true)}
                />
            </div>
            <div className={styles.userName}>
                {firstName || lastName ? (
                    <div>
                        {firstName} {lastName}
                    </div>
                ) : (
                    <p>User</p>
                )}
            </div>
        </div>
    );
};

const MenuItem = ({ item, index, activeIndex, onClick }) => {
    const Icon = item.icon;
    const isActive = activeIndex === index;

    return (
        <div
            className={styles.menuItem}
            onClick={() => onClick(item, index)}
        >
            <Icon size={20} className={styles.menuIcon} />
            <span className={styles.menuLabel}>{item.label}</span>
            {item.dev && isActive && (
                <div className={styles.devPanel}>В разработке</div>
            )}
        </div>
    );
};

const SupportButtons = ({ onSupportClick }) => (
    <ButtonWrapper>
        <FullScreenButton
            color="var(--light-gray)"
            textColor="var(--black)"
            onClick={onSupportClick}
        >
            Связаться с поддержкой в Telegram
        </FullScreenButton>
    </ButtonWrapper>
);

const DeleteProfileButtons = ({ onDelete, onCancel }) => (
    <ButtonWrapper>
        <FullScreenButton
            color="var(--light-gray)"
            textColor="var(--black)"
            onClick={onDelete}
        >
            Удалить аккаунт
        </FullScreenButton>
        <FullScreenButton onClick={onCancel}>
            Отменить
        </FullScreenButton>
    </ButtonWrapper>
);

export default function ProfilePage() {
    const { data, loading, error } = useAuth();
    const [activeDevItem, setActiveDevItem] = useState(null);
    const [showSupportButton, setShowSupportButton] = useState(false);
    const [showDeleteProfileButton, setShowDeleteProfileButton] = useState(false);
    const timeoutRef = useRef(null);
    const [showMeasurements, setShowMeasurements] = useState(false);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleMenuItemClick = (item, index) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (item.support) {
            setShowSupportButton(true);
            setShowDeleteProfileButton(false);
            setActiveDevItem(null);
            return;
        }

        if (item.delete) {
            setShowDeleteProfileButton(true);
            setShowSupportButton(false);
            setActiveDevItem(null);
            return;
        }
        if (item.label === "Мои параметры") {
            setShowMeasurements(true);
        }
        if (item.dev) {
            setActiveDevItem(index);
            setShowSupportButton(false);
            setShowDeleteProfileButton(false);

            timeoutRef.current = setTimeout(() => {
                setActiveDevItem(null);
            }, 3000);
        } else {
            setActiveDevItem(null);
            setShowSupportButton(false);
        }
    };

    const handleSupportButtonClick = () => {
        window.open("https://t.me/scarlettnik", "_blank");
    };

    const handleDeleteBackScape = () => {
        setShowDeleteProfileButton(false);
    };

    if (error) return <div>Error: {error}</div>;

    return (
        <div className={styles.page}>
            <UserInfo
                photoUrl={data?.photo_url}
                firstName={data?.first_name}
                lastName={data?.last_name}
            />

            <div className={styles.menuContainer}>
                {menuItems.map((item, index) => (
                    <MenuItem
                        key={index}
                        item={item}
                        index={index}
                        activeIndex={activeDevItem}
                        onClick={handleMenuItemClick}
                    />
                ))}
            </div>

            <Sidebar />

            {showSupportButton && (
                <SupportButtons onSupportClick={handleSupportButtonClick} />
            )}

            {showDeleteProfileButton && (
                <DeleteProfileButtons
                    onDelete={() => console.log("Удаление")}
                    onCancel={handleDeleteBackScape}
                />
            )}
            {showMeasurements && (
                <ProfileMeasurementsModal
                    isOpen={showMeasurements}
                    onClose={() => setShowMeasurements(false)}
                    user={{
                        firstName: data?.first_name,
                        lastName: data?.last_name,
                        photoUrl: data?.photo_url
                    }}
                />
            )}
        </div>
    );
}