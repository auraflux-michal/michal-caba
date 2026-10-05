/**
 * Decodes ui/EmailLink addresses (base64 of the reversed address) into real mailto: links.
 * Runs on boot, independent of motion settings.
 */
export function initEmailLinks() {
  document.querySelectorAll<HTMLAnchorElement>('a[data-email]').forEach((link) => {
    const bytes = Uint8Array.from(atob(link.dataset.email ?? ''), (char) => char.charCodeAt(0));
    const address = [...new TextDecoder().decode(bytes)].reverse().join('');
    if (!address.includes('@')) return;
    link.href = `mailto:${address}`;
    link.removeAttribute('data-email');
  });
}
