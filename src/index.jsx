import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { ChakraBaseProvider, extendBaseTheme } from '@chakra-ui/react'
import chakraTheme from '@chakra-ui/theme'

const { Button, Card, Input, Tag } = chakraTheme.components

const theme = extendBaseTheme( {
   components: {
      Button,
      Card,
      Input,
      Tag,
   },
} )

const root = ReactDOM.createRoot( document.getElementById( 'root' ) )
root.render(
   <React.StrictMode>
      <ChakraBaseProvider theme={ theme }>
         <App />
      </ChakraBaseProvider>
   </React.StrictMode>,
)
