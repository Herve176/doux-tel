
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50">
      <div className="text-6xl font-bold text-blue-600 mb-4">404</div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Seite nicht gefunden</h1>
      <p className="text-gray-500 mb-6 text-center">
        Die angeforderte Seite existiert nicht oder wurde verschoben.<br />
        Bitte überprüfe die URL oder kehre zur Startseite zurück.
      </p>
      <a
        href="/"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Zurück zur Startseite
      </a>
    </div>
  );
}