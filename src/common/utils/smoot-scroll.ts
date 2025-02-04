export function easeInOutQuint(t) {
	return t <= 0.5 ? 16 * t ** 5 : 1 + 16 * (--t) ** 5
}
