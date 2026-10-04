/**
 * Lleva un elemento al tope de la pantalla del teléfono. No se usa
 * `scrollIntoView` porque scrollea todos los ancestros y movería la página entera.
 */
export function scrollWithinScreen(el: HTMLElement | null, offset = 12) {
	const screen = el?.closest<HTMLElement>('[data-phone-screen]');
	if (!el || !screen) return;

	const top =
		el.getBoundingClientRect().top -
		screen.getBoundingClientRect().top +
		screen.scrollTop -
		offset;

	screen.scrollTo({ top, behavior: 'smooth' });
}
