import combinedBlends from '$lib/assets/marketplace/combined-blends.png';

export type MarketplaceDeck = {
  name: string;
  description: string;
  author: string;
  image: string;
  id: string;
}

const marketplaceDecks: MarketplaceDeck[] = [
  {
    "name": "Combined Blends", 
    "description" : "This deck is aimed at blah blah blah a description of what this deck was made for.",
    "author": "Summer Kiesel",
    "image": combinedBlends,
    "id": "-NaT4aMfMtKhI7de8PQb"
  }
]

export default marketplaceDecks;