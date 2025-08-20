import { useState } from "react";

const steps = [
  "Persönliche Daten",
  "Kontaktdaten",
  "Passwort wählen",
  "Fertig!"
];

export default function Register() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function nextStep(e: React.FormEvent) {
    e.preventDefault();
    if (step < steps.length - 1) setStep(step + 1);
  }

  function prevStep() {
    if (step > 0) setStep(step - 1);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Hier Registrierung abschicken
    alert("Registrierung erfolgreich!");
  }

  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-gray-50">
      <form
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-6"
        onSubmit={step === steps.length - 1 ? handleSubmit : nextStep}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Registrierung
        </h2>
        <div className="flex justify-center mb-6">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`px-2 py-1 rounded-full mx-1 text-xs ${
                i === step
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        {step === 0 && (
          <>
            <div>
              <label className="block text-gray-700 mb-1">Vorname:</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Max"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Nachname:</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Mustermann"
              />
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <div>
              <label className="block text-gray-700 mb-1">E-Mail:</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="max@example.com"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Telefon:</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="+49 123 456789"
              />
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div>
              <label className="block text-gray-700 mb-1">Passwort:</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Passwort bestätigen:</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="••••••••"
              />
            </div>
          </>
        )}
        {step === 3 && (
          <div className="text-center text-green-600 font-semibold">
            Alle Daten eingegeben! <br />
            <span className="text-sm text-gray-500">Jetzt Registrierung abschließen.</span>
          </div>
        )}
        <div className="flex justify-between mt-6">
          {step > 0 && (
            <button
              type="button"
              onClick={prevStep}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Zurück
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ml-auto"
          >
            {step === steps.length - 1 ? "Registrieren" : "Weiter"}
          </button>
        </div>
      </form>
    );
  
    </div>
  );}