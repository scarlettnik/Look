import { useEffect, useState } from "react";
import stylesM from "../../ui/catalog/filters/filterList.module.css";
import useIsKeyboardOpen from "../../../hooks/useIsKeyboardOpen";

export const FiltersModal = ({ title, onClose, onApply, children, applyDisabled = false }: any) => {
    const isKeyboardOpen = useIsKeyboardOpen();
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
            <div className={`${stylesM.modalContent} ${isClosing ? stylesM.modalContentClosing : ''}`.trim()}>
                <div className={stylesM.modalHeader}>
                    <p className={stylesM.label}>{title}</p>
                    <button className={stylesM.cancelButton} onClick={handleClose}>
                        Отмена
                    </button>
                </div>
                <div className={stylesM.modalBody}>{children}</div>
                {!isKeyboardOpen && <button
                    className={stylesM.applyButton}
                    onClick={onApply}
                    disabled={applyDisabled}
                >
                    Показать
                </button>
                }
            </div>

    );
};
