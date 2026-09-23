import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

type Evidence = {
  id: number;
  type: string;
  source: string;
  status: string;
  timestamp: string;
};

const evidence: Evidence[] = [
  { id: 1, type: "PROCESS", source: "System", status: "Collected", timestamp: "10:41:22" },
  { id: 2, type: "PROCESS", source: "chrome.exe", status: "Collected", timestamp: "10:41:23" },
  { id: 3, type: "NETWORK", source: "TCP :443", status: "Collected", timestamp: "10:41:25" },
  { id: 4, type: "FILE", source: "evidence.zip", status: "Verified", timestamp: "10:42:01" },
  { id: 5, type: "USER", source: "Administrator", status: "Collected", timestamp: "10:42:09" }
];

const examples: Record<string, string> = {
  english:
    'CASE "INC-001"\nCOLLECT PROCESS\nFIND PROCESS WHERE PID > 1000\nCREATE TIMELINE\nREPORT',
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
  const [activeView, setActiveView] = useState("workspace");
  const [selectedEvidence, setSelectedEvidence] = useState("PROCESS");
  const [output, setOutput] = useState("FORAX Studio ready.");
  const [aiInput, setAiInput] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [caseOpen, setCaseOpen] = useState(true);
  const [liveEvidence, setLiveEvidence] = useState<Evidence[]>(evidence);

  const filteredEvidence = useMemo(
    () => evidence.filter((item) => item.type === selectedEvidence || selectedEvidence === "ALL"),
    [selectedEvidence]
  );

  const changeLanguage = (value: string) => {
    setLanguage(value);
    setProgram(examples[value] ?? examples.english);
    setOutput(`Language switched to ${value}.`);
  };

  const validate = () => {
    const lines = program.split("\n").filter(Boolean);
    const valid = lines.length > 0 && lines.some((line) => line.startsWith("CASE"));
    setOutput(
      valid
        ? `Validation successful: ${lines.length} statement(s) detected.`
        : "Validation failed: CASE statement not found."
    );
  };

  const run = async () => {
    setOutput("Executing FORAX program...");
    try {
      const response = await fetch("http://localhost:8787/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: program, language })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setOutput(`Execution failed: ${result.error ?? "Unknown error"}`);
        return;
      }

      setLiveEvidence(result.results.map((item: any, index: number) => ({ id: index + 1, type: item.object ?? item.operation ?? "UNKNOWN", source: item.data?.query ?? item.operation ?? "FORAX", status: item.data?.status ?? "Completed", timestamp: item.timestamp ?? new Date().toISOString() })));
      setOutput(JSON.stringify(result.results, null, 2));
    } catch (error) {
      setOutput(
        `Backend connection failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };
  const newCase = () => {
    setCaseOpen(true);
    setProgram('CASE "NEW-CASE"\nCOLLECT PROCESS\nREPORT');
    setOutput("New forensic case created.");
  };

  const aiSuggest = () => {
    if (!aiInput.trim()) {
      setAiSuggestion("Enter a forensic request first.");
      return;
    }

    const text = aiInput.toLowerCase();
    const lines: string[] = [];

    if (text.includes("collect") && text.includes("process")) {
      lines.push("COLLECT PROCESS");
    }
    if (text.includes("find") && text.includes("process")) {
      lines.push("FIND PROCESS");
    }
    if (text.includes("network")) {
      lines.push("FIND NETWORK_CONNECTION");
    }
    if (text.includes("timeline")) {
      lines.push("CREATE TIMELINE");
    }
    if (text.includes("report")) {
      lines.push("REPORT");
    }

    setAiSuggestion(
      lines.length
        ? lines.join("\n")
        : "No supported deterministic FORAX operation detected."
    );
  };

  const useAiSuggestion = () => {
    if (aiSuggestion && !aiSuggestion.startsWith("No ")) {
      setProgram((current) => `${current}\n${aiSuggestion}`);
      setOutput("AI suggestion inserted into the FORAX editor.");
    }
  };

  return (
    <div className="studio">
      <header className="topbar">
        <div className="brand">
          <div className="brand-main">FORAX</div>
          <div className="brand-sub">FORENSIC STUDIO</div>
        </div>

        <div className="case-title">
          <span>CASE</span>
          <strong>INC-001</strong>
          <b className={caseOpen ? "open" : "closed"}>
            {caseOpen ? "OPEN" : "CLOSED"}
          </b>
        </div>

        <div className="top-actions">
          <span className="ready">? ENGINE READY</span>
          <button onClick={() => setCaseOpen(!caseOpen)}>
            {caseOpen ? "Close Case" : "Open Case"}
          </button>
        </div>
      </header>

      <nav className="main-nav">
        {[
          ["workspace", "Workspace"],
          ["evidence", "Evidence"],
          ["timeline", "Timeline"],
          ["ai", "AI Assistant"],
          ["console", "Console"]
        ].map(([id, label]) => (
          <button
            key={id}
            className={activeView === id ? "nav-active" : ""}
            onClick={() => setActiveView(id)}
          >
            {label}
          </button>
        ))}

        <select value={language} onChange={(e) => changeLanguage(e.target.value)}>
          <option value="english">English</option>
          <option value="tamil">Tamil</option>
          <option value="hindi">Hindi</option>
          <option value="marathi">Marathi</option>
        </select>
      </nav>

      <section className="commandbar">
        <button onClick={newCase}>+ New Case</button>
        <button>Open Evidence</button>
        <button onClick={validate}>? Validate</button>
        <button className="run" onClick={run}>? Run</button>
        <button onClick={() => setOutput("Report generation requested.")}>Generate Report</button>
      </section>

      {activeView === "workspace" && (
        <main className="workspace-grid">
          <aside className="left-panel">
            <h3>CASE EXPLORER</h3>
            <div className="case-node">? INC-001</div>

            {[
              ["PROCESS", "Processes"],
              ["NETWORK", "Network"],
              ["FILE", "Files"],
              ["USER", "Users"],
              ["DEVICE", "Devices"],
              ["MEMORY", "Memory"],
              ["TIMELINE", "Timeline"]
            ].map(([id, label]) => (
              <button
                key={id}
                className={selectedEvidence === id ? "tree-active" : "tree-item"}
                onClick={() => {
                  setSelectedEvidence(id);
                  setActiveView("evidence");
                }}
              >
                ? {label}
              </button>
            ))}
          </aside>

          <section className="editor-panel">
            <div className="panel-header">
              <div>
                <h2>FORAX Editor</h2>
                <span>{language.toUpperCase()} ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ DETERMINISTIC MODE</span>
              </div>
              <span className="readonly">READ-ONLY FORENSICS</span>
            </div>

            <textarea
              value={program}
              spellCheck={false}
              onChange={(e) => setProgram(e.target.value)}
            />

            <div className="editor-status">
              <span>Statements: {program.split("\n").filter(Boolean).length}</span>
              <span>UTF-8</span>
              <span>{language}</span>
            </div>
          </section>

          <aside className="right-panel">
            <div className="panel-header">
              <div>
                <h2>Execution</h2>
                <span>LIVE STATUS</span>
              </div>
            </div>

            <div className="execution-card">
              <div className="success-dot">?</div>
              <strong>Engine Ready</strong>
              <p>{output}</p>
            </div>

            <div className="metrics">
              <div><strong>201</strong><span>Operations</span></div>
              <div><strong>4</strong><span>Languages</span></div>
              <div><strong>7</strong><span>Evidence types</span></div>
              <div><strong>0</strong><span>Errors</span></div>
            </div>
          </aside>
        </main>
      )}

      {activeView === "evidence" && (
        <main className="full-panel">
          <div className="panel-header">
            <div>
              <h2>Evidence Explorer</h2>
              <span>{selectedEvidence} EVIDENCE</span>
            </div>
            <button onClick={() => setSelectedEvidence("ALL")}>Show All</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>TYPE</th>
                <th>SOURCE</th>
                <th>STATUS</th>
                <th>TIMESTAMP</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvidence.map((item) => (
                <tr key={item.id}>
                  <td>#{item.id}</td>
                  <td>{item.type}</td>
                  <td>{item.source}</td>
                  <td><span className="badge">{item.status}</span></td>
                  <td>{item.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      )}

      {activeView === "timeline" && (
        <main className="full-panel">
          <div className="panel-header">
            <div>
              <h2>Forensic Timeline</h2>
              <span>CASE INC-001</span>
            </div>
          </div>

          <div className="timeline">
            {[
              ["10:41:22", "PROCESS", "System process evidence collected"],
              ["10:41:25", "NETWORK", "TCP connection observed on port 443"],
              ["10:42:01", "FILE", "Evidence archive verified"],
              ["10:42:09", "USER", "User evidence collected"]
            ].map(([time, type, description]) => (
              <div className="timeline-item" key={time}>
                <time>{time}</time>
                <div>
                  <strong>{type}</strong>
                  <p>{description}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {activeView === "ai" && (
        <main className="ai-panel">
          <section>
            <div className="panel-header">
              <div>
                <h2>FORAX AI Assistant</h2>
                <span>SUGGESTION ONLY ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ COMPILER REMAINS AUTHORITATIVE</span>
              </div>
            </div>

            <textarea
              className="ai-input"
              placeholder="Example: collect process evidence and create timeline"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
            />

            <div className="ai-actions">
              <button onClick={aiSuggest}>Generate Suggestion</button>
              <button onClick={useAiSuggestion}>Insert into Editor</button>
            </div>
          </section>

          <section className="suggestion">
            <h3>Suggested FORAX</h3>
            <pre>{aiSuggestion || "No suggestion generated yet."}</pre>
          </section>
        </main>
      )}

      {activeView === "console" && (
        <main className="console-panel">
          <div className="console-header">FORAX EXECUTION CONSOLE</div>
          <pre>
{`[FORAX] Studio initialized
[CASE] INC-001
[ENGINE] Ready
[LANGUAGE] ${language}
[STATUS] ${output}`}
          </pre>
        </main>
      )}

      <footer className="footer">
        <span>FORAX v0.3.0</span>
        <span>Deterministic forensic execution</span>
        <span>Authorized analysis only</span>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);



