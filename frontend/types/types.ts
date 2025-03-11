export interface Community {
    id: string;
    name: string;
    description?: string;
    owner: string;
    members: string[];
    channels: Channel[];
    createdAt: Date;
  }
  
  export interface Channel {
    id: string;
    name: string;
    description?: string;
  }