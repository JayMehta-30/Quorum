export interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string;
  imageUrl: string;
  description: string;
}

export const MOVIE_DECK: Movie[] = [
  {
    id: "m1",
    title: "Inception",
    year: 2010,
    genre: "Sci-Fi",
    imageUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=800",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology."
  },
  {
    id: "m2",
    title: "Interstellar",
    year: 2014,
    genre: "Sci-Fi",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
  },
  {
    id: "m3",
    title: "The Dark Knight",
    year: 2008,
    genre: "Action",
    imageUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&q=80&w=800",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham."
  },
  {
    id: "m4",
    title: "Pulp Fiction",
    year: 1994,
    genre: "Crime",
    imageUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=800",
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine."
  },
  {
    id: "m5",
    title: "The Matrix",
    year: 1999,
    genre: "Sci-Fi",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
    description: "A computer hacker learns from mysterious rebels about the true nature of his reality."
  },
  {
    id: "m6",
    title: "Gladiator",
    year: 2000,
    genre: "Action",
    imageUrl: "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?auto=format&fit=crop&q=80&w=800",
    description: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family."
  },
  {
    id: "m7",
    title: "Dune",
    year: 2021,
    genre: "Sci-Fi",
    imageUrl: "https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?auto=format&fit=crop&q=80&w=800",
    description: "Feature adaptation of Frank Herbert's science fiction novel, about the son of a noble family."
  },
  {
    id: "m8",
    title: "Blade Runner 2049",
    year: 2017,
    genre: "Sci-Fi",
    imageUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=800",
    description: "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard."
  },
  {
    id: "m9",
    title: "Mad Max: Fury Road",
    year: 2015,
    genre: "Action",
    imageUrl: "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?auto=format&fit=crop&q=80&w=800",
    description: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland."
  },
  {
    id: "m10",
    title: "Fight Club",
    year: 1999,
    genre: "Drama",
    imageUrl: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=800",
    description: "An insomniac office worker and a devil-may-care soap maker form an underground fight club."
  }
];
