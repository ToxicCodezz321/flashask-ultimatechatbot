
// ================= FLASH ASK ULTIMATE ==================
(function () {
    if (window.flashAskLoaded) return;
    window.flashAskLoaded = true;

    // ----------------- LOAD KATEX FOR LATEX -----------------
    const katexCSS = document.createElement("link");
    katexCSS.rel = "stylesheet";
    katexCSS.href = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";
    document.head.appendChild(katexCSS);

    const katexJS = document.createElement("script");
    katexJS.src = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js";
    document.head.appendChild(katexJS);

    // ---------------- UI ----------------
    let ui = document.createElement("div");
    ui.id = "flash-ask-ui";
    ui.innerHTML = `
        <style>
            #flash-ask-ui {
                position: fixed; bottom: 20px; right: 20px;
                width: 450px; height: 550px;
                background: rgba(10,10,18,0.94);
                border: 2px solid #4ef; border-radius: 14px;
                color: white; font-family: 'Consolas', monospace;
                z-index: 999999999;
                display: flex; flex-direction: column;
                box-shadow: 0 0 25px #4ef;
            }
            #fa-header {
                padding: 10px; background: #111;
                border-bottom: 2px solid #4ef;
                display: flex; justify-content: space-between;
                font-size: 18px; font-weight: bold;
            }
            #fa-output {
                flex: 1; padding: 10px; overflow-y: auto;
                font-size: 15px; line-height: 1.4em;
            }
            #fa-input-area {
                display: flex; border-top: 2px solid #4ef;
            }
            #fa-input {
                flex: 1; padding: 8px; background: #000;
                border: none; outline: none; color: #4ef;
                font-family: inherit;
            }
            #fa-send {
                width: 80px; background: #4ef; color: #000;
                border: none; cursor: pointer; font-weight: bold;
            }
            #fa-fox-mascot {
                width: 40px; position: absolute; top: 10px; left: 10px;
                animation: wag 1s infinite;
            }
            @keyframes wag {
                0%,100% { transform: rotate(0deg); }
                50% { transform: rotate(15deg); }
            }
        </style>

        <div id="fa-header">
            🦊 Flash Ask Ultimate
            <button id="fa-close" style="background:none;border:none;color:#4ef;font-size:18px;cursor:pointer;">✖</button>
        </div>

        <img id="fa-fox-mascot" src="https://i.imgur.com/6T8YcGv.png">

        <div id="fa-output"></div>

        <div id="fa-input-area">
            <input id="fa-input" placeholder="Type here…">
            <button id="fa-send">Send</button>
        </div>
    `;
    document.body.appendChild(ui);

    const out = document.getElementById("fa-output");
    const input = document.getElementById("fa-input");

    // ---------------- OUTPUT ---------------
    function respond(text) {
        out.innerHTML += `<div>🦊 ${text}</div>`;
        out.scrollTop = out.scrollHeight;
    }

    respond("Hello! I'm Flash Ask Ultimate — your fox friend with infinite features!");
    respond("Type /mode <mode_name> to switch modes. Example: /mode math");

    // ---------------- STATE -----------------
    let mode = "normal";
    let personality = "friendly fox";
    let tasks = [];

    // ---------------- MEMORY -----------------
    let memory = JSON.parse(localStorage.getItem("flashAskMemory") || "{}");
    personality = memory.personality || personality;
    tasks = memory.tasks || tasks;

    function saveMemory() {
        localStorage.setItem("flashAskMemory", JSON.stringify({personality, tasks}));
    }

    // --------------- MODULAR ENGINE ----------------
    const modules = {
        normal(msg) {
            respond(`(${personality}) → ${msg}`);
        },

        terminal(msg) {
            respond(`<pre>SYS> ${msg.toUpperCase()}</pre>`);
        },

        math(msg) {
            try {
                let latex = katex.renderToString(msg, {throwOnError:false});
                respond(latex);
            } catch {
                respond("❌ LaTeX error");
            }
        },

        meme(msg) {
            respond(`🔥 Meme idea: <b>${msg}</b> but with total chaos.`);
        },

        python(msg) {
            respond(`🐍 Teaching Python:\n<pre>${msg}\n# result → (demo)</pre>`);
        },

        html3d(msg) {
            respond(`🌐 HTML 3D concept:\n<pre>&lt;div class="cube"&gt;${msg}&lt;/div&gt;</pre>`);
        },

        friend(msg) {
            respond(`💛 I'm here for you. You said: "${msg}"`);
        },

        surprise() {
            const surprises = [
                "🎁 A secret mode unlocked: /mode vaporwave",
                "🦊 Fun fact: Foxes have excellent night vision!",
                "🎮 Mini-game coming soon!",
                "🤖 Adding new AI trick… done!",
                "💡 Random idea: 'Flash Ask Studio'?"
            ];
            respond(surprises[Math.floor(Math.random()*surprises.length)]);
        },

        organize(msg) {
            if (msg.startsWith("add ")) {
                let t = msg.slice(4);
                tasks.push(t);
                respond(`📝 Task added: "${t}"`);
                saveMemory();
                return;
            }
            if (msg === "list") {
                respond("📋 Tasks:<br>" + tasks.map((t,i)=>`${i+1}. ${t}`).join("<br>"));
                return;
            }
            if (msg.startsWith("done ")) {
                let n = parseInt(msg.split(" ")[1]) - 1;
                if (tasks[n]) {
                    let fin = tasks.splice(n,1)[0];
                    respond(`✔ Completed: "${fin}"`);
                    saveMemory();
                } else respond("❌ Task not found.");
                return;
            }
            respond("Use: add <task>, list, done <number>");
        },

        personality(msg) {
            personality = msg;
            respond(`✨ Personality updated to: "${msg}"`);
            saveMemory();
        },

        vaporwave(msg) {
            respond(`🌴 Vaporwave Mode → ${msg.split('').join(' ')}`);
        },

        cyberpunk(msg) {
            respond(`💾 Cyberpunk Mode → ${msg.toUpperCase().split('').join(' ')}`);
        },

        anime(msg) {
            respond(`🌸 Anime Fox → *${msg}*`);
        },

        "ai-pet"(msg) {
            respond(`🐾 AI Pet says: "${msg}" and wags tail!`);
        },

        "mini-games"(msg) {
            if(msg==="ttt"){
                respond("🎮 Tic-Tac-Toe game started! (placeholder demo)");
            } else if(msg==="guess"){
                respond("🎲 Number Guessing game started! (placeholder demo)");
            } else {
                respond("Available mini-games: ttt, guess");
            }
        }
    };

    // --------------- HANDLE INPUT -------------------
    function handleCommand(msg) {
        if (msg.startsWith("/mode ")) {
            let m = msg.replace("/mode ", "");
            if (modules[m]) { mode = m; respond(`🔧 Mode switched to "<b>${m}</b>"`); }
            else respond("⚠ Unknown mode");
            return;
        }

        if (msg.startsWith("/personality ")) {
            modules.personality(msg.replace("/personality ",""));
            return;
        }

        if (msg.startsWith("/task ")) {
            modules.organize(msg.replace("/task ",""));
            return;
        }

        if (msg === "/surprise") {
            modules.surprise();
            return;
        }

        if (modules[mode]) modules[mode](msg);
        else respond("⚠ Unknown mode active");
    }

    // UI events
    document.getElementById("fa-send").onclick = () => {
        let msg = input.value.trim();
        if (!msg) return;
        input.value = "";
        handleCommand(msg);
    };

    input.addEventListener("keydown", e => {
        if (e.key === "Enter") document.getElementById("fa-send").click();
    });

    document.getElementById("fa-close").onclick = () => ui.remove();
})();
