import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const examples: Record<string, string> = {
  english:
    'CASE "INC-001"\nCOLLECT PROCESS\nFIND PROCESS\nCREATE TIMELINE\nREPORT',
  tamil:
    '?????? "INC-001"\n????? ?????????\n????????? ?????????\n????????? ????????\n???????',
  hindi:
    '??? "INC-001"\n?????? ?????????\n??? ?????????\n???? ???????\n???????',
  marathi:
    '?????? "INC-001"\n?????? ?????????\n??? ?????????\n???? ??? ???????\n?????'
};

function App() {
  const [language, setLanguage] = useState("english");
  const [program, setProgram] = useState(examples.english);
  const [output, setOutput] = useState("Ready.");
  const [activePanel, setActivePanel] = useState("Processes");

  const changeLanguage = (value: string) => {
    setLanguage(value);
    setProgram(examples[value] ?? examples.english);
    setOutput(`Language changed to ${value}.`);
  };

  const validate = () => {
    setOutput("FORAX validation requested. Compiler validation integration is the next Studio milestone.");
  };

  const run = () => {
    setOutput("FORAX execution requested. Runtime integration is the next Studio milestone.");
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <div className="brand">FORAX</div>
          <div className="subtitle">Forensic Studio</div>
        </div>
        <div className="header-status">
          <span className="status-dot" />
          Ready
        </div>
      </header>

      <nav className="toolbar">
        <button>New Case</button>
        <button>Open Case</button>
        <button onClick={validate}>Validate</button>
        <button className="run-button" onClick={run}>Run</button>

        <select
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
        >
          <option value="english">English</option>
          <option value="tamil">Tamil</option>
          <option value="hindi">Hindi</option>
          <option value="marathi">Marathi</option>
        </select>
      </nav>

      <div className="case-bar">
        <span>CASE</span>
        <strong>INC-001</strong>
        <span className="case-state">Open</span>
      </div>

      <main className="workspace">
        <aside className="sidebar">
          <h3>Evidence</h3>

          {[
            "Processes",
            "Network",
            "Files",
            "Users",
            "Devices",
            "Memory",
            "Timeline"
          ].map((item) => (
            <button
              key={item}
              className={activePanel === item ? "evidence active" : "evidence"}
              onClick={() => setActivePanel(item)}
            >
              {item}
            </button>
          ))}
        </aside>

        <section className="editor">
          <div className="panel-title">
            <h2>FORAX Program</h2>
            <span>{language.toUpperCase()}</span>
          </div>

          <textarea
            spellCheck={false}
            value={program}
            onChange={(e) => setProgram(e.target.value)}
          />

          <div className="editor-footer">
            <span>Deterministic compiler</span>
            <span>Read-only forensic operations</span>
          </div>
        </section>

        <aside className="results">
          <div className="panel-title">
            <h2>{activePanel}</h2>
            <span>RESULTS</span>
          </div>

          <div className="result-box">
            <div className="result-status">? {output}</div>
          </div>

          <div className="result-info">
            <div><span>Case</span><strong>INC-001</strong></div>
            <div><span>Language</span><strong>{language}</strong></div>
            <div><span>Panel</span><strong>{activePanel}</strong></div>
          </div>
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
