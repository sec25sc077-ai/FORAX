import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

function App() {
  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>FORAX Forensic Studio</h1>
          <span>Multilingual deterministic forensic workspace</span>
        </div>
        <div className="status">? Ready</div>
      </header>

      <section className="toolbar">
        <button>New Case</button>
        <button>Open Case</button>
        <button>Run</button>
        <button>Validate</button>
        <select defaultValue="english">
          <option value="english">English</option>
          <option value="tamil">Tamil</option>
          <option value="hindi">Hindi</option>
          <option value="marathi">Marathi</option>
        </select>
      </section>

      <main className="workspace">
        <aside className="sidebar">
          <h2>Evidence</h2>
          <div>Processes</div>
          <div>Network</div>
          <div>Files</div>
          <div>Users</div>
          <div>Devices</div>
          <div>Memory</div>
          <div>Timeline</div>
        </aside>

        <section className="editor">
          <h2>FORAX Program</h2>
          <textarea
            spellCheck={false}
            defaultValue={'CASE "INC-001"\\nCOLLECT PROCESS\\nFIND PROCESS\\nCREATE TIMELINE\\nREPORT'}
          />
        </section>

        <aside className="results">
          <h2>Results</h2>
          <p>Execution results will appear here.</p>
        </aside>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
