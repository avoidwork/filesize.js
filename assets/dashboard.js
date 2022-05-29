/**
 * filesize.js dashboard
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @version 2.0.0
 */
(function () {
	"use strict";

	const render = window.requestAnimationFrame,
		result = document.querySelector("#result"),
		input = document.querySelector("#filesize"),
		debounced = new Map(),
		space = "&nbsp;";

	function debounce (id = '', fn = () => void 0, ms = 125) {
		if (debounced.has(id)) {
			clearTimeout(debounced.get(id));
		}

		debounced.set(id, setTimeout(fn, ms));
	}

	function handler () {
		const val = input?.value ?? '';

		if (val !== void 0 && val.length > 0) {
			try {
				result.innerText = filesize(val, {base: input.dataset.base10 === 'true' ? 10 : 2, bits: input.dataset.bits === 'true'});
			} catch (err) {
				result.innerText = err.message;
			}
		} else {
			result.innerHTML = space;
		}
	}

	// Demo filters
	Array.from(document.querySelectorAll(".clickable")).forEach(i => i.addEventListener('click', ev => {
		ev.preventDefault();
		render(() => {
			const param = i.dataset.param;

			i.classList.toggle("icon-check-empty");
			i.classList.toggle("icon-check");
			input.dataset[param] = input.dataset[param] === 'true' ? 'false' : 'true';
			handler();
		});
	}, {capture: false, once: false}));

	// Capturing debounced input (125ms)
	input.addEventListener("input", ev => {
		ev.preventDefault();
		debounce("input", handler, 125);
	}, {capture: false, once: false});

	// Setting copyright year
	document.querySelector("#year").innerText = new Date().getFullYear();
})();
