export interface User {
    id: string;
    username: string;
    avatar: string;
  }
  
  export const dummyUsers: User[] = [
    { id: '1', username: 'Neo', avatar: '👨💻' },
    { id: '2', username: 'Trinity', avatar: '🕶️' },
    { id: '3', username: 'Morpheus', avatar: '🧔' },
    { id: '4', username: 'Oracle', avatar: '🔮' },
    { id: '5', username: 'Cypher', avatar: '🕵️' },
  ];