export default function HeadingBox({ accent, title }) {
  return (
    <>
      <h4 className="text-text-accent text-sm uppercase mb-3 tracking-widest">
        {accent}
      </h4>
      <h2 className="text-text-primary text-4xl font-bold uppercase mb-6 max-sm:text-2xl">
        {title}
      </h2>
    </>
  );
}
