import './App.css';
import About from './ui/about';
import { Hero } from './ui/hero/hero';

function App() {
  return (
    <main className="min-h-scren bg-slate-50">
      <Hero />
      <div className="mt-[12rem]" />
      <About/>
      <div className="min-h-screen bg-slate-50" />
    </main>
  );
}

export default App;
