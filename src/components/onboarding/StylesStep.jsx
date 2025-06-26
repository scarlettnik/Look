import React from 'react';
import styles from '../ui/OnboardingModal.module.css';

const ClothStyles = [
    { id: 1, name: "Классический" },
    { id: 2, name: "Спортивный" },
    { id: 3, name: "Повседневный" },
    { id: 4, name: "Деловой" },
    { id: 5, name: "Уличный" },
    { id: 6, name: "Вечерний" },
];

const StylesStep = ({ selectedStyles, onUpdate, onNext, onSkip }) => {
    const handleStyleToggle = (styleId) => {
        const newStyles = selectedStyles.includes(styleId)
            ? selectedStyles.filter(id => id !== styleId)
            : [...selectedStyles, styleId];
        onUpdate({ styles: newStyles }); // Исправлено: передаем обновленные стили
    };

    return (
        <div className="onboarding-step">
            <h2 className="step-title">Выберите любимые стили</h2>
            <p className="step-description">Отметьте то, что вам нравится</p>

            <div className="style-grid">
                {ClothStyles.map(style => (
                    <div
                        key={style.id}
                        className={`style-card ${selectedStyles.includes(style.id) ? 'selected' : ''}`}
                        onClick={() => handleStyleToggle(style.id)}
                    >
                        <div className="style-checkbox">
                            {selectedStyles.includes(style.id) && "✓"}
                        </div>
                        {style.name}
                    </div>
                ))}
            </div>

            <div className="onboarding-actions">
                <button
                    className="onboarding-button primary"
                    onClick={onNext}
                    disabled={selectedStyles.length === 0} // Кнопка "Вперед" неактивна, если ничего не выбрано
                >
                    Вперед
                </button>
                <button
                    className="onboarding-button secondary"
                    onClick={onSkip} // Пропуск работает независимо от выбора стилей
                >
                    Пропустить
                </button>
            </div>
        </div>
    );
};

export default StylesStep;