import Shell from "../components/Shell";

function App() {
    return (
        <Shell>
            <div style={{ fontFamily: "Arial", textAlign: "center", marginTop: "50px" }}>
                <h1>Welkom bij mijn React pagina!</h1>
                <p>Dit is een simpele JSX-pagina.</p>
                <button
                onClick={() => alert("Hallo daar!")}>Klik mij</button>
            </div>
        </Shell>
  );
}

export default App;