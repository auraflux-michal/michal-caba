/**
 * llms.txt (https://llmstxt.org): a plain, quotable summary for AI answer engines (GEO).
 * Generated from the same data as the page, so it can never contradict it.
 */
import type { APIRoute } from 'astro';
import { site, sections } from '@/data/site';
import { heroPhrases, notes, roles } from '@/data/content';
import { absoluteUrl } from '@/lib/seo';
import { LUSTRO_TOTAL, lustroSections, lustroStages } from '@/data/lustro';

export const GET: APIRoute = ({ site: siteUrl }) => {
  const home = absoluteUrl('/', siteUrl);
  const body = `# ${site.name}

> ${site.person.summary}

${site.name}: ${site.person.jobTitles.join(', ')}. Motto: "Widzę potencjał ${heroPhrases.map((phrase) => phrase.toLowerCase()).join(', ')}". Projektuje marki, buduje firmy i dostrzega to, czego jeszcze nie ma.

## Role

${roles.map((role) => `- **${role.title}**: ${role.description}`).join('\n')}

## Specjalizacje

${site.person.knowsAbout.map((topic) => `- ${topic}`).join('\n')}

## Auraflux

${site.auraflux.name} (${site.auraflux.homepage}) to studio założone przez ${site.name}. ${site.auraflux.description}

## Filozofia #1metrDalej

Nie musisz zmieniać całego świata. Wystarczy, że przesuniesz coś o jeden metr: siebie, pomysł, firmę, relacje. Nie chodzi o wielką rewolucję, tylko o ruch. A jutro? Jeszcze metr.

## Notes

${notes.map((note) => `- ${note.href ? `[${note.title}](${note.href.split('?')[0]})` : note.title} (${note.readingTime} czytania)`).join('\n')}

## Lustro marki osobistej

Bezpłatna, interaktywna checklista marki osobistej (${absoluteUrl('/lustro', siteUrl)}): ${LUSTRO_TOTAL} punktów w ${lustroSections.length} obszarach (${lustroSections.map((section) => section.title).join(', ')}). Wynik to jeden z etapów: ${lustroStages.map((stage) => stage.name).join(', ')}, oraz obszary z największym potencjałem.

## Kontakt i profile

- Strona: ${home}
- Konsultacja (rezerwacja terminu): ${site.consultationUrl}
${site.socials.map((social) => `- ${social.label}: ${social.href}`).join('\n')}

## Sekcje strony

${sections.map((section) => `- [${section.label}](${home}#${section.id})`).join('\n')}
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
