export default function SuccessPage() {
  return (
    <main className="mx-auto flex max-w-screen-lg flex-col items-center justify-center gap-16 py-16">
      <section className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-8 text-center">
        <h1 className="text-balance font-serif text-3xl font-normal italic md:text-4xl">
          100% Refund within 90 days
        </h1>

        <p className="text-balance text-xl">
          Potential Health isn't what you thought it was?
        </p>
        <p className="text-balance text-xl">
          We'll refund you 100% of your purchase within 90 days.
        </p>
        <p className="text-balance text-xl">
          Please tell us why you want a refund at{" "}
          <a href="mailto:omar@potentialhealth.io">omar@potentialhealth.io</a>
          and we'll get you sorted.
        </p>
        <p className="text-balance">
          Keep in mind: It could take a few days to process refunds.
        </p>
      </section>
    </main>
  );
}
