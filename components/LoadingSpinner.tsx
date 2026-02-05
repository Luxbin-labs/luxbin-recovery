export default function LoadingSpinner({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="w-10 h-10 border-3 border-luxbin-border border-t-luxbin-gold rounded-full animate-spin" />
      {message && <p className="text-luxbin-muted text-sm">{message}</p>}
    </div>
  );
}
