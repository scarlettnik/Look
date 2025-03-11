import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    db: [
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
    ],
    currentIndex: 0,
    lastDirection: null,
    dismatch: [],
    match: [],
    querymatch: [],
};

const cardSlice = createSlice({
    name: 'card',
    initialState,
    reducers: {
        setCurrentIndex: (state, action) => {
            state.currentIndex = action.payload;
        },
        setLastDirection: (state, action) => {
            state.lastDirection = action.payload;
        },
        addToDismatch: (state, action) => {
            state.dismatch.push(action.payload);
        },
        addToMatch: (state, action) => {
            state.match.push(action.payload);
        },
        addToQueryMatch: (state, action) => {
            state.querymatch.push(action.payload);
        },
        removeCard: (state, action) => {
            const cardId = action.payload;
            state.db = state.db.filter((card) => card.id !== cardId); // Удаляем карточку из db
        },
        resetState: (state) => {
            state.currentIndex = initialState.currentIndex;
            state.lastDirection = initialState.lastDirection;
            state.dismatch = initialState.dismatch;
            state.match = initialState.match;
            state.querymatch = initialState.querymatch;
            state.db = initialState.db; // Восстанавливаем исходный массив db
        },
    },
});

export const {
    setCurrentIndex,
    setLastDirection,
    addToDismatch,
    addToMatch,
    addToQueryMatch,
    removeCard,
    resetState,
} = cardSlice.actions;

export default cardSlice.reducer;
