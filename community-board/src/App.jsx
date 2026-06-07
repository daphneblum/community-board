import './App.css';
import Resource from './components/resource';
import { resources } from './constants';
import BubbleBackground from './components/BubbleBackground.jsx';

const App = () => {

  return (
    <div className="App">
      <BubbleBackground />
      <h1>Creative Coding Resources</h1>
      <p>Welcome to the Creative Coding Resources community board! Here you can find resources related to creative coding, including tutorials, libraries, tools, and more. Whether you're a beginner or an experienced coder, this is the place to discover new ideas and connect with others in the creative coding community.</p>

      <div className="featured-example">
        <h2>Code as a Creative Medium</h2>
        <p>Here's an example of what you can make!</p>
        <iframe
          src="https://threejs.org/examples/webgl_animation_skinning_ik"
          width="100%"
          height="500px"
          style={{ border: "none", borderRadius: "8px" }}
        />
      </div>

      <div className="resource-grid">
        {resources.map((resource, index) => (
          <Resource key={index} {...resource} />
        ))}
      </div>
    </div>
  )
}

export default App