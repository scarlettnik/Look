import React from "react";
import stylesM from "../ui/filterList.module.css";

export const FiltersModal = ({ title, onClose, onApply, children, applyDisabled = false }) => {
    return (

            <div className={stylesM.modalContent}>
                <div className={stylesM.modalHeader}>
                    <p className={stylesM.label}>{title}</p>
                    <button className={stylesM.cancelButton} onClick={onClose}>
                        Отмена
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

    );
};
