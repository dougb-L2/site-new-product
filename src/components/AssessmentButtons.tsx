"use client";

export function ScrollToAssessmentButton({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <button
      onClick={() => {
        window.location.href = '/assessment';
      }}
      className={className}
    >
      {children}
    </button>
  );
}

export function StartAssessmentButton({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <button
      onClick={() => {
        window.location.href = '/assessment';
      }}
      className={className}
    >
      {children}
    </button>
  );
}
