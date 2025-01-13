import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TextFieldSearchBar from './components/TextFieldSearchBar'
function App() {
  return (
    <>
      <h1 className='text-5xl font-semibold text-center mb-10'>Weather App</h1>
      <TextFieldSearchBar />

    </>
  )
}

export default App
