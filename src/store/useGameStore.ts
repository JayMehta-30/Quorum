import { create } from 'zustand';
import type { Movie } from '@/data/movies';

export type GamePhase = 'LANDING' | 'BROWSE' | 'LOBBY' | 'HANDOFF' | 'VOTING' | 'REVEAL' | 'LEADERBOARD';
export type VoteType = 'yes' | 'no' | 'love';

interface GameState {
  players: string[];
  genres: string[];
  selectedMovies: Movie[];
  currentPlayerIndex: number;
  phase: GamePhase;
  votes: Record<string, Record<string, VoteType>>; // playerName -> { movieId: vote }
  
  // Actions
  setPhase: (phase: GamePhase) => void;
  toggleMovieSelection: (movie: Movie) => void;
  setSelectedMovies: (movies: Movie[]) => void;
  addPlayer: (name: string) => void;
  removePlayer: (name: string) => void;
  startGame: (names: string[], genres: string[]) => void;
  recordVote: (movieId: string, vote: VoteType) => void;
  nextPlayer: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  players: [],
  genres: [],
  selectedMovies: [],
  currentPlayerIndex: 0,
  phase: 'LANDING',
  votes: {},

  setPhase: (phase) => set({ phase }),

  setSelectedMovies: (movies) => set({ selectedMovies: movies }),

  toggleMovieSelection: (movie) => set((state) => {
    const isSelected = state.selectedMovies.some(m => m.id === movie.id);
    if (isSelected) {
      return { selectedMovies: state.selectedMovies.filter(m => m.id !== movie.id) };
    } else {
      return { selectedMovies: [...state.selectedMovies, movie] };
    }
  }),

  addPlayer: (name) => set((state) => {
    if (!name.trim() || state.players.includes(name.trim())) return state;
    return { players: [...state.players, name.trim()] };
  }),
  
  removePlayer: (name) => set((state) => ({
    players: state.players.filter((p) => p !== name)
  })),

  startGame: (names, genres) => set(() => ({
    players: names,
    genres: genres,
    phase: names.length > 0 ? 'HANDOFF' : 'LOBBY',
    currentPlayerIndex: 0,
    votes: Object.fromEntries(names.map((n) => [n, {}])), // initialize empty votes for everyone
  })),

  recordVote: (movieId, vote) => set((state) => {
    const current = state.players[state.currentPlayerIndex];
    if (!current) return state;
    
    return {
      votes: {
        ...state.votes,
        [current]: {
          ...state.votes[current],
          [movieId]: vote
        }
      }
    };
  }),

  nextPlayer: () => set((state) => {
    const nextIndex = state.currentPlayerIndex + 1;
    if (nextIndex >= state.players.length) {
      return { phase: 'REVEAL', currentPlayerIndex: 0 };
    }
    return { currentPlayerIndex: nextIndex, phase: 'HANDOFF' };
  }),

  resetGame: () => set({
    players: [],
    genres: [],
    selectedMovies: [],
    currentPlayerIndex: 0,
    phase: 'LANDING',
    votes: {}
  })
}));
