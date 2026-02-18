(function() {
    // Estado inicial
    let state = {
        score1: 0,
        score2: 0,
        name1: "Dupla 1",
        name2: "Dupla 2",
        rounds: []
    };

    const dom = {
        t1: document.getElementById('total1'),
        t2: document.getElementById('total2'),
        diff: document.getElementById('diff'),
        in1: document.getElementById('in1'),
        in2: document.getElementById('in2'),
        n1: document.getElementById('nome1'),
        n2: document.getElementById('nome2'),
        modal: document.getElementById('modal-history'),
        list: document.getElementById('round-list')
    };

    // Salva o estado completo no LocalStorage
    function saveToStorage() {
        state.name1 = dom.n1.value;
        state.name2 = dom.n2.value;
        localStorage.setItem('tranca_pwa_data', JSON.stringify(state));
    }

    // Carrega e renderiza a interface
    function renderUI() {
        dom.t1.innerText = state.score1;
        dom.t2.innerText = state.score2;
        dom.n1.value = state.name1;
        dom.n2.value = state.name2;
        dom.diff.innerText = Math.abs(state.score1 - state.score2);
        
        dom.list.innerHTML = state.rounds.map(r => {
            const diff = Math.abs(r.s1 - r.s2);
            const winnerClass = r.s1 > r.s2 ? 'winner-1' : (r.s2 > r.s1 ? 'winner-2' : '');
            const leadText = r.s1 > r.s2 ? `${r.name1} na frente` : (r.s2 > r.s1 ? `${r.name2} na frente` : 'Empate');

            return `
                <div class="round-card ${winnerClass}">
                    <div class="round-header"><span>Rodada #${r.id}</span><span>${leadText}</span></div>
                    <div class="round-scores">
                        <span style="color:var(--accent-green)">${r.name1}: ${r.s1}</span>
                        <span style="color:var(--accent-blue)">${r.name2}: ${r.s2}</span>
                    </div>
                    <div class="round-diff">Diferença de ${diff} pontos</div>
                </div>
            `;
        }).join('') || '<p>Nenhum registro de turno.</p>';
    }

    // Ações
    document.getElementById('adicionar').onclick = () => {
        state.score1 += parseInt(dom.in1.value) || 0;
        state.score2 += parseInt(dom.in2.value) || 0;
        dom.in1.value = ''; dom.in2.value = '';
        saveToStorage();
        renderUI();
        dom.in1.focus();
    };

    document.getElementById('btn-finish').onclick = () => {
        const newRound = {
            id: state.rounds.length + 1,
            s1: state.score1,
            s2: state.score2,
            name1: dom.n1.value,
            name2: dom.n2.value
        };
        state.rounds.unshift(newRound);
        saveToStorage();
        renderUI();
    };

    // Gestão de Modal e Reset
    document.getElementById('btn-history').onclick = () => dom.modal.style.display = 'block';
    document.getElementById('btn-close-modal').onclick = () => dom.modal.style.display = 'none';
    document.getElementById('btn-reset').onclick = () => {
        if(confirm("Deseja resetar todo o jogo e histórico?")) {
            state = { score1: 0, score2: 0, name1: "Dupla 1", name2: "Dupla 2", rounds: [] };
            localStorage.removeItem('tranca_pwa_data');
            renderUI();
        }
    };

    // Sincroniza nomes em tempo real
    dom.n1.oninput = saveToStorage;
    dom.n2.oninput = saveToStorage;

    // Tema
    document.getElementById('btn-theme').onclick = () => {
        const isLight = document.body.classList.toggle('light-mode');
        localStorage.setItem('tranca_theme', isLight ? 'light' : 'dark');
    };

    // Init
    const savedData = JSON.parse(localStorage.getItem('tranca_pwa_data'));
    if(savedData) state = savedData;
    if(localStorage.getItem('tranca_theme') === 'light') document.body.classList.add('light-mode');
    
    renderUI();
})();