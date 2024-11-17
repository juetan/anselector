import { an } from "./select";
import { AnSelector } from "./selector";

export interface AnSelectCSS {
  (id: string, content?: string): string | undefined;
  index: number;
  map: Map<string, AnSelector>;
  remove(id: string): void;
  clear(): void;
}

export const css = function (id: string, content?: string) {
  if (content === void 0) {
    content = id;
    id = `ancss${++css.index}`;
  }
  if (css.map.has(id)) {
    return;
  }
  if (document.getElementById(id)) {
    return;
  }
  const el = an(`<style id=${id}>${content}</style>`);
  el.parent(document.head);
  css.map.set(id, el);
  return id;
} as AnSelectCSS;

css.index = 0;
css.map = new Map<string, AnSelector>();

css.remove = function (id: string) {
  if (!css.map.has(id)) {
    return;
  }
  css.map.get(id)!.parent(null);
  css.map.delete(id);
};

css.clear = function () {
  for (const $el of css.map.values()) {
    $el.parent(null);
  }
  css.map.clear();
};
