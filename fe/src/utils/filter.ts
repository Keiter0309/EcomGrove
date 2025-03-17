import { filter } from "../interfaces";

export const FilterItems: filter[] = [
    { id: 1, sortby: 'Default', price: 'All', tags: 'Nature', categories: 'Nature - Forest' },
    { id: 2, sortby: 'Popularity', price: '$0 - $50.00', tags: 'Forest', categories: 'Nature - Forest' },
    { id: 3, sortby: 'Average rating', price: '$50.00 - $100.00', tags: 'Ocean', categories: 'Ocean' },
    { id: 4, sortby: 'Newness', price: '$100.00 - $150.00', tags: 'Mountain', categories: 'Mountain' },
    { id: 5, sortby: 'Price: Low to High', price: '$150.00 - $200.00', tags: 'Desert', categories: 'Desert' },
    { id: 6, sortby: 'Price: High to Low', price: '$200.00 - $250.00', tags: 'Cityscape', categories: 'City' }
]