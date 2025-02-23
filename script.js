const board = document.querySelector('#board');
const counter = document.querySelector('#moves');
const dialog = document.querySelector('dialog');

// Load sounds
const matchSound = new Audio('match.mp3');
const mismatchSound = new Audio('mismatch.mp3');
const winSound = new Audio('win.mp3');

const emojis = ['🍎', '🍌', '🍇', '🍉', '🍊', '🍓', '🍒', '🥝'];
let flipped = [];

const get = (k, d) => JSON.parse(localStorage.getItem(`flip-${k}`)) ?? d;
const set = (k, v) => localStorage.setItem(`flip-${k}`, JSON.stringify(v));

const matchCard = () => {
    const { cards } = get('cards', {cards: []});
    let { moves } = get('moves', {moves: 0});
    moves++;
    set('moves', {moves});
    counter.textContent = moves;

    const [card1, card2] = flipped;

    if (card1.dataset.emoji === card2.dataset.emoji) {
        // On Match
        matchSound.play();
        card1.classList.add('matched', 'match-effect');
        card2.classList.add('matched', 'match-effect');

        setTimeout(() => {
            card1.classList.remove('match-effect');
            card2.classList.remove('match-effect');
        }, 500);

        const matched1 = card1.dataset.index;
        const matched2 = card2.dataset.index;
        const { matched } = get('matched', {matched: []});

        if (!matched.includes(matched1) && !matched.includes(matched2)) {
            matched.push(matched1, matched2);
            set('matched', {matched});
        }

        flipped = [];

        if (matched.length === cards.length) {
            // On Win
            setTimeout(() => {
                winSound.play();
                document.body.classList.add('win-effect');

                setTimeout(() => {
                    document.body.classList.remove('win-effect');
                }, 1500);

                dialog.showModal();
                dialog.innerHTML = `<strong>🎉 Congratulations!</strong><br>You won in <b>${moves}</b> moves!`;
                setTimeout(() => {
                    dialog.close();
                    resetGame();
                }, 3000);
            }, 500);
        }
    } else {
        // On Mismatch
        mismatchSound.play();
        card1.classList.add('mismatch-effect');
        card2.classList.add('mismatch-effect');

        setTimeout(() => {
            card1.classList.remove('flipped', 'mismatch-effect');
            card2.classList.remove('flipped', 'mismatch-effect');
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
            setTimeout(matchCard, 500);
        }
    }
};

const resetGame = () => {
    set('moves', {moves: 0});
    set('cards', {cards: []});
    set('matched', {matched: []});
    board.textContent = '';
    counter.textContent = 0;
    displayCards();
};

const displayCards = () => {
    let { cards } = get('cards', {cards: []});
    if (cards.length === 0) {
        cards = [...emojis, ...emojis];
        cards.sort(() => Math.random() - 0.5);
        set('cards', {cards});
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

displayCards();
