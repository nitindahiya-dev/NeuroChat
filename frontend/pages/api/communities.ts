import { NextApiRequest, NextApiResponse } from 'next';

let communities: Community[] = [
  {
    id: '1',
    name: 'general',
    owner: '1',
    members: ['1', '2', '3'],
    channels: [{ id: '1', name: 'general' }],
    createdAt: new Date()
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      res.status(200).json(communities);
      break;
    case 'POST':
      const newCommunity = {
        id: String(communities.length + 1),
        ...req.body,
        createdAt: new Date()
      };
      communities.push(newCommunity);
      res.status(201).json(newCommunity);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}