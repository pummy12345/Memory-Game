import { useEffect, useState } from "react";

const MemoryGame = () => {
    const [gridSize, setGridSize] = useState(4);
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [won, setWon] = useState(false);
    const [moves, setMoves] = useState(0);
    const [minMoves, setMinMoves] = useState(0);
    const [maxMoves, setMaxMoves] = useState(0);

    // Update grid size and reset the game
    const handleGridSizeChange = (e) => {
        const size = parseInt(e.target.value);
        if (size >= 2 && size <= 10) {
            setGridSize(size);
            setWon(false);  // Reset the win status on grid size change
        }
    };

    // Initialize the game with a shuffled set of cards
    const initializeGame = () => {
        const totalCards = gridSize * gridSize;
        const pairCount = Math.floor(totalCards / 2);
        const numbers = [...Array(pairCount).keys()].map((n) => n + 1);
        
        const initialCards = [...numbers, ...numbers];
        if (totalCards % 2 !== 0) {
            initialCards.push(numbers[0]);
        }

        const shuffledCards = initialCards
            .sort(() => Math.random() - 0.5)
            .slice(0, totalCards)
            .map((number, index) => ({ id: index, number }));
        
        setCards(shuffledCards);
        setFlipped([]);
        setSolved([]);
        setMoves(0);
        setWon(false);
        setDisabled(false);
        setMinMoves(pairCount);  // Minimum moves required for perfect game
        setMaxMoves(0);  // Reset max moves when starting a new game
    };

    // Start the game when the grid size changes
    useEffect(() => {
        initializeGame();
    }, [gridSize]);

    // Check if all cards are solved, mark the game as won
    useEffect(() => {
        if (solved.length === cards.length && cards.length > 0) {
            setWon(true);  // Set the won state when all pairs are solved
            setMaxMoves(moves);  // Set the actual moves taken as max moves
        }
    }, [solved, cards]);

    // Handle card click: Flip cards and check for matches
    const handleClick = (id) => {
        if (disabled || won || flipped.includes(id) || solved.includes(id)) return;
        
        setFlipped((prevFlipped) => {
            const newFlipped = [...prevFlipped, id];
            if (newFlipped.length === 2) {
                setDisabled(true);
                setMoves(moves + 1);  // Increment moves on every pair flip

                const [firstId, secondId] = newFlipped;
                if (cards[firstId].number === cards[secondId].number) {
                    setSolved((prevSolved) => [...prevSolved, firstId, secondId]);
                }

                // Reset flipped cards after 1 second and enable clicking again
                setTimeout(() => {
                    setFlipped([]);
                    setDisabled(false);
                }, 1000);
            }
            return newFlipped;
        });
    };

    // Check if the card is flipped or solved
    const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
    const isSolved = (id) => solved.includes(id);

    // Track max moves as the game progresses
    useEffect(() => {
        if (moves > maxMoves) {
            setMaxMoves(moves);  // Update maxMoves if the current moves exceed the previous max
        }
    }, [moves]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-grey-100 p-4">
            <h1 className="text-3xl font-bold">Memory Game</h1>
            
            <div className="mb-4">
                <label htmlFor="gridSize" className="mr-2">Grid Size: (max 10)</label>
                <input
                    type="number"
                    id="gridSize"
                    min="2"
                    max="10"
                    value={gridSize}
                    onChange={handleGridSizeChange}
                    className="border-2 border-gray-300 rounded px-2 py-1"
                />
            </div>

            <div className="text-xl mb-4">
                <div>Moves: {moves}</div>
                <div>Minimum Moves (Perfect Game): {minMoves}</div>
                <div>Maximum Moves (Your Moves): {maxMoves}</div>
            </div>

            {won && (
                <div className="text-xl font-bold text-green-500 mb-4">
                    Congratulations! You won!
                </div>
            )}

            {/* Reset Game Button */}
            <button
    onClick={initializeGame} // Resets the game state
    className="bg-gradient-to-r from-blue-400 to-teal-500 text-white px-6 py-3 rounded-lg mb-4 hover:from-blue-500 hover:to-teal-600 shadow-lg transform hover:scale-110 transition-all duration-300 ease-in-out"
>
    Reset Game
</button>


            {/* Display the Cards */}
            <div
                className="grid gap-2"
                style={{
                    gridTemplateColumns: `repeat(${gridSize}, minmax(50px, 1fr))`,
                    width: `min(100%, ${gridSize * 5.5}rem)`,
                }}
            >
                {cards.map((card) => (
                    <div
                        key={card.id}
                        onClick={() => handleClick(card.id)}
                        className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg
                                    cursor-pointer transition-all duration-300 transform hover:scale-105 ${isFlipped(card.id) 
                                        ? isSolved(card.id) 
                                            ? "bg-green-500 text-white"
                                            : "bg-blue-300 text-gray-400"
                                         : "bg-gray-300 text-gray-400 hover:bg-gray-400"
                                    }`}
                    >
                        {isFlipped(card.id) || isSolved(card.id) ? card.number : "?"}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MemoryGame;
