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

  export interface Group {
    id: string;
    name: string;
    members: string[];
    channels?: Channel[];
    owner?: string;
    description?: string;
  }