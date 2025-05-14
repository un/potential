export default function SuccessPage() {
  return (
    <main className="mx-auto flex max-w-screen-lg flex-col items-center justify-center gap-16 py-16">
      <section className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-8 text-center">
        <h1 className="text-balance font-serif text-3xl font-normal italic md:text-4xl">
          Welcome to Potential Health
        </h1>

        <p className="text-balance text-xl">
          You will shortly be added to our TestFlight group.
        </p>
        <p className="text-balance text-xl">
          This is currently a manual process and may take up to 24 hours
          (usually done within 1 hour).
        </p>
        <p className="text-balance text-xl">
          If you do not receive an email within 24 hours, please contact us at{" "}
          <a href="mailto:support@potentialhealth.io">
            omar@potentialhealth.io
          </a>
        </p>
      </section>
    </main>
  );
}
