import './App.css';
import { AppNavBar } from './components/app.navbar';
import About from './ui/about';
import CharacterGrid from './ui/character-grid/character-grid';
import { Hero } from './ui/hero/hero';

function App() {
  return (
    <main className="min-h-screen bg-[#141414]">
      <Hero />
      <div className="mt-[12rem]" />
      <About/>  
      <div className="mt-[12rem]" />
      <CharacterGrid/> 
      <AppNavBar/>
    </main>
  );
}

export default App;
