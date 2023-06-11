import { useRef, useState } from 'react'
import ExtSet from '../ext-set'

// const log = console.log.bind( console )

const areaKeys = [ 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v' ]

/**
 * @type {Venn.InputItem[]}
 */
const defaultSetsTwoCircles = [
   [ 'A' ],
   [ 'B' ],
   [ 'A', 'B' ],
]

/**
 * @type {Venn.InputItem[]}
 */
const defaultSetsThreeCircles = [
   [ 'A' ],
   [ 'B' ],
   [ 'C' ],
   [ 'A', 'B' ],
   [ 'A', 'C' ],
   [ 'B', 'C' ],
   [ 'A', 'B', 'C' ],
]

export default function useVennData() {
   /**
    * Data for all registered sets.
    *
    * @type {React.MutableRefObject<Venn.SetDataItem[]>}
    */
   const _sets = useRef()

   /**
    * Canonical set of all area area keys
    *
    * @type {React.MutableRefObject<Venn.AreaListSet>}
    */
   const _areaList = useRef()

   /**
    * Details about areas.
    *
    * @type {React.MutableRefObject<Venn.AreaItem[]>}
    */
   const _areaData = useRef()

   const _selectedState = useState( () => /** @type {Venn.SelectedAreas} */ ( new ExtSet() ) )

   /**
    * Set of selected areas.
    */
   const _selected = _selectedState[ 0 ]

   /**
    * Update selected area set.
    *
    * @example
    * _setSelected((prevState) => (prevState.add('x'), new Set(prevState)))
    */
   const _setSelected = _selectedState[ 1 ]

   const vennData = {
      /**
       * All areas with data.
       */
      get areas() {
         return _areaData.current
      },

      /**
       * String set of areas.
       */
      get areaList() {
         return _areaList.current
      },

      /**
       * String set of selected areas.
       */
      get selectedAreas() {
         return _selected // ?? new ExtSet()
      },

      // selectedAreas: _selected,

      /**
       * String set of currently selected sets.
       */
      get selectedSets() {
         const selectedSets = [ ..._sets.current ].filter( ( set ) => {
            const superset = _selected.superset( set.areas )
            return superset
         } )

         return selectedSets ?? []
      },

      /**
       * All sets.
       */
      get sets() {
         return _sets.current
      },

      /**
       * @param {{datasets?: any, circles?: number}} props
       */
      reset( { datasets, circles } = { datasets: undefined, circles: 3 } ) {
         _sets.current = []// new ExtSet()
         _areaList.current = new ExtSet( [] )
         _areaData.current = []

         if ( _selected.size ) {
            _setSelected( new ExtSet() )
         }

         const defaultData =
            ( circles === 2 && defaultSetsTwoCircles )
            || ( circles === 3 && defaultSetsThreeCircles )

         this.addSets( structuredClone( datasets ?? defaultData ) )
      },

      /**
       * template {Venn.InputDetailedItemAlt} SetType
       * param {Venn.InputDetailedItemAlt[]} datasets
       * @param {Venn.InputItem[]} datasets
       *
       */
      addSets( datasets ) {
         // Add universe
         const universe = [ ...new Set( datasets.flat() ) ]
         datasets.push( [ 'U' ] )

         datasets.forEach( ( set ) => {
            const areaKey = areaKeys[ this.areaList.size ]
            this.areaList.add( areaKey )

            let area = _areaData.current.find( ( l ) => l.key === areaKey )

            if ( ! area ) {
               area = {
                  key: areaKey,
                  label: areaKey,
                  description: '',
                  sets: new ExtSet( set ),
                  value: '',
               }

               area.description = set.length > 1 ? `${area.key }: ${ [ ...area.sets ].join( ' ∩ ' )}` : areaKey

               _areaData.current.push( Object.freeze( area ) )
            }

            let setAreas = [ ...set ]
            const firstSet = setAreas[ 0 ]

            if ( setAreas.length === 1 ) {
               if ( firstSet === 'U' ) {
                  setAreas = universe

                  const _set = {
                     key: 'U',
                     label: universe.join( '' ),
                     areas: new ExtSet( areaKey ),
                  }

                  this.sets.push( Object.freeze( _set ) )
               }
               else {
                  const key = setAreas[ 0 ]
                  const _set = {
                     key,
                     label: key,
                     areas: new ExtSet( areaKey ),
                  }

                  this.sets.push( Object.freeze( _set ) )
               }
            }
            else if ( setAreas.length > 1 ) {
               setAreas.forEach( ( s ) => {
                  const _set = vennData.getSet( s )
                  _set.areas.add( areaKey )
               } )
            }
         } )
      },

      /**
       * @param {string} name
       */
      getSet( name ) {
         const _set = [ ...this.sets ].find( ( s ) => s.key === name )
         return _set
      },

      /**
       * @param  {...string} name
       * @return {Venn.SetDataItem[]}
       */
      getSets( ...name ) {
         const __sets = [ ...this.sets ]
         return name.reduce( ( result, n ) => {
            const set = __sets.find( ( s ) => s.key === n )

            // log( { n, set } )

            if ( set ) {
               result.push( set )
            }
            return result
         }, [] )
      },

      getAllSetAreas() {
         const sets = [ ...this.sets ].reduce( ( result, set ) => {
            if ( set.key === 'U' ) {
               return result
            }

            result.push( ...set.areas )
            return result
         }, [] )

         return [ ...new Set( sets ) ]
      },

      /**
       * @param  {...string} name
       * @return {Venn.AreaItem[]}
       */
      getAreas( ...name ) {
         const __areas = [ ...this.areas ]
         return name.reduce( ( result, n ) => {
            const area = __areas.find( ( a ) => a.key === n )

            if ( area ) {
               result.push( area )
            }
            return result
         }, [] )
      },

      /**
       * @param {Venn.SetDataItem} set
       */
      isSetSelected( set ) {
         const _set = typeof set === 'string' ? this.getSet( set ) : set
         return _selected.superset( _set.areas )
      },

      /**
       * @param {Venn.SetDataItem | string} set
       */
      isSetNotSelected( set ) {
         const _set = typeof set === 'string' ? this.getSet( set ) : set
         return ! _set.areas.intersect( _selected ).size
      },

      /**
       * Check if all areas are selected.
       *
       * @param {...string} area
       */
      isSelected( ...area ) {
         return area.every( ( a ) =>_selected.has( a ) )
      },

      /* *
       * @param {string[]} area
       */
      // isSomeSelected( ...area ) {
      //    return _selected.has( area )
      // },

      /**
       * @param {string} setName
       */
      getSetComplements( setName ) {
         const __sets = new ExtSet( [ ...this.sets ].map( ( s ) => s.key ) )
         const set = this.getSet( setName )
         const diff = __sets.symmDiff( set.areas )
         const sets = this.getSets( ...diff )
         return sets
      },

      /**
       * @param {string} setName
       */
      getAreaComplements( setName ) {
         const set = this.getSet( setName )
         const diff = _areaList.current.symmDiff( set.areas )
         const areas = this.getAreas( ...diff )
         return areas
      },

      /**
       * @param {string} setName
       */
      selectSetComplements( setName ) {
         const _set = this.getSet( setName )
         const areas = this.getAreaComplements( setName )
         this.selectArea( ...areas )
         this.unselectArea( ..._set.areas )
      },

      /**
       * @param {string|Venn.SetDataItem} set
       */
      selectSet( set ) {
         const _set = typeof set === 'string' ? this.getSet( set ) : set
         this.selectArea( ..._set.areas )
      },

      /**
       * @param {string|Venn.SetDataItem} set
       */
      unselectSet( set ) {
         const _set = typeof set === 'string' ? this.getSet( set ) : set
         this.unselectArea( ..._set.areas )
      },

      /**
       * @param  {...(string | Venn.AreaItem)} area
       */
      selectArea( ...area ) {
         area.forEach( ( a ) => {
            const key = typeof a === 'string' ? a : a.key

            if ( ! this.areaList.has( key ) ) {
               return
            }

            _setSelected( ( s ) => ( s.add( key ), new ExtSet( s ) ) )
         } )
      },

      /**
       * @param  {...(string | Venn.AreaItem)} area
       */
      unselectArea( ...area ) {
         area.forEach( ( a ) => {
            const key = typeof a === 'string' ? a : a.key

            if ( ! this.areaList.has( key ) ) {
               return
            }

            _setSelected( ( s ) => ( s.delete( key ), new ExtSet( s ) ) )
         } )
      },

      /**
       * @param {string|Venn.SetDataItem} set
       */
      toggleSet( set ) {
         const _set = typeof set === 'string' ? this.getSet( set ) : set
         const selected = _set.areas.subset( _selected )

         if ( selected ) {
            this.unselectSet( _set )
         }
         else {
            this.selectSet( _set )
         }
      },

      /**
       * @param  {...string} area
       */
      toggleAreas( ...area ) {
         _setSelected( ( set ) => {
            const s = new ExtSet( [ ...set ] )

            area.forEach( ( a ) => {
               if ( ! vennData.areaList.has( a ) ) {
                  return
               }

               if ( s.has( a ) ) {
                  s.delete( a )
               }
               else {
                  s.add( a )
               }
            } )

            return s// new ExtSet( s )
         } )
      },
   }

   return vennData
}
