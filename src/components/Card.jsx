import React, { useState, useMemo, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import { Link } from 'react-router-dom';
import styles from './ui/card.module.css';

const db = [
  {
    id: 1,
    name: 'Dinesh Chugtai',
    position: 'фронт',
    skills: ['react', 'nextJS', 'brainfuck', 'strawberry'],
    description: 'Издеваюсь над помидорами',
    experience: '3 года',
    links: ['https://qwerty.com', 'https://asdfgh.ru']
  },
  {
    id: 2,
    name: 'Dinesh Chugtai2',
    description: 'Издеваюсь над помидорами',
    skills: ['react', 'nextJS', 'brain'],
    experience: '3 года',
    links: ['https://qwerty.com', 'https://asdfgh.ru']
  },
  {
    id: 3,
    name: 'Dinesh Chugtai43',
    position: 'фронт',
    description: 'Издеваюсь над помидорами',
    experience: '3 года',
    links: ['https://qwerty.com', 'https://asdfgh.ru']
  },
  {
    id: 4,
    type: 'own',
    name: 'Dinesh Chugtai4',
    skills: ['react', 'nextJS', 'brainfuck', 'strawberry'],
    position: 'бек',
    description: 'Издеваюсь над помидорами',
    experience: '3 года',
    links: ['https://qwerty.com', 'https://asdfgh.ru']
  },
  {
    id: 5,
    type: 'team',
    members: [
      { name: 'x', position: 'фронт', experience: '3', skills:['1', '2'] },
      { name: 'y', position: 'бек', experience: '3', skills:['2', '4'] },
      { name: 'z', position: 'моб', experience: '3', skills:['3, 5'] }
    ],
    name: 'Dinesh Chugtai5',
    description: 'Издеваюсь над помидорами, очень долго и мучительно изеваюсь над помидорами, совсем долго и мучительно издеваюсь над помидорами',
    links: ['https://qwerty.com', 'https://asdfgh.ru']
  }
]

function Card() {
  const [currentIndex, setCurrentIndex] = useState(db.length - 1);
  const [lastDirection, setLastDirection] = useState();
  const currentIndexRef = useRef(currentIndex);
  const [dismatch, setDismatch] = useState([]);
  const [match, setMatch] = useState([]);
  const [querymatch, setQueryMatch] = useState([]);

  const childRefs = useMemo(
      () =>
          Array(db.length)
              .fill(0)
              .map((i) => React.createRef()),
      []
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < db.length - 1;

  const canSwipe = currentIndex >= 0;

  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
    const card = db[index];
    if (direction === 'left') {
      setDismatch((prevDismatch) => [...prevDismatch, card]);
    } else if (direction === 'right') {
      setMatch((prevMatch) => [...prevMatch, card]);
    } else if (direction === 'down') {
      setQueryMatch((prevQueryMatch) => [...prevQueryMatch, card]);
    }
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < db.length) {
      await childRefs[currentIndex].current.swipe(dir);
    }
  };

  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };

  return (
      <div className={styles.mainCard}>
        <div className={styles.card}>
          {db.map((character, index) => (
              <TinderCard
                  ref={childRefs[index]}
                  key={character.name}
                  className={styles.swipe}
                  onSwipe={(dir) => swiped(dir, character.name, index)}
                  onCardLeftScreen={() => outOfFrame(character.name, index)}
              >
                <div className={styles.card}>
                  <div style={{ display: 'flex' }}>
                    <div>{character.name}</div>
                    <div className={styles.cardContent}>{character?.position}</div>
                    <div className={styles.cardContent}>{character?.experience}</div>
                  </div>
                  <div className={styles.achive}>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {character.skills &&
                          character.skills.map((item, index) => (
                              <div style={{ margin: '1em' }} key={index}>
                                {item}
                              </div>
                          ))}
                    </div>
                  </div>
                  <div className={styles.cardContent}>Описание: {character.description || 'Данные не указаны'}</div>
                  <div>

                    <Link to={`/product/${character.id}`} state={{ product: character }} >
                      <button className={`${styles.linkStyle} pressable`}> Подробнее</button>
                    </Link>
                  </div>
                </div>
              </TinderCard>
          ))}
        </div>
        <div className={styles.buttonlist}>
          <button onClick={() => swipe('left', null, currentIndex)}>left</button>
          <button onClick={() => swipe('down', null, currentIndex)}>down</button>
          <button onClick={() => swipe('right', null, currentIndex)}>right</button>
        </div>
        <div>
          <button onClick={() => goBack()}>undo</button>
        </div>
        {lastDirection ? (
            <h2 key={lastDirection}>You swiped {lastDirection}</h2>
        ) : (
            <h2 className='infoText'>Swipe</h2>
        )}
      </div>
  );
}

export default Card;