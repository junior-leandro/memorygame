import './style.css';
import { Card, CardProps } from "../Card";
import { useRef, useState } from 'react';
import { duplicateRegenerateSortArray } from '../../utils/card-utils';

export interface GridProps {
    cards: CardProps[]
};

export function Grid({ cards }: GridProps) {
    const [stateCards, setStateCards] = useState(() => {
        return duplicateRegenerateSortArray(cards);
    });
    const first = useRef<CardProps | null >(null);
    const second = useRef<CardProps | null >(null);
    const unflip = useRef(false);
    const [matches, setMatches] = useState (0);
    const [moves, setMoves] = useState (0);

    const handleReset = () => {
        setStateCards(duplicateRegenerateSortArray(cards));
        first.current = null;
        second.current = null;
        unflip.current = false;
        setMatches (0);
        setMoves (0);
    }
    
    const handleClick = (id: string) => {
        const newStateCards = stateCards.map((card) => {
            //Se o id do card não foi clicado, não faz nada
            if (card.id !== id) return card;
            //se o card ja estiver virado, não faz nada
            if (card.flipped) return card;

            //desviro possiveis cards errados
            if (unflip.current && first.current && second.current) {
                first.current.flipped = false;
                second.current.flipped = false;
                first.current = null;
                second.current = null;
                unflip.current = false;
            }

            //virar o card
            card.flipped = true;

            // config first e second card click
            if (first.current === null) {
                first.current = card;
            } else if (second.current === null) {
                second.current = card;
            }

            // se eu tenho oso dois virados
            //posso checar se estão corretos
            if (first.current && second.current){
                if (first.current.back === second.current.back){
                    //acertou
                    first.current = null
                    second.current = null
                    setMatches((m) => m + 1);
                } else {
                    //errou
                    unflip.current = true;
                }
                setMoves((m) => m + 1);
            }
            return card;
        });
        setStateCards(newStateCards);
    };

    return (
        < >
        <div className="text">
            <h1>Memory Game </h1>
            <p>Moves: {moves} | Matches: {matches} | <button onClick={() =>handleReset()} className='reset__button'>RESET</button></p>
        </div>
        <div className="grid">
            {stateCards.map((card) => {
                return <Card {...card} key={card.id} handleClick={handleClick}/>;
            })}
        </div>
        </>
    );
};