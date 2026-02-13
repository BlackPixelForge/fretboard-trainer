import ErrorBoundary from "../components/ErrorBoundary";
import FretboardTrainer from "../components/FretboardTrainer";

export default function Home() {
  return (
    <ErrorBoundary>
      <FretboardTrainer />
    </ErrorBoundary>
  );
}
