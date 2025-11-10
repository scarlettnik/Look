import { useEffect, useRef, useState } from 'react';
import {
    CreditCardIcon,
    HelpCircleIcon,
    PercentIcon,
    ShoppingBagIcon,
    Trash2Icon,
    UserIcon,
} from 'lucide-react';

import { useAuth } from '../../app/providers/storeContext';
import { SUPPORT_URL } from '../../constants';

import Sidebar from '../navigation/sidebar';
import styles from '../ui/profile/profile.module.css';

import DeleteProfileButtons from './deleteProfileButtons';
import ProfileMeasurementsModal from './profileMeasurementsModal';
import ProfileMenuItem, { ProfileMenuItemConfig } from './profileMenuItem';
import ProfileSupportButtons from './profileSupportButtons';
import UserInfo from './userInfo';

const MENU_ITEMS: ProfileMenuItemConfig[] = [
    { label: 'Мои параметры', icon: UserIcon },
    { label: 'Заказы', icon: ShoppingBagIcon, dev: true },
    { label: 'Способ оплаты', icon: CreditCardIcon, dev: true },
    { label: 'Промокоды', icon: PercentIcon, dev: true },
    { label: 'Удаление аккаунта', icon: Trash2Icon, delete: true },
    { label: 'Поддержка', icon: HelpCircleIcon, support: true },
];

export default function ProfilePage() {
    const { user } = useAuth();
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [activeDevItem, setActiveDevItem] = useState<number | null>(null);
    const [showMeasurements, setShowMeasurements] = useState(false);
    const [showSupportButton, setShowSupportButton] = useState(false);
    const [showDeleteProfileButton, setShowDeleteProfileButton] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    const handleMenuItemClick = (item: ProfileMenuItemConfig, index: number) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
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

        if (item.label === 'Мои параметры') {
            setShowMeasurements(true);
        }

        if (item.dev) {
            setActiveDevItem(index);
            setShowSupportButton(false);
            setShowDeleteProfileButton(false);
            timeoutRef.current = setTimeout(() => {
                setActiveDevItem(null);
            }, 3000);
            return;
        }

        setActiveDevItem(null);
        setShowSupportButton(false);
    };

    return (
        <div className={styles.page}>
            <UserInfo
                photoUrl={user?.photo_url}
                firstName={user?.first_name}
                lastName={user?.last_name}
            />

            <div className={styles.menuContainer}>
                {MENU_ITEMS.map((item, index) => (
                    <ProfileMenuItem
                        key={item.label}
                        item={item}
                        index={index}
                        activeIndex={activeDevItem}
                        onClick={handleMenuItemClick}
                    />
                ))}
            </div>

            <Sidebar />

            {showSupportButton && (
                <ProfileSupportButtons
                    onSupportClick={() => window.open(SUPPORT_URL, '_blank')}
                />
            )}

            {showDeleteProfileButton && (
                <DeleteProfileButtons onCancel={() => setShowDeleteProfileButton(false)} />
            )}

            <ProfileMeasurementsModal
                isOpen={showMeasurements}
                onClose={() => setShowMeasurements(false)}
                onSuccess={() => {
                    setShowMeasurements(false);
                    setShowSuccessMessage(true);
                    setTimeout(() => setShowSuccessMessage(false), 3000);
                }}
            />

            {showSuccessMessage && (
                <div className={styles.successMessage}>Изменения успешно применены!</div>
            )}
        </div>
    );
}
