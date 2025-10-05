import styles from "../../ui/profile.module.css";
import React, { useState } from "react";

const ParamControl = ({ label, value, onChange, min = 0, max = 200 }) => {
    // State to manage whether the input field is currently being edited
    const [isEditing, setIsEditing] = useState(false);
    // State to hold the temporary value during editing
    const [inputValue, setInputValue] = useState(value.toString());

    // --- Button Handlers ---
    const handleIncrement = () => {
        if (value < max) onChange(value + 1);
    };

    const handleDecrement = () => {
        if (value > min) onChange(value - 1);
    };

    // --- Input Handlers ---

    // When the user clicks the value area, enable editing mode
    const handleValueClick = () => {
        setInputValue(value.toString()); // Ensure input reflects current prop value
        setIsEditing(true);
    };

    // Update the temporary input state as the user types
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    // When the user leaves the input field (onBlur) or presses Enter (onKeyDown)
    const handleInputConfirm = () => {
        // 1. Convert the input value to a number
        let numericValue = parseInt(inputValue, 10);

        // 2. Validate the number against min/max and ensure it's a valid number
        if (isNaN(numericValue)) {
            // If input is not a number, revert to the current value and stop editing
            numericValue = value;
        } else {
            // Clamp the value within the defined range
            numericValue = Math.max(min, Math.min(max, numericValue));
        }

        // 3. Update the value via the onChange prop
        if (numericValue !== value) {
            onChange(numericValue);
        }

        // 4. Exit editing mode
        setIsEditing(false);
    };

    // Handle 'Enter' key press to confirm input
    const handleInputKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleInputConfirm();
        }
    };

    // --- Render Logic ---

    const renderValue = () => {
        if (isEditing) {
            return (
                <input
                    type="number"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm} // Commit value when input loses focus
                    onKeyDown={handleInputKeyDown} // Commit value on 'Enter'
                    className={styles.valueInput} // You'll likely want to style this
                    autoFocus // Focus the input immediately upon rendering
                    min={min}
                    max={max}
                />
            );
        } else {
            return (
                <span onClick={handleValueClick} style={{ cursor: 'pointer' }}>
                    {value}
                </span>
            );
        }
    }

    return (
        <div className={styles.paramControl}>
            <div className={styles.inputGroup}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <button
                        className={styles.decrementButton}
                        onClick={handleDecrement}
                        disabled={value <= min}
                    >
                        -
                    </button>

                    <div className={styles.valueContainer}>
                        {renderValue()} {/* Use the dynamic renderer here */}
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

export default ParamControl;