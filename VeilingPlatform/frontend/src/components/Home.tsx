import Shell from "@components/Shell";

export default function Home() {
  return (
    <Shell>
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: "70vh", textAlign: "center" }}
      >
        <h1>Welkom bij Bloemenveiling</h1>
      </div>
    </Shell>
  );
}