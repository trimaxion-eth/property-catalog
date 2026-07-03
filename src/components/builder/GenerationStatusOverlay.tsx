type GenerationStatusOverlayProps = {
  isGenerating: boolean;
  error: string | null;
  onRetry?: () => void;
};

export function GenerationStatusOverlay({
  isGenerating,
  error,
  onRetry,
}: GenerationStatusOverlayProps) {
  if (!isGenerating && !error) return null;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/90 p-6 backdrop-blur-sm">
      {isGenerating ? (
        <div className="text-center">
          <div
            className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600"
            role="status"
            aria-label="Generating website"
          />
          <p className="mt-4 text-sm font-medium text-text">
            Generating your website…
          </p>
          <p className="mt-1 text-xs text-text-muted">
            Writing copy for your pages and rooms. This may take a minute.
          </p>
        </div>
      ) : (
        <div className="max-w-xs text-center">
          <p className="text-sm font-medium text-red-700">Generation failed</p>
          <p className="mt-2 text-sm text-text-muted">{error}</p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 rounded-button bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Try again
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
