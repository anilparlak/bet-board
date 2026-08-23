import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from "web-vitals";

export function initWebVitals() {
  onCLS(logVitals);
  onINP(logVitals);
  onLCP(logVitals);
  onFCP(logVitals);
  onTTFB(logVitals);
}

function logVitals(metric: Metric) {
  const value =
    metric.name === "CLS"
      ? metric.value.toFixed(3)
      : `${Math.round(metric.value)} ms`;

  console.log(`[Web Vital] ${metric.name}: ${value} (${metric.rating})`);
}
