if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then(() => {
    console.log('Service Worker registrado para funcionalidad offline');
  }).catch(err => {
    console.log('Error registrando Service Worker:', err);
  });
}

// Actualizar reloj
function updateClock() {
  const el = document.getElementById('top-bar-clock');
  if (el) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    el.textContent = `${dateStr} ${timeStr}`;
  }
}
setInterval(updateClock, 1000);
updateClock();

// Menu Derecho
document.getElementById("wifi-btn").onclick = () => alert('Wi-Fi: Connected');
document.getElementById("sound-btn").onclick = () => alert('Volume: 50%');
document.getElementById("battery-btn").onclick = () => alert('Battery: 95%');
document.getElementById("power-btn").onclick = () => alert('Power options (demo)');

// Arrastrar iconos del escritorio
let dragging = null, offsetX = 0, offsetY = 0;
document.querySelectorAll('.desktop-app').forEach(app => {
  app.addEventListener('mousedown', e => {
    dragging = app; offsetX = e.offsetX; offsetY = e.offsetY;
    app.style.zIndex = 50;
  });
});
document.addEventListener('mousemove', e => {
  if (dragging) {
    dragging.style.left = (e.pageX - offsetX) + 'px';
    dragging.style.top = (e.pageY - offsetY) + 'px';
  }
});
document.addEventListener('mouseup', () => {
  if (dragging) {
    dragging.style.zIndex = 8;
    dragging = null;
  }
});

// Animaciones ventanas abrir/ocultar/minimizar/maximizar/restaurar
function showWindow(id) {
  const win = document.getElementById(id);
  win.classList.remove('closing','minimized','fullscreen');
  win.style.display = 'flex';
  win.classList.add('opening');
  setTimeout(() => win.classList.remove('opening'), 10);
}
function hideWindow(id) {
  const win = document.getElementById(id);
  win.classList.remove('opening');
  win.classList.add('closing');
  setTimeout(() => {
    win.style.display = 'none';
    win.classList.remove('closing','fullscreen');
  }, 210);
}
function minimizeWindow(id) {
  const win = document.getElementById(id);
  win.classList.add('minimized');
}
function fullscreenWindow(id) {
  const win = document.getElementById(id);
  win.classList.toggle('fullscreen');
  win.classList.remove('minimized');
  win.style.display = 'flex';
}
function restoreWindow(id) {
  const win = document.getElementById(id);
  win.classList.remove('minimized','fullscreen','closing','opening');
  win.style.display = 'flex';
}

// Drag universal para todas las ventanas con clase .window y header .window-header
(function() {
  let isDragging = false;
  let dragTarget = null;
  let dx = 0, dy = 0;
  
  document.querySelectorAll('.window-header').forEach(header => {
    header.addEventListener('mousedown', e => {
      const win = header.parentElement;
      if (win.classList.contains('fullscreen')) return;
      isDragging = true;
      dragTarget = win;
      const rect = win.getBoundingClientRect();
      dx = e.clientX - rect.left;
      dy = e.clientY - rect.top;
      document.body.style.userSelect = 'none';
      win.style.zIndex = 100;
    });
  });
  
  document.addEventListener('mousemove', e => {
    if (!isDragging || !dragTarget) return;
    dragTarget.style.left = (e.clientX - dx) + 'px';
    dragTarget.style.top = (e.clientY - dy) + 'px';
  });
  
  document.addEventListener('mouseup', e => {
    if (!isDragging) return;
    isDragging = false;
    if (dragTarget) {
      dragTarget.style.zIndex = 40;
      dragTarget = null;
    }
    document.body.style.userSelect = '';
  });
})();

window.openSettings = function() { showWindow('settings-window'); };
window.closeSettings = function() { hideWindow('settings-window'); };

document.querySelector('.sidebar-icon[title="Settings"]').addEventListener('click', () => {
  showWindow('settings-window');
});

// Controles y apertura/cierre Firefox
window.openFirefox = function() { showWindow('firefox-window'); };
window.closeFirefox = function() { hideWindow('firefox-window'); };

// Busqueda DuckDuckGo
function doSearch() {
  const val = document.getElementById('browser-search').value.trim();
  if (!val) return;
  const resultDiv = document.getElementById('duckduck-result');
  resultDiv.innerHTML = '<em>Buscando...</em>';
  fetch('https://api.duckduckgo.com/?q=' + encodeURIComponent(val) + '&format=json&no_redirect=1&no_html=1')
    .then(res => res.json())
    .then(data => {
      let html = '';
      if(data.Heading) html += `<b>${data.Heading}</b><br>`;
      if(data.AbstractText) html += `${data.AbstractText}<br>`;
      if(data.AbstractURL) html += `<a href="${data.AbstractURL}" target="_blank" style="color:#feb80a;text-decoration:underline;">${data.AbstractURL}</a><br>`;
      if(data.RelatedTopics && data.RelatedTopics.length){
        html += "<ul style='margin-top:6px'>";
        data.RelatedTopics.slice(0,6).forEach(t => {
          if(t.Text && t.FirstURL){
            html += `<li><a href="${t.FirstURL}" target="_blank" style="color:#ffa;">${t.Text}</a></li>`;
          } else if(t.Topics && t.Topics.length) {
            t.Topics.slice(0,3).forEach(st => {
              if(st.Text && st.FirstURL){
                html += `<li><a href="${st.FirstURL}" target="_blank" style="color:#ffa;">${st.Text}</a></li>`;
              }
            });
          }
        });
        html += "</ul>";
      }
      if(!html) html = `Sin respuesta instantánea.<br><a href="https://duckduckgo.com/?q=${encodeURIComponent(val)}" target="_blank" style="color:#feb80a;text-decoration:underline;">Ver en DuckDuckGo</a>`;
      resultDiv.innerHTML = html;
    })
    .catch(()=>{ resultDiv.innerHTML = "Error buscando."; });
}
document.getElementById('browser-search').addEventListener('keydown', function(e){
  if(e.key === 'Enter'){ doSearch(); }
});


// Abrir y cerrar ventana de terminal
window.openTerminal = function() { 
  showWindow('terminal-window'); 
  document.getElementById('terminal-input').focus(); 
};
window.closeTerminal = function() { 
  hideWindow('terminal-window'); 
};

// Función neofetch para mostrar info y logo
function RunNeofetch() {
  const now = new Date();
  const asciiLogo = `
      .--.
     |o_o |
     |:_/ |
    //   \\\\
   (|     | )
  /'\\_   _/\\'
  \\___)=(___/
  `;
  const output = `
${asciiLogo}
System: WebinuxOS 1.0
Date: ${now.toLocaleString()}
Browser: ${navigator.userAgent}
Resolution: ${window.screen.width}x${window.screen.height}
User: user
`;
  const terminalOutput = document.getElementById('terminal-output');
  terminalOutput.textContent += output;
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Inicialización de comandos y escucha de teclado
document.addEventListener('DOMContentLoaded', () => {
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const commands = {
    help: 'Commands: help, echo, clear, date, neofetch',
    date: () => new Date().toLocaleString(),
    echo: args => args.join(' '),
    neofetch: () => { RunNeofetch(); return ''; },
    clear: () => { terminalOutput.textContent = ''; return ''; }
  };
  if (terminalInput && terminalOutput) {
    terminalInput.focus();
    terminalInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const input = terminalInput.value.trim();
        terminalOutput.textContent += 'user@ubuntu:~$ ' + input + '\n';
        if (!input) {
          terminalInput.value = '';
          return;
        }
        const [cmd, ...args] = input.split(' ');
        const cmdKey = cmd.toLowerCase();
        if (commands[cmdKey]) {
          const result = typeof commands[cmdKey] === 'function' 
            ? commands[cmdKey](args) 
            : commands[cmdKey];
          if (result !== '') terminalOutput.textContent += result + '\n';
        } else {
          terminalOutput.textContent += 'Command not found: ' + cmd + '\n';
        }
        terminalInput.value = '';
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const darkModeCheckbox = document.getElementById('dark-mode-checkbox');
  if (darkModeCheckbox) {
    darkModeCheckbox.addEventListener('change', (e) => {
      // Invertir el estado actual del checkbox
      darkModeCheckbox.checked = !darkModeCheckbox.checked;

      // Activar o desactivar clase dark-mode basado en el nuevo estado
      if (darkModeCheckbox.checked) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    });
  }
});

window.openNotepad = function() {
  showWindow('notepad-window');
  document.getElementById('notepad-text').focus();
};

window.closeNotepad = function() {
  hideWindow('notepad-window');
};

// Guardado básico en LocalStorage (puedes cambiar sistema si quieres)
function saveNotepad() {
  const text = document.getElementById('notepad-text').value;
  localStorage.setItem('notepadContent', text);
  alert('Contenido guardado localmente');
}

// Carga inicial del texto guardado
document.addEventListener('DOMContentLoaded', () => {
  const savedText = localStorage.getItem('notepadContent');
  if (savedText) {
    document.getElementById('notepad-text').value = savedText;
  }
});

// Explorador de Archivos
const fileSystem = {
  "/": ["folder1", "folder2", "file1.txt", "file2.txt"],
  "/folder1": ["subfolder1", "file3.txt"],
  "/folder1/subfolder1": ["file4.txt"],
  "/folder2": []
};

let currentPath = "/";

function renderBreadcrumbs() {
  const bc = document.getElementById("file-explorer-breadcrumbs");
  bc.innerHTML = "";
  const parts = currentPath.split("/").filter(p => p);
  let pathSoFar = "";
  const rootSpan = document.createElement("span");
  rootSpan.textContent = "/";
  rootSpan.onclick = () => {
    currentPath = "/";
    renderFileExplorer();
  };
  bc.appendChild(rootSpan);
  parts.forEach((p, i) => {
    pathSoFar += "/" + p;
    const span = document.createElement("span");
    span.textContent = p;
    span.onclick = () => {
      currentPath = pathSoFar;
      renderFileExplorer();
    };
    bc.appendChild(document.createTextNode(" > "));
    bc.appendChild(span);
  });
}

function renderFileExplorer() {
  const listUl = document.getElementById("file-explorer-list");
  listUl.innerHTML = "";

  renderBreadcrumbs();

  if (currentPath !== "/") {
    const upLi = document.createElement("li");
    upLi.textContent = ".. Up";
    upLi.classList.add("up");
    upLi.onclick = () => {
      const parts = currentPath.split("/").filter(p => p);
      parts.pop();
      currentPath = "/" + parts.join("/");
      if(currentPath === "") currentPath = "/";
      renderFileExplorer();
    };
    listUl.appendChild(upLi);
  }

  (fileSystem[currentPath] || []).forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    const fullPath = currentPath + (currentPath === "/" ? "" : "/") + item;
    if (fileSystem[fullPath]) {
      li.classList.add("folder");
      li.onclick = () => {
        currentPath = fullPath;
        renderFileExplorer();
      };
    } else {
      li.classList.add("file");
      li.onclick = () => alert("Open file: " + fullPath);
    }
    listUl.appendChild(li);
  });
}

window.openFileExplorer = function() {
  showWindow("file-explorer-window");
  currentPath = "/";
  renderFileExplorer();
};

window.closeFileExplorer = function() {
  hideWindow("file-explorer-window");
};

// CURSOR para celular 
const customCursor = document.createElement('div');
customCursor.classList.add('linux-cursor');
customCursor.style.display = 'none'; // Oculto por defecto
document.body.appendChild(customCursor);

let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;

function updateCursorPos() {
  customCursor.style.transform = `translate3d(${cursorX - 1}px, ${cursorY - 1}px, 0)`;
}

// Solo mostrar cursor tras primer toque real
let firstTouchDone = false;

window.addEventListener('touchstart', e => {
  if (!firstTouchDone) {
    customCursor.style.display = 'block'; // Mostrar cursor por primera vez
    firstTouchDone = true;
  }
  
  const touch = e.touches[0];
  cursorX = touch.clientX;
  cursorY = touch.clientY;
  updateCursorPos();
});

window.addEventListener('touchmove', e => {
  const touch = e.touches[0];
  cursorX = touch.clientX;
  cursorY = touch.clientY;
  updateCursorPos();
});

window.addEventListener('touchend', e => {
  customCursor.style.display = 'none'; // Ocultar cursor cuando no tocas
});

updateCursorPos();

//Modo oscuro
// Detección y control de Dark Mode

document.addEventListener('DOMContentLoaded', () => {
  const darkModeCheckbox = document.getElementById('dark-mode-checkbox');
  if (darkModeCheckbox) {
    // Escuchar cambio del checkbox
    darkModeCheckbox.addEventListener('change', (e) => {
      // Invertir el estado actual del checkbox
      darkModeCheckbox.checked = !darkModeCheckbox.checked;

      // Agregar o quitar clase 'dark-mode' en body según el estado
      if (darkModeCheckbox.checked) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    });
  }
});
