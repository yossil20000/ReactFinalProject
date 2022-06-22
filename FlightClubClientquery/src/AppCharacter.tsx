import React from 'react';
import './App.css';
import CharacterApp from './Components/Character/Character';

console.log("process.env.REACT_APP_IS_AXIOS_MOCK",process.env.REACT_APP_IS_AXIOS_MOCK) // remove this after you've confirmed it working

function App() {
  return (
    <h1 className="text-3xl bg-primary/75 text-[#de6e6e] underline">
      Hello world!
      <CharacterApp/>
    </h1>
  );
}

export default App;
