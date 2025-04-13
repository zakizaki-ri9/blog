declare global {
  interface Window {
    pagefind?: {
      init: () => void;
      search: (query: string) => Promise<any>;
      UI: {
        new(options: { element: HTMLElement }): any;
      };
    };
  }
}

export function injectPagfind() {
  // すでにスクリプトが読み込まれている場合は何もしない
  if (document.getElementById("pagefind-script")) {
    return;
  }

  // PageFindスクリプトの読み込み
  const script = document.createElement("script");
  script.id = "pagefind-script";
  script.src = "/pagefind/pagefind-ui.js";
  script.onload = () => {
    if (window.pagefind) {
      const search = document.getElementById("search");
      if (search) {
        new window.pagefind.UI({ element: search });
      }
    }
  };
  document.head.appendChild(script);

  // PageFindスタイルの読み込み
  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = "/pagefind/pagefind-ui.css";
  document.head.appendChild(style);
} 