import { getSeo } from "@/lib/api";
import Wrapper from "../layout/Wrapper";

export default async function SeoText({ locale = "nl" }) {
  const seo = await getSeo(locale);

  if (!seo?.length) return null;

  return (
    <section className="bg-bg-primary py-24 max-sm:py-12">
      <Wrapper>
        {seo.map((item) => (
          <div
            key={item.id}
            className="
            prose prose-invert max-w-none
            [&_p]:text-md
          [&_p]:text-text-secondary
            [&_p]:leading-relaxed
            [&_p]:mb-6

            [&_h2]:text-text-primary
            [&_h2]:text-4xl
            [&_h2]:font-bold
            [&_h2]:uppercase
            [&_h2]:mb-6
            max-sm:[&_h2]:text-2xl

            [&_h3]:text-text-primary
            [&_h3]:text-2xl
            [&_h3]:font-semibold
            [&_h3]:mb-5
            max-sm:[&_h3]:text-xl

            [&_ul]:text-text-secondary
            [&_ul]:list-disc
            [&_ul]:pl-5
            [&_ul]:mb-6
            [&_ul]:space-y-3

            [&_li]:text-text-secondary
            [&_li]:text-md
            [&_li]:leading-relaxed

            [&_strong]:text-text-primary
            [&_strong]:font-semibold

            [&_a]:text-text-accent
            [&_a]:hover:text-text-primary
            [&_a]:transition-colors
          "
            dangerouslySetInnerHTML={{
              __html: item.content.rendered,
            }}
          />
        ))}
      </Wrapper>
    </section>
  );
}
