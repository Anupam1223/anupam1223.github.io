window.MathJax = {
  tex: {
    tags: "ams",
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
    processEscapes: true,
    processEnvironments: true,
  },
  options: {
    renderActions: {
      addCss: [
        200,
        function (doc) {
          const style = document.createElement("style");
          style.innerHTML = `
          .mjx-container {
            color: inherit;
          }
        `;
          document.head.appendChild(style);
        },
        "",
      ],
    },
  },
};

document.addEventListener("DOMContentLoaded", function () {
  // Convert kramdown script tags to MathJax 3 delimiters
  var scripts = document.getElementsByTagName("script");
  var toProcess = [];
  for (var i = 0; i < scripts.length; i++) {
    var script = scripts[i];
    if (script.type == "math/tex" || script.type == "math/tex; mode=display") {
      toProcess.push(script);
    }
  }

  toProcess.forEach(function (script) {
    var math = script.innerText;
    var node;
    if (script.type == "math/tex") {
      node = document.createTextNode("\\(" + math + "\\)");
    } else {
      node = document.createTextNode("\\[" + math + "\\]");
    }
    script.parentNode.replaceChild(node, script);
  });

  // Trigger MathJax if it's already loaded
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise();
  }
});
