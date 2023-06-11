import { useRef, useState } from 'react'

/**
 * Trigger signals.
 *
 * @param {boolean} update Trigger iteration.
 * @return {[ signal: number, sendSignal: () => void, hasChanged: () => boolean]}
 */
export function useSignal( update = false ) {
   const signal = useRef( 0 )
   const prevSignal = useRef( 0 )

   const [ __, setTriggerSignal ] = useState( 0 )

   if ( update ) {
      prevSignal.current = signal.current
      signal.current++
   }

   const sendSignal = () => {
      prevSignal.current = signal.current
      signal.current++
      setTriggerSignal( signal.current )
   }

   const hasChanged = () => {
      const different = prevSignal.current !== signal.current
      prevSignal.current = signal.current
      return different
   }

   return [ signal.current, sendSignal, hasChanged ]
}
