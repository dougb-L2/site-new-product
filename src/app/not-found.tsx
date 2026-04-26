import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-6xl font-extrabold text-learn2-orange mb-6">404</h1>
        <p className="text-xl text-learn2-text mb-8">
          This page doesn't exist.
        </p>
        <Link href="/" className="btn-primary text-base">
          Go Home
        </Link>
      </div>
    </section>
  );
}
