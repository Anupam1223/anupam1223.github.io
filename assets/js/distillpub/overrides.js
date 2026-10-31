$(window).on("load", function () {
  document.querySelectorAll("d-footnote").forEach(function (footnote) {
    footnote.shadowRoot.querySelector("sup > span").setAttribute("style", "color: var(--global-theme-color);");
    footnote.shadowRoot
      .querySelector("d-hover-box")
      .shadowRoot.querySelector("style")
      .sheet.insertRule(".panel {background-color: var(--global-bg-color) !important;}");
    footnote.shadowRoot
      .querySelector("d-hover-box")
      .shadowRoot.querySelector("style")
      .sheet.insertRule(".panel {border-color: var(--global-divider-color) !important;}");
  });
  // Override styles of the citations.
  document.querySelectorAll("d-cite").forEach(function (cite) {
    cite.shadowRoot.querySelector("div > span").setAttribute("style", "color: var(--global-theme-color);");
    cite.shadowRoot.querySelector("style").sheet.insertRule("ul li a {color: var(--global-text-color) !important; text-decoration: none;}");
    cite.shadowRoot.querySelector("style").sheet.insertRule("ul li a:hover {color: var(--global-theme-color) !important;}");
    cite.shadowRoot
      .querySelector("d-hover-box")
      .shadowRoot.querySelector("style")
      .sheet.insertRule(".panel {background-color: var(--global-bg-color) !important;}");
    cite.shadowRoot
      .querySelector("d-hover-box")
      .shadowRoot.querySelector("style")
      .sheet.insertRule(".panel {border-color: var(--global-divider-color) !important;}");
  });

  // Distill renders formulas inside d-math Shadow DOM with a hardcoded near-black
  // KaTeX color that page CSS cannot override. Force theme text color instead.
  function styleDistillMath(root) {
    if (!root) return;
    const style = root.querySelector("style");
    if (!style || !style.sheet) return;
    if (style.dataset.themeMathFixed === "1") return;
    try {
      style.sheet.insertRule(
        "span.katex, span.katex *, .katex, .katex * { color: var(--global-text-color, currentColor) !important; }",
        0
      );
      style.sheet.insertRule(
        ".katex svg, span.katex svg { fill: var(--global-text-color, currentColor) !important; stroke: var(--global-text-color, currentColor) !important; }",
        0
      );
      style.dataset.themeMathFixed = "1";
    } catch (e) {
      // ignore insertRule failures on closed/adopted sheets
    }
  }

  function fixAllDistillMath() {
    document.querySelectorAll("d-math").forEach(function (math) {
      styleDistillMath(math.shadowRoot);
    });
  }

  fixAllDistillMath();
  // KaTeX loads async and creates d-math nodes after window load — retry briefly.
  let attempts = 0;
  const timer = setInterval(function () {
    fixAllDistillMath();
    attempts += 1;
    if (attempts >= 20 || document.querySelectorAll("d-math").length > 0) {
      // Keep watching a bit longer even after first math appears (late sections).
      if (attempts >= 40) clearInterval(timer);
    }
  }, 250);

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType !== 1) return;
        if (node.tagName === "D-MATH") styleDistillMath(node.shadowRoot);
        if (node.querySelectorAll) {
          node.querySelectorAll("d-math").forEach(function (math) {
            styleDistillMath(math.shadowRoot);
          });
        }
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
});
