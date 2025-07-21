import ButtonWrapper from "./utils/ButtonWrapper.jsx";
import FullScreenButton from "./FullScrinButton.jsx";
import FitOptions from "./FitOptions.jsx";
import ParamsTab from "./ParamsTab.jsx";
import SizeGrid from "./SizeGrid.jsx";
import TabButton from "./TabButton.jsx";
import UserInfo from "./UserInfo.jsx";
import {useAuth} from "../provider/AuthProvider.jsx";
import {useState} from "react";
import styles from './ui/profile.module.css'

const ProfileMeasurementsModal = ({ isOpen, onClose }) => {
    const { data } = useAuth();
    const [activeTab, setActiveTab] = useState("size");
    const [params, setParams] = useState({
        size: "M",
        bust: 40,
        waist: 63,
        hip: 92,
        fits: ["true"],
    });


    const updateParam = (field, value) => {
        setParams(prev => {
            if (field !== "fits") {
                return { ...prev, [field]: value };
            }
            const newFits = prev.fits.includes(value)
                ? prev.fits.filter(f => f !== value)
                : [...prev.fits, value];
            return { ...prev, fits: newFits };
        });
    };
    const handleRadioChange = (event) => {
        updateParam("fits", event.target.value);
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

export default ProfileMeasurementsModal;