import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import { MapPin, Send } from "lucide-react";
import "./styles.css";

type Suggestion = {
  value: string;
  label: string;
  fullAddress: string;
  hierarchy: {
    village: string;
    subDistrict: string;
    district: string;
    state: string;
    country: string;
  };
};

const fallback: Suggestion[] = [
  {
    value: "village_id_525002",
    label: "Manibeli",
    fullAddress: "Manibeli, Akkalkuwa, Nandurbar, Maharashtra, India",
    hierarchy: { village: "Manibeli", subDistrict: "Akkalkuwa", district: "Nandurbar", state: "Maharashtra", country: "India" }
  },
  {
    value: "village_id_525003",
    label: "Dhankhedi",
    fullAddress: "Dhankhedi, Akkalkuwa, Nandurbar, Maharashtra, India",
    hierarchy: { village: "Dhankhedi", subDistrict: "Akkalkuwa", district: "Nandurbar", state: "Maharashtra", country: "India" }
  }
];

function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selected, setSelected] = useState<Suggestion | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || "/v1";
  const apiKey = import.meta.env.VITE_API_KEY || "ak_demo_public_key_for_presentations";

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    fetch(`${apiUrl}/autocomplete?q=${encodeURIComponent(query)}`, {
      headers: { "X-API-Key": apiKey },
      signal: controller.signal
    })
      .then((response) => response.ok ? response.json() : Promise.reject(response))
      .then((body) => setSuggestions(body.data))
      .catch(() => setSuggestions(fallback.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))));
    return () => controller.abort();
  }, [apiKey, apiUrl, query]);

  const addressFields = useMemo(() => selected?.hierarchy || {
    village: "",
    subDistrict: "",
    district: "",
    state: "",
    country: "India"
  }, [selected]);

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-8 text-slate-900">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col justify-center">
          <div className="mb-5 grid h-12 w-12 place-items-center rounded bg-teal-700 text-white">
            <MapPin size={24} />
          </div>
          <h1 className="text-4xl font-semibold leading-tight">Village API demo</h1>
          <p className="mt-4 max-w-xl text-lg text-slate-600">
            A contact form using live village autocomplete and standardized address hierarchy.
          </p>
        </div>

        <form
          className="rounded border border-slate-200 bg-white p-5 shadow-sm"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full Name" placeholder="Aarav Sharma" />
            <Field label="Email Address" type="email" placeholder="aarav@example.com" />
            <Field label="Phone Number" placeholder="+91 98765 43210" />
            <div className="relative">
              <label className="mb-1 block text-sm font-medium">Village / Area</label>
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelected(null);
                }}
                className="w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-teal-700"
                placeholder="Start typing, e.g. Mani"
              />
              {suggestions.length > 0 && !selected && (
                <div className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded border border-slate-200 bg-white shadow-lg">
                  {suggestions.map((item) => (
                    <button
                      type="button"
                      key={item.value}
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                      onClick={() => {
                        setSelected(item);
                        setQuery(item.label);
                        setSuggestions([]);
                      }}
                    >
                      <span className="font-medium">{item.label}</span>
                      <span className="block text-xs text-slate-500">{item.hierarchy.subDistrict}, {item.hierarchy.district}, {item.hierarchy.state}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Field label="Sub-District" value={addressFields.subDistrict} readOnly />
            <Field label="District" value={addressFields.district} readOnly />
            <Field label="State" value={addressFields.state} readOnly />
            <Field label="Country" value={addressFields.country} readOnly />
            <label className="md:col-span-2">
              <span className="mb-1 block text-sm font-medium">Message</span>
              <textarea className="min-h-28 w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-teal-700" placeholder="Tell us what you need delivered" />
            </label>
          </div>
          {selected && <p className="mt-4 rounded bg-teal-50 px-3 py-2 text-sm text-teal-800">{selected.fullAddress}</p>}
          {submitted && <p className="mt-4 rounded bg-emerald-50 px-3 py-2 text-sm text-emerald-800">Demo form submitted with standardized address data.</p>}
          <button className="mt-5 inline-flex items-center gap-2 rounded bg-teal-700 px-4 py-2 font-medium text-white hover:bg-teal-800">
            <Send size={17} />
            Submit
          </button>
        </form>
      </section>
    </main>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label>
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <input {...props} className="w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-teal-700 disabled:bg-slate-50" />
    </label>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
