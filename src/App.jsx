import './App.css'
import { useRef, useEffect, useState, Fragment } from 'react'
import {
   Box,
   Button,
   ButtonGroup,
   Center,
   // Card,
   // CardBody,
   Container,
   FormControl,
   // FormLabel,
   Grid,
   GridItem,
   HStack,
   // Input,
   // Tag,
   Text,
   VStack,
} from '@chakra-ui/react'

import settings from './config'
import useVennControls from './venn-controls'
import useVennData from './venn-data/venn-data'
import { useSignal } from './hooks'

function App() {
   const canvas = useRef( null )
   const isMounted = useRef( false )
   const [ signal, setSignal ] = useSignal()
   const [ circles, _setCircles ] = useState( 2 )

   const vennData = useVennData()
   const vennControls = useVennControls( settings.formatting, vennData )

   if ( ! vennData.areaList ) {
      vennData.reset( { circles } )
   }

   const setCircles = ( n ) => {
      _setCircles( n )
      setSignal()
      vennData.reset( { circles: n } )
   }

   const reset = () => {
      setSignal()
      vennData.reset( { circles } )
   }

   useEffect( () => {
      if ( isMounted.current ) {
         vennControls.createChart( canvas )
      }
   }, [ signal ] )

   useEffect( () => {
      if ( ! isMounted.current ) {
         isMounted.current = true
      }
      else {
         vennControls.update()
      }
   }, [ JSON.stringify( vennData.selectedAreas ) ] )

   return (
      <div className="App">
         <Grid templateColumns="repeat(3, 1fr)" className="frame">
            <GridItem bg="#282c34" color="white">
               <Container p="50px">
                  <Box>
                     <header className="App-header">
                        <h1>Venn Diagram Shading Tool</h1>
                     </header>
                     <Box>
                        <Text color="gray.400">v0.1</Text>
                     </Box>
                  </Box>
                  { vennData.areaList &&
                     <Fragment>
                        <Box mt={ 8 } mb={ 10 }>
                           <Center>
                              <HStack spacing={ 2 }>
                                 <ButtonGroup isAttached spacing='0' size="sm" variant='outline' colorScheme='teal'>
                                    <Button onClick={ () => setCircles( 2 ) } variant={ circles === 2 ? 'solid' : 'outline' }>
                                       Two Sets
                                    </Button>
                                    <Button onClick={ () => setCircles( 3 ) } variant={ circles === 3 ? 'solid' : 'outline' }>
                                       Three Sets
                                    </Button>
                                 </ButtonGroup>
                                 <Button bg="gray.400" size='sm' onClick={ reset }>
                                    Reset
                                 </Button>
                              </HStack>
                           </Center>
                        </Box>
                        <FormControl>
                           <VStack spacing="30px">
                              <VStack spacing="20px">
                                 <Box>
                                    <Box mb="3">
                                       <Text>Sets</Text>
                                    </Box>
                                    <SetToggles vennData={ vennData } />
                                 </Box>
                                 <Box>
                                    <Box mb="3">
                                       <Text>Areas</Text>
                                    </Box>
                                    <SetAreas vennData={ vennData } />
                                 </Box>
                              </VStack>
                              <HStack spacing="20px">
                                 <Box>
                                    <Box mb="3">
                                       <Text>Set complements</Text>
                                    </Box>
                                    <SetComplementToggles vennData={ vennData } />
                                 </Box>
                              </HStack>
                           </VStack>
                        </FormControl>
                        <VStack>
                           <HStack mt="60px" spacing="10px">
                              <Box minW="30px">
                                 <svg viewBox="0 0 1024 1024" className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M789.333333 853.333333H234.666667l-128 128V256c0-70.4 57.6-128 128-128h554.666666c70.4 0 128 57.6 128 128v469.333333c0 70.4-57.6 128-128 128z" fill="#2196F3"></path><path d="M469.333333 426.666667h85.333334v234.666666h-85.333334z" fill="#FFFFFF"></path><path d="M512 320m-42.666667 0a42.666667 42.666667 0 1 0 85.333334 0 42.666667 42.666667 0 1 0-85.333334 0Z" fill="#FFFFFF"></path></g></svg>
                              </Box>
                              <Text color="gray.400" as="small"><b>Created by Bjornar Egede-Nissen</b></Text>
                           </HStack>
                           <Text color="gray.400" as="small">I created this basic tool to visualize Venn diagrams to help with homework in discrete mathematics.</Text>
                           <small><a href="https://github.com/galloppinggryphon/venn-shader">Github Repository ▷</a></small>
                        </VStack>
                     </Fragment>
                  }
               </Container>
            </GridItem>
            <GridItem colSpan={ 2 }>
               <Container>
                  <div className="diagram-container">
                     <canvas id="canvas" ref={ canvas } />
                  </div>
               </Container>
            </GridItem>
         </Grid>
      </div>
   )
}

/**
 * @param {{ vennData: Venn.VennDataControl } } props
 */
function SetToggles( { vennData } ) {
   return (
      <ButtonGroup spacing='1' size="sm" variant='solid' colorScheme='teal'>
         { [ ...vennData.sets ].map( ( set ) => {
            let onClick, name, isSelected

            if ( set.key === 'U' ) {
               const areas = vennData.getAllSetAreas()

               name = vennData.sets.length === 3 ? 'AB' : `ABC`
               isSelected = vennData.isSelected( ...areas )

               onClick = () => {
                  if ( isSelected ) {
                     vennData.unselectArea( ...areas )
                  }
                  else {
                     vennData.selectArea( ...areas )
                  }
               }
            }
            else {
               onClick = () => {
                  vennData.toggleSet( set )
               }

               name = set.key
               isSelected = vennData.isSetSelected( set )
            }

            return (
               <Button key={ set.key } colorScheme={ isSelected ? 'teal' : 'gray' } onClick={ onClick }>
                  { name }
               </Button>
            )
         } ) }
      </ButtonGroup>
   )
}

/**
 * @param {{ vennData: Venn.VennDataControl } } props
 */
function SetAreas( { vennData } ) {
   return (
      <ButtonGroup spacing='1' size="sm" variant='solid' colorScheme='teal'>
         { [ ...vennData.areaList ].map( ( area ) => {
            return (
               <Button key={ area } colorScheme={ vennData.isSelected( area ) ? 'teal' : 'gray' } onClick={ () => {
                  vennData.toggleAreas( area )
               } }>
                  { area }
               </Button>
            )
         } ) }
      </ButtonGroup>
   )
}

/**
 * @param {{ vennData: Venn.VennDataControl } } props
 */
function SetComplementToggles( { vennData } ) {
   return (
      <ButtonGroup spacing='1' size="sm" variant='solid' colorScheme='teal'>
         { [ ...vennData.sets ].filter( ( set ) => set.key !== 'U' ).map( ( set ) => {
            return (
               <Button key={ set.key } colorScheme={ vennData.isSetNotSelected( set ) ? 'teal' : 'gray' } onClick={ () => {
                  // vennData.toggleAreas(set)
                  vennData.selectSetComplements( set.key )
               } }>
                  { `${set.key }'` }
               </Button>
            )
         } ) }
      </ButtonGroup>
   )
}

export default App
