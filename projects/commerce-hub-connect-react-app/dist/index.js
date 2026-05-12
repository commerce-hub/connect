import { useEffect as e, useRef as t } from "react";
import { mount as n } from "commerce-hub-connect-web-sdk";
import { jsx as r } from "react/jsx-runtime";
//#region src/commerce-hub-connect-react-binding.tsx
function i({ interaction: i, configuration: o, whiteLabel: s, replaceContents: c = !0, environment: l, className: u, onMountError: d }) {
	let f = t(null), p = t(null), m = t(Promise.resolve()), h = t(!1), g = t({
		interaction: i,
		configuration: o,
		whiteLabel: s,
		replaceContents: c,
		environment: l,
		className: u,
		onMountError: d
	});
	return g.current = {
		interaction: i,
		configuration: o,
		whiteLabel: s,
		replaceContents: c,
		environment: l,
		className: u,
		onMountError: d
	}, e(() => (h.current = !0, () => {
		h.current = !1, m.current = m.current.finally(async () => {
			p.current?.destroy(), p.current = null;
		});
	}), []), e(() => {
		h.current && (m.current = m.current.then(async () => {
			let e = f.current;
			if (!e) return;
			let t = g.current, r = {
				interaction: t.interaction,
				configuration: t.configuration,
				whiteLabel: t.whiteLabel,
				replaceContents: t.replaceContents
			};
			if (!p.current) {
				p.current = await n(e, r, t.environment);
				return;
			}
			await p.current.update(r, t.environment);
		}).catch((e) => {
			let t = a(e);
			g.current.configuration.onError(t), g.current.onMountError?.(t);
		}));
	}, [
		i,
		o,
		s,
		c,
		l,
		d
	]), /* @__PURE__ */ r("div", {
		ref: f,
		className: u,
		"data-commerce-hub-connect-react-binding": "true"
	});
}
function a(e) {
	return o(e) ? e : {
		message: e instanceof Error ? e.message : "Unable to mount Commerce Hub Connect React binding.",
		stage: "mount",
		cause: e
	};
}
function o(e) {
	return !!(e && typeof e == "object" && "stage" in e && typeof e.stage == "string" && "message" in e && typeof e.message == "string");
}
//#endregion
export { i as CommerceHubConnectReactBinding };
