import type { LucideIcon } from 'lucide-react';

import styles from '../ui/profile/profile.module.css';

export type ProfileMenuItemConfig = {
    label: string;
    icon: LucideIcon;
    dev?: boolean;
    delete?: boolean;
    support?: boolean;
};

type ProfileMenuItemProps = {
    item: ProfileMenuItemConfig;
    index: number;
    activeIndex: number | null;
    onClick: (item: ProfileMenuItemConfig, index: number) => void;
};

const ProfileMenuItem = ({
    item,
    index,
    activeIndex,
    onClick,
}: ProfileMenuItemProps) => {
    const Icon = item.icon;
    const isActive = activeIndex === index;

    return (
        <div className={styles.menuItem} onClick={() => onClick(item, index)}>
            <Icon size={20} className={styles.menuIcon} />
            <span className={styles.menuLabel}>{item.label}</span>
            {item.dev && isActive && (
                <div className={styles.devPanel}>В разработке</div>
            )}
        </div>
    );
};

export default ProfileMenuItem;
