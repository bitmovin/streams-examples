import { FileUpload } from "./FileUpload";
import "./App.css";

// Replace with your Bitmovin API key
const API_KEY = "YOUR_API_KEY";

function App() {
  return (
    <div className="App">
      <h2>Streams file upload</h2>
      <FileUpload apiKey={API_KEY} />
    </div>
  );
}

export default App;
