/* =========================================================
   Typewriter effect + current year.
   ========================================================= */

(function typewriter() {
  const el = document.getElementById("typed");
  if (!el) return;

  // Edit these phrases to whatever you want to cycle through.
  const phrases = [
    "intelligent systems.",
    "things that learn.",
    "research into real-world tools.",
    "at the intersection of math and code.",
    "because I love figuring out how things work.",
  ];

  const typeSpeed = 90;    // ms per character while typing
  const deleteSpeed = 45;  // ms per character while deleting
  const holdTime = 1600;   // ms to pause on a full phrase

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = phrases[phraseIndex];
    charIndex += deleting ? -1 : 1;
    el.textContent = current.slice(0, charIndex);

    let delay = deleting ? deleteSpeed : typeSpeed;

    if (!deleting && charIndex === current.length) {
      delay = holdTime;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }
    setTimeout(tick, delay);
  }
  tick();
})();

/* =========================================================
   Terminal projects explorer.
   A delight layer on top of the always-visible project list:
   the real .entry blocks stay in the page (recruiter / mobile /
   no-JS friendly); this just lets you type commands to jump to
   and highlight them.
   ========================================================= */
(function terminal() {
  const section = document.getElementById("projects");
  if (!section) return;

  // Project metadata (drives `ls` and the `open` summaries).
  const PROJECTS = [
    {
      slug: "gpu-kernels",
      id: "proj-gpu-kernels",
      summary: "Teaching LLMs to write fast AMD HIP GPU kernels with SFT + GRPO RL.",
    },
    {
      slug: "egocentric-rl",
      id: "proj-egocentric",
      summary: "Predicting next actions from first-person video with a plan-and-verify VLM.",
    },
    {
      slug: "codecrack",
      id: "proj-codecrack",
      summary: "★ TreeHacks-winning voice-driven AI mock-interview platform.",
    },
    {
      slug: "search-rescue",
      id: "proj-search-rescue",
      summary: "A PPO agent running search-and-rescue in a hazardous grid world.",
    },
  ];

  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- Build the terminal DOM and insert it under the <h2> ----
  const term = document.createElement("div");
  term.className = "terminal";
  term.innerHTML = `
    <div class="terminal-bar" aria-hidden="true">
      <span class="dot"></span><span class="dot"></span><span class="dot"></span>
      <span class="terminal-titlebar">projects — zsh</span>
    </div>
    <div class="terminal-body">
      <div class="terminal-log" id="termlog" role="log" aria-live="polite"></div>
      <div class="terminal-inputline">
        <span class="terminal-prompt">natalia@portfolio ~ %</span>
        <input class="terminal-input" id="terminput" type="text" autocomplete="off"
               autocapitalize="off" spellcheck="false"
               aria-label="Terminal command input. Type help and press enter." />
      </div>
    </div>`;

  const h2 = section.querySelector("h2");
  h2.insertAdjacentElement("afterend", term);

  const log = term.querySelector("#termlog");
  const input = term.querySelector("#terminput");

  // ---- Output helpers ----
  function print(text, cls) {
    const line = document.createElement("div");
    line.className = "term-line" + (cls ? " " + cls : "");
    line.textContent = text;
    log.appendChild(line);
  }
  function printPrompt(cmd) {
    const line = document.createElement("div");
    line.className = "term-line";
    line.innerHTML =
      '<span class="terminal-prompt">natalia@portfolio ~ %</span> ' +
      escapeHtml(cmd);
    log.appendChild(line);
  }
  function printList() {
    const line = document.createElement("div");
    line.className = "term-line term-slugs";
    PROJECTS.forEach((p) => {
      const a = document.createElement("button");
      a.type = "button";
      a.className = "term-slug";
      a.textContent = p.slug;
      a.addEventListener("click", () => run("open " + p.slug));
      line.appendChild(a);
    });
    log.appendChild(line);
  }
  function escapeHtml(s) {
    return s.replace(/[&<>"]/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
    );
  }

  function openProject(slug) {
    const p = PROJECTS.find((x) => x.slug === slug);
    if (!p) {
      print("no such project: " + slug + "  (try `ls`)", "term-err");
      return;
    }
    print(p.summary, "term-ok");
    const el = document.getElementById(p.id);
    if (el) {
      el.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "center",
      });
      el.classList.remove("flash");
      void el.offsetWidth; // restart the animation
      el.classList.add("flash");
    }
  }

  // ---- Command dispatch ----
  function run(raw) {
    const cmd = raw.trim();
    if (cmd) printPrompt(cmd);
    const [name, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(" ").replace(/^projects\//, "");

    switch ((name || "").toLowerCase()) {
      case "":
        break;
      case "help":
        print("available commands:");
        print("  ls               list all projects");
        print("  open <name>      jump to a project (or just type its name)");
        print("  all              scroll to the full project list");
        print("  clear            clear this terminal");
        print("  help             show this message");
        break;
      case "ls":
      case "dir":
        printList();
        break;
      case "open":
      case "cat":
        if (!arg) print("usage: open <project-name>  (try `ls`)", "term-err");
        else openProject(arg.toLowerCase());
        break;
      case "all":
        section.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
        print("showing all " + PROJECTS.length + " projects below ↓", "term-ok");
        break;
      case "clear":
      case "cls":
        log.innerHTML = "";
        break;
      case "whoami":
        print("natalia — cs @ stanford, building intelligent systems.", "term-ok");
        break;
      case "sudo":
        print("nice try 😄", "term-ok");
        break;
      case "coffee":
        print("☕ brewing...", "term-ok");
        break;
      default:
        if (PROJECTS.some((p) => p.slug === (name || "").toLowerCase())) {
          openProject(name.toLowerCase());
        } else {
          print("command not found: " + name + "  (try `help`)", "term-err");
        }
    }
    log.scrollTop = log.scrollHeight;
  }

  // ---- Wire up input ----
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const v = input.value;
      input.value = "";
      run(v);
    }
  });
  // Click anywhere on the terminal focuses the input.
  term.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON") input.focus();
  });

  // ---- Intro: auto-run `ls`, with a hint ----
  function intro() {
    printPrompt("ls projects/");
    printList();
    print("type a project name (or `help`) and hit enter ↵", "term-hint");
    print("↓ all projects are listed in full below, too.", "term-hint");
  }

  if (reduceMotion) {
    intro();
  } else {
    // tiny delay so it feels like it "boots"
    setTimeout(intro, 350);
  }
})();

document.getElementById("year").textContent = new Date().getFullYear();
