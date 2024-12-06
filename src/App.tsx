import './App.css';
import About from './ui/about';
import { HeroTestStack } from './ui/hero/hero-test-stack';
import { Parallax } from './ui/parallax-test-framer';

function App() {
  return (
    <main className="min-h-scren">
      <HeroTestStack />
      <About/>
      <div className="min-h-screen bg-slate-400 h-[300lvh]" />
      {/* <Parallax /> */}
      <div className="min-h-screen bg-slate-400" />
    </main>
  );
}

export default App;
