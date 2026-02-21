import ErrorBoundary from "../../components/ErrorBoundary";
import FretboardTrainer from "../../components/FretboardTrainer";

export default function AppPage() {
  return (
    <ErrorBoundary>
      <FretboardTrainer />
    </ErrorBoundary>
  );
}
