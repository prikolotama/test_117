"use client";
import { useEffect } from "react";

/** Only layout coordinates cross the iframe boundary; answers and contacts do not. */
export function EmbedBridge() {
  useEffect(() => {
    if (window.parent === window || !document.referrer) return;
    const parentOrigin = new URL(document.referrer).origin;
    const root = document.getElementById("checku-app");
    if (!root) return;
    let previousHeight = 0;
    let frame = 0;
    const send = (data: object) => window.parent.postMessage(data, parentOrigin);
    const resize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const height = Math.ceil(root.getBoundingClientRect().height);
        if (height !== previousHeight) {
          previousHeight = height;
          send({ type: "checku:resize", height });
        }
      });
    };
    const step = () => send({ type: "checku:scroll", top: 0 });
    const click = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (!link || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (target) {
        event.preventDefault();
        send({ type: "checku:scroll", top: target.getBoundingClientRect().top + window.scrollY });
      }
    };
    document.documentElement.dataset.embedded = "true";
    const init = (event: MessageEvent) => {
      if (event.source === window.parent && event.origin === parentOrigin && event.data?.type === "checku:viewport") {
        const { top, height } = event.data;
        if (Number.isFinite(top) && Number.isFinite(height) && height > 0) {
          document.documentElement.style.setProperty("--embed-top", `${Math.max(0, top)}px`);
          document.documentElement.style.setProperty("--embed-height", `${height}px`);
        }
      }
      if (event.source === window.parent && event.origin === parentOrigin && event.data?.type === "checku:init") {
        previousHeight = 0;
        resize();
      }
    };
    const observer = new ResizeObserver(resize);
    observer.observe(root);
    window.addEventListener("message", init);
    window.addEventListener("checku:step", step);
    document.addEventListener("click", click);
    resize();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("message", init);
      window.removeEventListener("checku:step", step);
      document.removeEventListener("click", click);
    };
  }, []);
  return null;
}
