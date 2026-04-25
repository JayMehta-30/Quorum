import { create } from 'zustand';
import { Movie } from '@/data/movies';

export type GamePhase = 'LOBBY' | 'VOTING' | 'REVEAL' | 'LEADERBOARD';

interface GameState {
  players: string[];
  currentPlayerIndex: number;
  phase: GamePhase;
  votes: Record<string, number>; // movieId -> total score
  
  // Actions
  addPlayer: (name: string) => void;
  removePlayer: (name: string) => void;
  startGame: () => void;
  recordVote: (movieId: string, score: number) => void;
  nextPlayer: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  players: [],
  currentPlayerIndex: 0,
  phase: 'LOBBY',
  votes: {},

  addPlayer: (name) => set((state) => {
    if (!name.trim() || state.players.includes(name.trim())) return state;
    return { players: [...state.players, name.trim()] };
  }),
  
  removePlayer: (name) => set((state) => ({
    players: state.players.filter((p) => p !== name)
  })),

  startGame: () => set((state) => ({
    phase: state.players.length > 0 ? 'VOTING' : 'LOBBY',
    currentPlayerIndex: 0,
    votes: {}, // reset votes on start
  })),

  recordVote: (movieId, score) => set((state) => ({
    votes: {
      ...state.votes,
      [movieId]: (state.votes[movieId] || 0) + score
    }
  })),

  nextPlayer: () => set((state) => {
    const nextIndex = state.currentPlayerIndex + 1;
    if (nextIndex >= state.players.length) {
      return { phase: 'REVEAL', currentPlayerIndex: 0 };
    }
    return { currentPlayerIndex: nextIndex };
  }),

  resetGame: () => set({
    players: [],
    currentPlayerIndex: 0,
    phase: 'LOBBY',
    votes: {}
  })
}));
