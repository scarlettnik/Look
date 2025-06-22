import styles from './ui/save.module.css'
import Sidebar from './Sidebar';
import {Link} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import FullScreenButton from "./FullScrinButton.jsx";
import ButtonWrapper from "./ButtonWrapper.jsx";
import Modal from "./utils/Modal.jsx";
import AddList from "./AddList.jsx";


const Save = () => {
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedSaves, setSelectedSaves] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [savesData, setSavesData] = useState([
        { id: 1, name: "All Saved" },
        { id: 2, name: "Travel Plans" },
        { id: 3, name: "Home Decor" },
        { id: 4, name: "Recipes" },
        { id: 5, name: "Books" },
        { id: 6, name: "Movies" },
        { id: 7, name: "All Saved" },
        { id: 8, name: "Travel Plans" },
        { id: 9, name: "Home Decor" },
        { id: 10, name: "Recipes" },
        { id: 11, name: "Books" },
        { id: 12, name: "Movies" },
    ]);

    const containerRef = useRef(null);
    const modalRef = useRef(null);

    useEffect(() => {
        if (!window.visualViewport) return;

        const handleResize = () => {
            const newHeight = window.visualViewport.height;
            const keyboardHeight = window.innerHeight - newHeight;
            setKeyboardHeight(keyboardHeight > 100 ? keyboardHeight : 0);

            if (containerRef.current) {
                containerRef.current.style.height = `${newHeight}px`;
            }
        };

        const handleScroll = () => {
            const activeElement = document.activeElement;
            if (activeElement?.tagName === 'INPUT') {
                activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };

        window.visualViewport.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.visualViewport?.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);



    const filteredSaves = savesData.filter(save =>
        save.name.toLowerCase().includes(filterText.toLowerCase())
    );

    const toggleSaveSelection = (id) => {
        if (selectedSaves.includes(id)) {
            setSelectedSaves(selectedSaves.filter(saveId => saveId !== id));
        } else {
            setSelectedSaves([...selectedSaves, id]);
        }
    };

    const deleteOpen = () => {
        setIsModalOpen(false);
        setDeleteMode(!deleteMode);

    }
    const createOpen = () => {
        setDeleteMode(false)
        setIsModalOpen(true)
    }
    const createClose = () => {
        setIsModalOpen(false)
    }
    const handleDelete = () => {
        setSavesData(savesData.filter(save => !selectedSaves.includes(save.id)));
        setSelectedSaves([]);
        setDeleteMode(false);
    };

    const handleCreateCollection = () => {
        if (newCollectionName.trim()) {
            const newCollection = {
                id: Date.now(),
                name: newCollectionName
            };
            setSavesData([...savesData, newCollection]);
            setNewCollectionName('');
            setIsModalOpen(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setIsModalOpen(false);
            }
        };

        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen]);

    return (
        <>
            <div
                ref={containerRef}
                className={styles.container}
                style={{
                    height: `${window.innerHeight}px`,
                    paddingBottom: keyboardHeight > 0 ? keyboardHeight : 0,
                }}
            >
                <div className={styles.searchBar}>
                    <div className={styles.searchContainer}>
                        <span className={styles.searchIcon}>
                            <img src='/subicons/search.svg'/>
                        </span>
                        <input
                            type="text"
                            placeholder="Search for a wishlist..."
                            className={styles.input}
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                        />
                    </div>
                    <div className={styles.buttons}>
                        <button
                            className={styles.circleButton}
                            onClick={createOpen}
                        >
                            <img src='/subicons/plus.svg'/>
                        </button>
                        <button
                            className={styles.circleButton}
                            onClick={deleteOpen}
                        >
                            <img src='/subicons/minus.svg'/>
                        </button>
                    </div>
                </div>

                <div className={styles.cards} style={{marginBottom: deleteMode ? '120px': '0px'}}>
                    {filteredSaves.map(save => (
                        <div key={save.id} className={styles.cardContainer}>
                            {deleteMode && (
                                <label className={styles.customCheckbox}>
                                    <input
                                        type="checkbox"
                                        checked={selectedSaves.includes(save.id)}
                                        onChange={() => toggleSaveSelection(save.id)}
                                        className={styles.hiddenCheckbox}
                                    />
                                    <span className={styles.checkmark}></span>
                                </label>
                            )}
                            <Link to={`/save/${save.id}`} state={{save}}>
                                <div className={styles.card}>
                                    <img
                                        src='https://salehard.артстена.рф/storage/categories-created/abstrakciya/fotooboi-abstraktsiya-22285540_-_id___20730.jpg'
                                        alt={save.name}
                                        className={styles.image}
                                    />
                                </div>
                                <h3 className={styles.cardTitle}>{save.name}</h3>
                            </Link>
                        </div>
                    ))}
                </div>

                    <Modal  isOpen={isModalOpen}
                            onClose={createClose}>
                        <AddList/>
                    </Modal>

            </div>
            {deleteMode && (
                <div style={{position:'sticky'}} >
                    <ButtonWrapper>
                        <FullScreenButton
                            className={styles.cancelButton}
                            onClick={() => {
                                setDeleteMode(false);
                                setSelectedSaves([]);
                            }}
                            color='var(--light-gray)'
                            textColor="var(--black)"
                        >
                            Отменить
                        </FullScreenButton>
                        <FullScreenButton
                            className={styles.deleteButton}
                            onClick={handleDelete}
                            disabled={selectedSaves.length === 0}
                        >
                            Удалить {selectedSaves.length > 0 && selectedSaves.length}
                        </FullScreenButton>
                    </ButtonWrapper>
                </div>
            )}
            <Sidebar/>
        </>
    );
};

export default Save;