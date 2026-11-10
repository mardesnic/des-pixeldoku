import type { Difficulty } from './game';

// The pictures, drawn by hand. One letter a square, standing for its colour
// once the picture is solved, and '.' for a square that stays empty. While
// playing, every coloured square looks the same; the colours are the reward.
//
// Every picture must have exactly one answer that can be found one line at a
// time, without guessing; pictures.test.ts checks this.

export const PALETTE: Record<string, string> = {
  K: '#2b2f38', // black
  W: '#ffffff', // white
  S: '#9aa3ad', // grey
  R: '#e03131', // red
  M: '#e64980', // dark pink
  P: '#faa2c1', // pink
  O: '#f76707', // orange
  Y: '#fcc419', // yellow
  N: '#8b5a2b', // brown
  G: '#2f9e44', // green
  L: '#94d82d', // light green
  B: '#1c7ed6', // blue
  C: '#74c0fc', // sky blue
  V: '#9c36b5', // purple
};

export type Picture = {
  id: string;
  // Said when it's solved: "It's a cat!" / "To je mačka!"
  name: { en: string; hr: string };
  rows: string[];
};

const TINY: Picture[] = [
  {
    id: 'heart',
    name: { en: 'a heart', hr: 'srce' },
    rows: ['.R.R.', 'RRRRR', 'RRRRR', '.RRR.', '..R..'],
  },
  {
    id: 'house',
    name: { en: 'a house', hr: 'kuća' },
    rows: ['..R..', '.RRR.', 'RRRRR', '.YNY.', '.YNY.'],
  },
  {
    id: 'tree',
    name: { en: 'a tree', hr: 'drvo' },
    rows: ['..G..', '.GGG.', 'GGGGG', '..N..', '..N..'],
  },
  {
    id: 'smile',
    name: { en: 'a smiley face', hr: 'smješko' },
    rows: ['.YYY.', 'Y.Y.Y', 'YYYYY', 'Y...Y', '.YYY.'],
  },
  {
    id: 'mushroom',
    name: { en: 'a mushroom', hr: 'gljiva' },
    rows: ['.RRR.', 'RR.RR', 'RRRRR', '..Y..', '.YYY.'],
  },
  {
    id: 'cat-face',
    name: { en: 'a cat', hr: 'mačka' },
    rows: ['O...O', 'OO.OO', 'OOOOO', 'O.O.O', '.OOO.'],
  },
  {
    id: 'sun',
    name: { en: 'the sun', hr: 'sunce' },
    rows: ['Y.Y.Y', '.YYY.', 'YYYYY', '.YYY.', 'Y.Y.Y'],
  },
  {
    id: 'umbrella',
    name: { en: 'an umbrella', hr: 'kišobran' },
    rows: ['.BBB.', 'BBBBB', '..N..', '..N..', '.NN..'],
  },
];

const SMALL: Picture[] = [
  {
    id: 'apple',
    name: { en: 'an apple', hr: 'jabuka' },
    rows: ['...G..', '..N...', '.RRRR.', 'RRRRRR', 'RRRRRR', '.RRRR.'],
  },
  {
    id: 'fish',
    name: { en: 'a fish', hr: 'riba' },
    rows: ['..B...', '.BBB.B', 'B.BBBB', 'BBBBBB', '.BBB.B', '..B...'],
  },
  {
    id: 'rocket',
    name: { en: 'a rocket', hr: 'raketa' },
    rows: ['..RR..', '.SSSS.', '.SCCS.', '.SSSS.', 'RSSSSR', 'R.OO.R'],
  },
  {
    id: 'ghost',
    name: { en: 'a ghost', hr: 'duh' },
    rows: ['.VVVV.', 'VVVVVV', 'V.VV.V', 'VVVVVV', 'VVVVVV', 'V.VV.V'],
  },
  {
    id: 'crown',
    name: { en: 'a crown', hr: 'kruna' },
    rows: ['Y.YY.Y', 'YYYYYY', 'YRYYBY', 'YYYYYY', '.VVVV.', 'VVVVVV'],
  },
  {
    id: 'duck',
    name: { en: 'a duck', hr: 'patka' },
    rows: ['.YY...', 'OKY...', '.YY..Y', '.YYYYY', '..YYY.', '..O.O.'],
  },
  {
    id: 'butterfly',
    name: { en: 'a butterfly', hr: 'leptir' },
    rows: ['VV..VV', 'VVVVVV', 'VVNNVV', '.PNNP.', 'PPNNPP', 'PP..PP'],
  },
  {
    id: 'bird',
    name: { en: 'a bird', hr: 'ptica' },
    rows: ['..BB..', '.BBKO.', 'BBBBB.', '.BBBB.', '..BB..', '..O.O.'],
  },
];

const MEDIUM: Picture[] = [
  {
    id: 'car',
    name: { en: 'a car', hr: 'auto' },
    rows: [
      '........',
      '..RRRRR.',
      '.RCCRCCR',
      'RRRRRRRR',
      'RRRRRRRR',
      'RKKRRKKR',
      '.KK..KK.',
      'SSSSSSSS',
    ],
  },
  {
    id: 'cat',
    name: { en: 'a cat', hr: 'mačka' },
    rows: [
      'O......O',
      'OO....OO',
      'OOOOOOOO',
      'O..OO..O',
      'OOOOOOOO',
      'OOOPPOOO',
      '.OOOOOO.',
      '..OOOO..',
    ],
  },
  {
    id: 'sailboat',
    name: { en: 'a sailing boat', hr: 'jedrilica' },
    rows: [
      '...R....',
      '...SY...',
      '..YSYY..',
      '.YYSYYY.',
      'YYYSYYYY',
      '...S....',
      'NNNNNNNN',
      '.NNNNNN.',
    ],
  },
  {
    id: 'strawberry',
    name: { en: 'a strawberry', hr: 'jagoda' },
    rows: [
      '...GG...',
      '.GGGGGG.',
      '.RRRRRR.',
      'RRYRRYRR',
      'RRRRRRRR',
      '.RYRRYR.',
      '..RRRR..',
      '...RR...',
    ],
  },
  {
    id: 'penguin',
    name: { en: 'a penguin', hr: 'pingvin' },
    rows: [
      '..KKKK..',
      '.KKKKKK.',
      '.KWOOWK.',
      'KKWWWWKK',
      'K.WWWW.K',
      '..WWWW..',
      '.KWWWWK.',
      '.OO..OO.',
    ],
  },
  {
    id: 'frog',
    name: { en: 'a frog', hr: 'žaba' },
    rows: [
      '.GG..GG.',
      'GKGGGGKG',
      'GGGGGGGG',
      'GGGGGGGG',
      'GRGGGGRG',
      'GGRRRRGG',
      '.GGGGGG.',
      'GG....GG',
    ],
  },
  {
    id: 'whale',
    name: { en: 'a whale', hr: 'kit' },
    rows: [
      '..C.C...',
      '...C....',
      '..BBBB.B',
      '.BBBBBBB',
      'BKBBBBB.',
      'BBBBBB..',
      '.BCCCB..',
      '........',
    ],
  },
  {
    id: 'castle',
    name: { en: 'a castle', hr: 'dvorac' },
    rows: [
      'S.S..S.S',
      'SSS..SSS',
      'SSSSSSSS',
      'SSSSSSSS',
      'SCSSSSCS',
      'SSSNNSSS',
      'SSSNNSSS',
      'SSSNNSSS',
    ],
  },
];

const BIG: Picture[] = [
  {
    id: 'pig',
    name: { en: 'a pig', hr: 'prase' },
    rows: [
      'PP......PP',
      'PPP....PPP',
      '.PPPPPPPP.',
      'PPPPPPPPPP',
      'PPKPPPPKPP',
      'PPPPPPPPPP',
      'PPPMMMMPPP',
      'PPPKMMKPPP',
      '.PPPPPPPP.',
      '..PPPPPP..',
    ],
  },
  {
    id: 'ladybird',
    name: { en: 'a ladybird', hr: 'bubamara' },
    rows: [
      '....KK....',
      '...KKKK...',
      '.RRRKKRRR.',
      'RRKRKKRKRR',
      'RKKRKKRKKR',
      'RRRRKKRRRR',
      'RKRRKKRRKR',
      'RRRRKKRRRR',
      '.RRRKKRRR.',
      '..RRKKRR..',
    ],
  },
  {
    id: 'lighthouse',
    name: { en: 'a lighthouse', hr: 'svjetionik' },
    rows: [
      '....RR....',
      '...RRRR...',
      '...YYYY...',
      '..KKKKKK..',
      '...RRRR...',
      '...WWWW...',
      '...RRRR...',
      '..WWWWWW..',
      '..RRRRRR..',
      'BBBBBBBBBB',
    ],
  },
  {
    id: 'rainbow',
    name: { en: 'a rainbow', hr: 'duga' },
    rows: [
      '..RRRRRR..',
      '.RROOOORR.',
      'RROOYYOORR',
      'ROOYYYYOOR',
      'ROYYGGYYOR',
      'ROYG..GYOR',
      'ROYG..GYOR',
      'ROYG..GYOR',
      'WWW....WWW',
      '.WW....WW.',
    ],
  },
  {
    id: 'dinosaur',
    name: { en: 'a dinosaur', hr: 'dinosaur' },
    rows: [
      '......GGG.',
      '.....GGKGG',
      '.....GGGGG',
      '.....GGG..',
      'G..GGGGGG.',
      'GG.GGGGG..',
      '.GGGGGGG..',
      '..GGGGG...',
      '..GG.GG...',
      '..GG..GG..',
    ],
  },
  {
    id: 'bus',
    name: { en: 'a bus', hr: 'autobus' },
    rows: [
      '.YYYYYYYY.',
      'YYYYYYYYYY',
      'YCCYCCYCCY',
      'YCCYCCYCCY',
      'YYYYYYYYYY',
      'YYYYYYYYYY',
      'OOOOOOOOOO',
      'YKKYYYYKKY',
      '.KK....KK.',
      'SSSSSSSSSS',
    ],
  },
  {
    id: 'elephant',
    name: { en: 'an elephant', hr: 'slon' },
    rows: [
      '..SSSS....',
      '.SSSSSSSS.',
      'SSKSSSSSSS',
      'SSSSSSSSSS',
      'SS.SSSSSSS',
      'S..SSSSSSS',
      'S..SSSSSSS',
      'S..SS..SS.',
      'SS.SS..SS.',
      '...SS..SS.',
    ],
  },
  {
    id: 'sunflower',
    name: { en: 'a sunflower', hr: 'suncokret' },
    rows: [
      '...YYYY...',
      '..YNNNNY..',
      '..YNNNNY..',
      '...YYYY...',
      '....GG....',
      '.GG.GG.GG.',
      '..GGGGGG..',
      '.OOOOOOOO.',
      '..OOOOOO..',
      '..OOOOOO..',
    ],
  },
];

export const PICTURES: Record<Difficulty, Picture[]> = {
  tiny: TINY,
  small: SMALL,
  medium: MEDIUM,
  big: BIG,
};
