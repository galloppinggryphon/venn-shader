/**
 * Set extension for calculating overlaps.
 *
 * @template T
 * @extends {Set<T>}
 */
export default class ExtSet extends Set {
   /**
    * @param {Set} otherSet
    */
   intersect( otherSet ) {
      return new ExtSet( [ ...this ].filter( ( item ) => otherSet.has( item ) ) )
   }

   /**
    * @param {Set} otherSet
    */
   union( otherSet ) {
      return new ExtSet( [ ...this, ...otherSet ] )
   }

   /**
    * @param {Set} otherSet
    */
   symmDiff( otherSet ) {
      const intersection = this.intersect( otherSet )

      return new ExtSet( [ ...this, ...otherSet ].filter( ( item ) => ! intersection.has( item ) ) )
   }

   /**
    * @param {Set} otherSet
    */
   superset( otherSet ) {
      return [ ...otherSet ].every( ( item ) => this.has( item ) )
   }

   /**
    * @param {Set} otherSet
    */
   subset( otherSet ) {
      return [ ...this ].every( ( item ) => otherSet.has( item ) )
   }
}
