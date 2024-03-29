import doublingPractice from '$lib/assets/marketplace/doubling-practice.png';
import weldedSounds from '$lib/assets/marketplace/welded-sounds.png';
import latin from '$lib/assets/marketplace/latin.png';
import twosyllable from '$lib/assets/marketplace/2syllable.png';
import cvcMagicE from '$lib/assets/marketplace/cvc-and-magic-e.jpg';
import blendsAdvancedVowels from '$lib/assets/marketplace/blends-and-advanced-vowels.jpg';

export type MarketplaceDeck = {
  name: string;
  description: string;
  author: string;
  image: string;
  id: string;
};

const marketplaceDecks: MarketplaceDeck[] = [
  {
    name: '2 Syllables (6 cards)',
    description:
      'This deck features six columns and is great for introducing 2 syllable words and syllable division patterns to your students. Create VC/CV words or collapse the 3rd column to change them to V/CV and VC/V.',
    author: 'Summer Kiesel',
    image: twosyllable,
    id: '-Nl4-F3yj7JTYznUkUXL',
  },
  {
    name: 'Doubling Practice',
    description: 'This deck is perfect for practicing the doubling rule when adding on a vowel suffix or consonant-le.',
    author: 'Summer Kiesel',
    image: doublingPractice,
    id: '-Nami4dTLiMr5iCw2UNz',
  },
  {
    name: 'Welded Sounds',
    description:
      'Whether you call these welded sounds, glued sounds, wild old words, or closed syllable exceptions, this deck is great for practicing those trickier word families.',
    author: 'Summer Kiesel',
    image: weldedSounds,
    id: '-Nami9-twBSGvYqDI1HW',
  },
  {
    name: 'Latin Roots',
    description:
      'This deck contains 100 of the most common Latin roots and affixes for practicing morphology and fluency with multi-syllabic words. We recommend this deck for creating playlists or editing down to a smaller selection of morphemes to work on.',
    author: 'Summer Kiesel',
    image: latin,
    id: '-NarqpewAp2p8H6inYXL',
  },
  {
    name: 'CVC and Magic E',
    description: 'This is one of our old preloaded decks. It contains basic graphemes for CVC words with the option to add in Magic E.',
    author: 'Summer Kiesel',
    image: cvcMagicE,
    id: '-NtE1MN0Cf_aInFK3FtP',
  },
  {
    name: 'Blends and Advanced Vowels',
    description:
      'This is one of our old preloaded decks. It contains basic graphemes for some consonant blends and more advanced vowels. The blends on this board are separated.',
    author: 'Summer Kiesel',
    image: blendsAdvancedVowels,
    id: '-NtE1YEqHfSFUzdkeLzM',
  },
];

export default marketplaceDecks;
