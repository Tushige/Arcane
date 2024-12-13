import './App.css';
import About from './ui/about';
import { Carousel } from './ui/carousel/carousel';
import CharacterGrid from './ui/character-grid/character-grid';
import { Characters } from './ui/characters/characters';
import { CharactersJS } from './ui/characters/characters-js';
import { Hero } from './ui/hero/hero';

function App() {
  return (
    <main className="min-h-scren bg-[#141414]">
      <Hero />
      <div className="mt-[12rem]" />
      <About/>  
      <div className="mt-[12rem]" />
      <CharacterGrid/> 
      <div className="min-h-screen">
        more content
      </div>
    </main>
  );
}

export default App;
