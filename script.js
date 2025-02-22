const board = document.querySelector('#board');
const counter = document.querySelector('#moves');
const dialog = document.querySelector('dialog');

const emojis = ['🍎', '🍌', '🍇', '🍉', '🍊', '🍓', '🍒', '🥝'];
let flipped = [];

const get = (k, d) => JSON.parse(localStorage.getItem(`flip-${k}`)) ?? d;
const set = (k, v) => localStorage.setItem(`flip-${k}`, JSON.stringify(v));

const matchCard = e => {
    const { cards } = get('cards', {cards: []});
    let { moves } = get('moves', {moves: 0});
    moves++;
    set('moves', {moves});
    counter.textContent = moves;
    const [card1, card2] = flipped;
    if (card1.dataset.emoji === card2.dataset.emoji) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        const matched1 = card1.dataset.index;
        const matched2 = card2.dataset.index;
        const { matched } = get('matched', {matched: []});
        if (!matched.includes(matched1) && !matched.includes(matched2)) {
            matched.push(matched1, matched2);
            set('matched', {matched});
        }
        flipped = [];
        if (matched.length === cards.length) {
            const { wins } = get('wins', {wins: []});
            document.querySelectorAll('.card').forEach(card => {
                card.classList.remove('flipped');
                card.textContent = '';
            });
            wins.push(moves);
            wins.sort();
            wins.length = wins.length > 5 ? 5 : wins.length;
            set('wins', {wins});
            set('moves', {moves: 0});
            set('cards', {cards: []});
            set('matched', {matched: []});
            counter.textContent = 0;
            dialog.showModal();
            dialog.textContent = `Congratulations! You won in ${moves} moves!`;
            setTimeout(e => {
                board.textContent = '';
                showWins();
                displayCards();
                dialog.close();
            }, 3000);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '';
            card2.textContent = '';
            flipped = [];
        }, 1000);
    }
};

const flipCard = e => {
    const card = e.target;
    if (flipped.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
        card.classList.add('flipped');
        card.textContent = card.dataset.emoji;
        flipped.push(card);
        if (flipped.length === 2) {
            matchCard();
        }
    }
};

const showMoves = e => {
    const { moves } = get('moves', {moves: 0});
    counter.textContent = moves;
};

const showWins = e => {
    let { wins } = get('wins', {wins: []});
    let winList = document.querySelector('#wins');
    winList.innerHTML = '';
    for (const win of wins) {
        const winItem = document.createElement('li');
        winItem.textContent = win;
        winList.append(winItem);
    }
};

const showMatched = e => {
    const { matched } = get('matched', {matched: []});
    document.querySelectorAll('.card').forEach(card => {
        if (matched.includes(card.dataset.index)) {
            card.classList.add('matched');
            card.textContent = card.dataset.emoji;
        }
    });
};

const getCards = e => {
    const cards = [...emojis, ...emojis];
    cards.sort(() => Math.random() - 0.5);
    set('cards', {cards});
    return cards;
};

const displayCards = e => {
    let { cards } = get('cards', {cards: []});
    if (cards.length === 0) {
        cards = getCards();
    }
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;
        card.dataset.emoji = emoji;
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });
};

(e => {
    displayCards();
    showMatched();
    showMoves();
    showWins();
})();