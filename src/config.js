/** @type {FormattingConfig} */
const formatting = {
   canvas: {
      background: '#ebf6fa',
      activeBackground: '#b0e3f6',
   },
   selected: {
      background: '#ff8066',
   },
   graphs: {
      backgroundColor: '#e2f4fb',
      borderColor: '#00000055',
      borderWidth: 2,
   },
   sets: {
      font: {
         font: 'Arial',
         size: 20,
      },
   },
   intersections: {
      font: {
         font: 'Arial',
         size: 20,
      },
   },
}

const data2s = [
   [
      { label: 'Soccer', values: [ 'alex', 'casey', 'drew', 'hunter' ] },
      { label: 'Tennis', values: [ 'casey', 'drew', 'jade' ] },
      { label: 'Volleyball', values: [ 'drew', 'glen', 'jade' ] },
   ],
   {
      label: 'Sports',
   },
]

const data3s = {
   labels: [
      'Soccer',
      'Tennis',
      'Volleyball',
      'Soccer ∩ Tennis',
      'Soccer ∩ Volleyball',
      'Tennis ∩ Volleyball',
      'Soccer ∩ Tennis ∩ Volleyball',
   ],
   datasets: [
      {
         label: 'Sports',
         data: [
            { sets: [ 'Soccer' ], value: 2 },
            { sets: [ 'Tennis' ], value: 0 },
            { sets: [ 'Volleyball' ], value: 1 },
            { sets: [ 'Soccer', 'Tennis' ], value: 1 },
            { sets: [ 'Soccer', 'Volleyball' ], value: 0 },
            { sets: [ 'Tennis', 'Volleyball' ], value: 1 },
            { sets: [ 'Soccer', 'Tennis', 'Volleyball' ], value: 1 },
         ],
      },
   ],
}

const defaultSetsTwoCirclesDetailed = [
   { sets: [ 'A' ] },
   { sets: [ 'B' ] },
   { sets: [ 'A', 'B' ] },
   { sets: [ 'U' ] },
]

/**
 * @type {Venn.InputDetailedItem[]}
 */
const defaultSetsThreeCirclesDetailed = [
   { sets: [ 'A' ] },
   { sets: [ 'B' ] },
   { sets: [ 'C' ] },
   { sets: [ 'A', 'B' ] },
   { sets: [ 'A', 'C' ] },
   { sets: [ 'B', 'C' ] },
   { sets: [ 'A', 'B', 'C' ] },
   // { key: 'U', sets: [ 'ABC' ] },
]

export default { formatting }
