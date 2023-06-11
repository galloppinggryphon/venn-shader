import { useEffect, useRef } from 'react'
import { Chart, LinearScale, Title, Tooltip } from 'chart.js'
import {
   VennDiagramController,
   ArcSlice,
} from 'chartjs-chart-venn'

Chart.register( VennDiagramController, ArcSlice, LinearScale, Title, Tooltip )

const log = console.log.bind( console )

/** @type {Chart['config']} */
const defaults = {
   // @ts-ignore
   type: VennDiagramController.id,
   options: {
      layout: {
         padding: 30,
      },

      plugins: {
         tooltip: {
            enabled: true,
         },
         title: {
            display: false,
            text: '',
         },
      },

      scales: {
         x: {
            ticks: {
               display: false,
            },
         },
         y: {
            ticks: {
               display: false,
            },
         },
      },
   },
}

/**
 * @param {FormattingConfig} formatting
 * @param {Venn.VennDataControl} vennData
 */
export default function useVennControls( formatting, vennData ) {
   /** @type {React.MutableRefObject<{active?: boolean, selected?: boolean}>} */
   const universe = useRef( {} )

   /** @type {React.MutableRefObject<Partial<FormattingConfig>>} */
   const settings = useRef( {} )

   /** @type {React.MutableRefObject<Chart>} */
   const chartRef = useRef()

   const diagramControls = {
      /**
       * On mouse/keyboard interaction with diagram, update UI and data.
       *
       * @param {*} area
       */
      select( area ) {
         if ( ! chartRef.current ) {
            return
         }

         if ( area === -1 ) {
            // return
            log( 'SELECT >> ', area, [ ...vennData.areaList ].slice( -1 )[ 0 ] )

            this.toggleAreas( -1 )
            vennData.toggleAreas( [ ...vennData.areaList ].slice( -1 )[ 0 ] )
            return
         }

         const name = typeof area === 'number' ? [ ...vennData.areaList ][ area ] : area

         log( 'SELECT >> ', area, name, [ ...vennData.selectedAreas ] )

         // this.toggleAreas( area )
         vennData.toggleAreas( name )
      },

      /**
       * Toggle areas.
       *
       * @param {string | number} area
       */
      toggleAreas( area ) {
         const chart = chartRef.current
         const data = chart.data.datasets[ 0 ]

         const lastIndex = [ ...vennData.areaList ].length - 1
         const index = typeof area === 'string' ? [ ...vennData.areaList ].indexOf( area ) : area

         if ( index === -1 || lastIndex === index ) {
            chart.update()
            return
         }

         const name = [ ...vennData.areaList ][ index ]

         if ( vennData.selectedAreas.has( name ) ) {
            data.backgroundColor[ index ] = settings.current.graphs.backgroundColor[ index ]
         }
         else {
            data.backgroundColor[ index ] = settings.current.selected.background
         }

         chart.update()
      },

      /**
         * Select specified areas in the UI, deselect others.
         *
         * @param  {...any} area
         */
      setSelectedAreas( ...area ) {
         if ( ! chartRef.current ) {
            return
         }

         const chart = chartRef.current
         const data = chart.data.datasets[ 0 ]
         const lastIndex = [ ...vennData.areaList ].length - 1

         vennData.areaList.forEach( ( a ) => {
            const index = [ ...vennData.areaList ].indexOf( a )

            if ( area.includes( a ) ) {
               if ( index === lastIndex ) {
                  universe.current.selected = true
                  chart.update()
                  return
               }

               data.backgroundColor[ index ] = settings.current.selected.background
            }
            else {
               if ( index === lastIndex ) {
                  universe.current.selected = false
                  chart.update()
                  return
               }

               data.backgroundColor[ index ] = settings.current.graphs.backgroundColor[ index ]
            }
         } )

         chart.update()
      },

   }

   const events = {
      onClick: ( _, elements ) => {
         if ( ! elements[ 0 ] ) {
            diagramControls.select( -1 )
         }
         else {
            const { index } = elements[ 0 ]
            diagramControls.select( index )
         }
      },

      onHover: ( e, elements ) => {
         const chart = chartRef.current
         const isOverCanvas = elements ? ! elements.length : false // (elements?.length && true)

         if ( isOverCanvas && ! universe.current.active ) {
            universe.current.active = true
            chart.update()
         }
         else if ( ! isOverCanvas && universe.current.active ) {
            universe.current.active = false
            chart.update()
         }
      },
   }

   function plugin() {
      const offset = 10

      const drawCanvas = ( chart ) => {
         const { ctx } = chart
         ctx.save()
         ctx.globalCompositeOperation = 'destination-over'

         if ( universe.current.selected ) {
            ctx.fillStyle = settings.current.selected.background
         }
         else if ( universe.current.active ) {
            ctx.fillStyle = settings.current.canvas.activeBackground
         }
         else {
            ctx.fillStyle = settings.current.canvas.background
         }

         ctx.fillRect( 0, 0, chart.width, chart.height )
         ctx.restore()
      }

      const drawLabels = ( chart ) => {
         const meta = chart._metasets[ 0 ]._layout

         const { ctx } = chart
         ctx.save()

         ctx.textBaseline = 'middle'
         ctx.textAlign = 'center'
         ctx.textBaseline = 'middle'

         const font = `${settings.current.sets.font.size}px ${settings.current.sets.font.font} `
         ctx.font = font

         if ( vennData.areas.length ) {
            // Add area labels
            meta.intersections.forEach( ( data, i ) => {
               const area = vennData.areas[ i ]

               const val = area.value ?? '' // data[i].value.toLocaleString();
               ctx.fillText( val, data.text.x, data.text.y + offset )
               ctx.fillText(
                  area.key,
                  data.text.x,
                  data.text.y - offset,
               )
            } )

            // Add set labels
            meta.sets.forEach( ( set, i ) => {
               const setData = vennData.sets[ i ]

               ctx.fillText(
                  setData.key,
                  set.text.x,
                  set.text.y,
               )

               // if ( setData.value ) {
               //    ctx.fillText( setData.value, set.text.x, set.text.y + offset )
               // }
            } )
         }

         ctx.textAlign = 'left'
         ctx.textBaseline = 'top'
         ctx.fillText( 'U', offset, offset )

         ctx.textBaseline = 'bottom'
         const u = [ ...vennData.areas ].pop()
         ctx.fillText( u.key, offset, chart.height - offset )

         ctx.restore()
      }

      return {
         id: 'venn_chart_additions',
         beforeDraw: ( chart ) => {
            drawCanvas( chart )
         },
         afterDraw( chart ) {
            // Must draw labels after circles for corrext z-index
            drawLabels( chart )
         },
      }
   }

   /**
    *
    * @param {React.MutableRefObject<HTMLCanvasElement>} canvas
    * @param {Chart['config']['options']} [options]
    */
   function createChart( canvas, options = undefined ) {
      if ( canvas.current === null ) {
         return
      }

      universe.current = {
         selected: false,
         active: false,
      }

      settings.current = structuredClone( formatting )

      if ( chartRef.current ) {
         chartRef.current.destroy()
      }

      settings.current.graphs.backgroundColor = Array( vennData.areaList.size ).fill( formatting.graphs.backgroundColor )

      // log( '+++ CREATE_CHART +++', settings.current.graphs.backgroundColor )

      const tooltips = vennData.areas.map( ( a ) => a.description )
      const datasets = vennData.areas.map( ( { sets, value } ) => ( { sets: [ ...sets ], value } ) )
      datasets.pop()

      /** @type {Chart['config']} */
      const config = {
         ...structuredClone( defaults ),
         plugins: [ plugin() ],
         data: {
            labels: tooltips,
            datasets: [ {
               ...structuredClone( settings.current.graphs ),
               // @ts-ignore
               data: datasets,
            } ],
         },
      }

      config.options.onClick = events.onClick
      config.options.onHover = events.onHover

      // if(options) {}

      const cvs = canvas.current
      cvs.addEventListener( 'mouseout', events.onHover )

      const chart = new Chart( cvs.getContext( '2d' ), config )

      chartRef.current = chart
   }

   useEffect( () => {
      diagramControls.setSelectedAreas( ...vennData.selectedAreas )
   } )

   return {
      createChart( canvas ) {
         createChart( canvas )
      },
      update() {
         chartRef.current.update()
      },
   }
}
