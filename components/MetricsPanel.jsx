export default function MetricsPanel({ stats }) {
  return (
    <div className="p-4 rounded border shadow w-full max-w-sm">
      <h4 className="font-bold mb-2">🧠 Session Stats</h4>
      <ul className="text-sm space-y-1">
        <li>Distracted Seconds: {stats.distraction_seconds}</li>
        <li>Looked Away: {stats.looked_away_count}</li>
        <li>Phone Detected: {stats.phone_detected_count}</li>
        <li>Idle Timeouts: {stats.idle_timeout_count}</li>
        <li>Tab Switches: {stats.tab_switch_count}</li>
      </ul>
    </div>
  );
}
