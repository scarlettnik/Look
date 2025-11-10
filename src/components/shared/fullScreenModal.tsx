import { useEffect, useState } from "react";
import stylesM from "../ui/shared/fullScreenModal.module.css";
import { UI_ICON_ASSETS } from "../../lib/assets";

export const FullScreenModal = ({ title, onClose, onApply, children, applyDisabled = false }: any) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        setIsClosing(false);
    }, [title]);

    const handleClose = () => {
        setIsClosing(true);
        window.setTimeout(() => {
            onClose();
        }, 280);
    };

    return (
        <div className={`${stylesM.modalOverlay} ${isClosing ? stylesM.modalOverlayClosing : ''}`.trim()}>
            <div className={`${stylesM.modalContent} ${isClosing ? stylesM.modalContentClosing : ''}`.trim()}>
                <div className={stylesM.modalHeader}>
                    <p className={stylesM.label}>{title}</p>
                    <button className={stylesM.closeButton} onClick={handleClose}>
                        <img src={UI_ICON_ASSETS.close} alt="Close"/>
                    </button>
                </div>
                <div className={stylesM.modalBody}>{children}</div>
                <button
                    className={stylesM.applyButton}
                    onClick={onApply}
                    disabled={applyDisabled}
                >
                    Показать
                </button>
            </div>
        </div>
    );
};
