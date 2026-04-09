const reasons = [
  {
    eyebrow: "Affordable Packages",
    title: "Options that stay practical for real travel budgets",
    body:
      "We help travelers compare safari choices clearly, from budget-friendly group departures to more private upgrades, so the plan fits what you want to spend.",
  },
  {
    eyebrow: "Experienced Tour Guides",
    title: "Guidance shaped by real route and safari knowledge",
    body:
      "Trips run better when timing, wildlife movement, road conditions, and park logistics are understood properly. That local experience helps keep the journey smoother.",
  },
  {
    eyebrow: "Comfortable Transport",
    title: "Cruisers and vans suited to the trip you are taking",
    body:
      "Long road transfers and game-drive days are easier in reliable safari vehicles. We focus on comfortable transport that works for both shared and private travel plans.",
  },
  {
    eyebrow: "Personalized Travel Experiences",
    title: "Itineraries adjusted to your pace, interests, and group",
    body:
      "Whether you are traveling as a couple, family, solo traveler, or group, we shape the experience around the kind of trip you actually want instead of forcing a fixed template.",
  },
];

export function KenniceReasons() {
  return (
    <div className="trust-bar why-tour-grid kennice-reasons-grid">
      {reasons.map((reason) => (
        <div key={reason.title} className="why-tour-card">
          <p className="eyebrow">{reason.eyebrow}</p>
          <strong>{reason.title}</strong>
          <span>{reason.body}</span>
        </div>
      ))}
    </div>
  );
}
