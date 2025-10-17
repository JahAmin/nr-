// app.js - versão atualizada com correções padrão para brinco, vacinas, eventos, ID e import CSV
// Substituir o arquivo js/app.js existente por este
(function () {
  // ---------- DOM Refs ----------
  const DOM = {
    navLinks: document.querySelectorAll('.nav-link'),
    pageSections: document.querySelectorAll('.page-section'),

    totalAnimais: document.getElementById('total-animais'),
    vacasLactacao: document.getElementById('vacas-lactacao'),
    tarefasPendentes: document.getElementById('tarefas-pendentes'),
    proximosPartosLista: document.getElementById('proximos-partos-lista'),
    proximosCioLista: document.getElementById('proximos-cio-lista'),
    producaoDiariaChartCanvas: document.getElementById('producaoDiariaChart'),
    distribuicaoRebanhoChartCanvas: document.getElementById('distribuicaoRebanhoChart'),

    btnNovoAnimal: document.getElementById('btn-novo-animal'),
    filtroCategoriaSelect: document.getElementById('filtro-categoria'),
    filtroBrincoInput: document.getElementById('filtro-brinco'),
    buscaAnimalInput: document.getElementById('busca-animal'),
    animalListTbody: document.getElementById('animal-list-tbody'),
    modalAnimalForm: document.getElementById('modal-animal-form'),
    animalForm: document.getElementById('animal-form'),
    animalIdInput: document.getElementById('animal-id'),
    animalBrincoInput: document.getElementById('animal-brinco'),
    animalNomeInput: document.getElementById('animal-nome'),
    animalRacaInput: document.getElementById('animal-raca'),
    animalPesoInput: document.getElementById('animal-peso'),
    animalDataNascInput: document.getElementById('animal-data-nasc'),
    animalSexoSelect: document.getElementById('animal-sexo'),
    animalStatusReprodutivoSelect: document.getElementById('animal-status-reprodutivo'),
    animalDataPartoGroup: document.getElementById('animal-data-parto-group'),
    animalDataPartoInput: document.getElementById('animal-data-parto'),
    animalNumPartosInput: document.getElementById('animal-num-partos'),
    animalNumLactacoesInput: document.getElementById('animal-num-lactacoes'),
    animalPaiSelect: document.getElementById('animal-pai'),
    animalMaeSelect: document.getElementById('animal-mae'),
    animalDataCoberturaInput: document.getElementById('animal-data-cobertura'),
    animalObservacoesTextarea: document.getElementById('animal-observacoes'),
    animalObservacoesClinicasTextarea: document.getElementById('animal-observacoes-clinicas'),
    animalFotoInput: document.getElementById('animal-foto'),
    previewFotoImg: document.getElementById('preview'),
    videoElement: document.getElementById('video'),
    captureButton: document.getElementById('capture-button'),
    loadingMessage: document.getElementById('loading'),
    canvasElement: document.getElementById('canvas'),
    animalFotoUrlInput: document.getElementById('animal-foto-url'),
    cameraSelect: document.getElementById('camera-select'),
    vaccineCheckboxesContainer: document.getElementById('vaccine-checkboxes-container'),
    openCameraButton: document.getElementById('open-camera-button'),
    cameraControlsDiv: document.querySelector('.photo-capture-section .camera-controls'),

    modalDetalhesAnimal: document.getElementById('modal-detalhes-animal'),
    detalhesAnimalTitulo: document.getElementById('detalhes-animal-titulo'),
    detalhesAnimalConteudo: document.getElementById('detalhes-animal-conteudo'),
    detalhesAnimalTimeline: document.getElementById('detalhes-animal-timeline'),

    btnNovaTarefa: document.getElementById('btn-nova-tarefa'),
    proximasTarefasLista: document.getElementById('proximas-tarefas-lista'),
    modalTarefaForm: document.getElementById('modal-tarefa-form'),
    tarefaForm: document.getElementById('tarefa-form'),
    tarefaNomeInput: document.getElementById('tarefa-nome'),
    tarefaData: document.getElementById('tarefa-data'),
    tarefaHora: document.getElementById('tarefa-hora'),
    tarefaAnimalSelect: document.getElementById('tarefa-animal'),
    tarefaDescricao: document.getElementById('tarefa-descricao'),
    listaTarefasCalendario: document.getElementById('lista-tarefas-calendario'),

    selectVacaLactacao: document.getElementById('select-vaca-lactacao'),
    leiteQuantidadeInput: document.getElementById('leite-quantidade'),
    leiteDataInput: document.getElementById('leite-data'),
    leitePeriodoSelect: document.getElementById('leite-periodo'),
    btnRegistrarLeite: document.getElementById('btn-registrar-leite'),
    producaoLeiteTbody: document.getElementById('producao-leite-tbody'),

    selectRelatorioTipo: document.getElementById('select-relatorio-tipo'),
    btnGerarRelatorioPdf: document.getElementById('btn-gerar-relatorio-pdf'),
    btnExportarCsv: document.getElementById('btn-exportar-csv'),

    btnExportarDados: document.getElementById('btn-exportar-dados'),
    inputImportarDados: document.getElementById('input-importar-dados'),
    btnImportarDados: document.getElementById('btn-importar-dados'),
    btnResetarDados: document.getElementById('btn-resetar-dados'),
    inputImportarCsv: document.getElementById('input-importar-csv'),
    btnImportarCsv: document.getElementById('btn-importar-csv'),

    configIdPrefix: document.getElementById('config-id-prefix'),
    configIdNext: document.getElementById('config-id-next'),

    closeModalButtons: document.querySelectorAll('.close-modal-btn'),
    animalEventsList: document.getElementById('animal-events-list'),
    btnAddEvent: document.getElementById('btn-add-event'),
  };

  // ---------- Data ----------
  let animais = [];
  let tarefas = [];
  let config = {
    idPrefix: 'AN',
    idNext: 1,
    notificacoesPush: false,
    notificacoesAntecedenciaHoras: 24,
    nextTaskNum: 1
  };
  let currentAnimalId = '';

  // Charts state
  const charts = {
    producaoDiaria: null,
    distribuicaoRebanho: null
  };

  const bovineVaccines = [
    'Febre Aftosa',
    'Brucelose',
    'Raiva',
    'Clostridiose',
    'Leptospirose',
    'IBR/BVD',
    'Carbúnculo Sintomático',
    'Botulismo'
  ];

  // ---------- Persistence ----------
  function loadStorage() {
    try {
      const sAnimais = localStorage.getItem('animais');
      const sTarefas = localStorage.getItem('tarefas');
      const sConfig = localStorage.getItem('appConfig');
      if (sAnimais) animais = JSON.parse(sAnimais);
      if (sTarefas) tarefas = JSON.parse(sTarefas);
      if (sConfig) config = Object.assign(config, JSON.parse(sConfig));
    } catch (e) {
      console.error('Erro loadStorage', e);
    }
    if (animais.length === 0) seedSampleData();
  }
  function saveStorage() {
    localStorage.setItem('animais', JSON.stringify(animais));
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    localStorage.setItem('appConfig', JSON.stringify(config));
  }

  // ---------- Seed sample data ----------
  function seedSampleData() {
    const today = new Date();
    const toISO = (d) => new Date(d).toISOString().split('T')[0];
    const daysAgo = (n) => toISO(new Date(today.getFullYear(), today.getMonth(), today.getDate() - n));

    const an1 = {
      id: 'AN001',
      brinco: 'BR001',
      nome: 'Estrela',
      raca: 'Holandesa',
      peso: 580,
      dataNascimento: toISO(new Date(today.getFullYear() - 4, today.getMonth() - 3, today.getDate())),
      sexo: 'femea',
      statusReprodutivo: 'lactante',
      dataParto: daysAgo(60),
      numPartos: 2,
      numLactacoes: 2,
      pai: null,
      mae: null,
      dataCobertura: null,
      observacoes: '',
      observacoesClinicas: '',
      fotoUrl: null,
      producaoLeite: [
        { id: 'ML1', data: daysAgo(1), periodo: 'manha', quantidade: 12.4 },
        { id: 'ML2', data: daysAgo(1), periodo: 'tarde', quantidade: 11.8 },
        { id: 'ML3', data: daysAgo(2), periodo: 'manha', quantidade: 12.0 },
        { id: 'ML4', data: daysAgo(2), periodo: 'tarde', quantidade: 11.5 }
      ],
      vacinas: [],
      events: []
    };
    const an2 = {
      id: 'AN002',
      brinco: 'BR002',
      nome: 'Aurora',
      raca: 'Jersey',
      peso: 460,
      dataNascimento: toISO(new Date(today.getFullYear() - 3, today.getMonth() - 1, today.getDate() - 10)),
      sexo: 'femea',
      statusReprodutivo: 'prenha',
      dataParto: null,
      numPartos: 1,
      numLactacoes: 1,
      pai: null,
      mae: null,
      dataCobertura: toISO(new Date(today.getFullYear(), today.getMonth() - 8, today.getDate() + 5)), // parto previsto ~290 dias
      observacoes: '',
      observacoesClinicas: '',
      fotoUrl: null,
      producaoLeite: [],
      vacinas: [],
      events: []
    };
    const an3 = {
      id: 'AN003',
      brinco: 'BR003',
      nome: 'Trovão',
      raca: 'Gir',
      peso: 720,
      dataNascimento: toISO(new Date(today.getFullYear() - 5, today.getMonth() - 6, today.getDate())),
      sexo: 'macho',
      statusReprodutivo: 'touro',
      dataParto: null,
      numPartos: 0,
      numLactacoes: 0,
      pai: null,
      mae: null,
      dataCobertura: null,
      observacoes: '',
      observacoesClinicas: '',
      fotoUrl: null,
      producaoLeite: [],
      vacinas: [],
      events: []
    };

    animais = [an1, an2, an3];
    tarefas = [
      { id: 'T001', nome: 'Vacinar Estrela', data: daysAgo(0), hora: '15:00', animalId: 'AN001', descricao: 'Aplicar vacina IBR/BVD', concluida: false },
      { id: 'T002', nome: 'Revisão Aurora', data: daysAgo(3), hora: '', animalId: 'AN002', descricao: 'Exame de prenhez', concluida: true }
    ];
    config.idNext = 4;
    if (!config.nextTaskNum || isNaN(config.nextTaskNum)) config.nextTaskNum = 3;
    saveStorage();
  }

  // ---------- Helpers ----------
  function padNumber(num, length = 3) { return String(num).padStart(length, '0'); }
  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    if (typeof dateString === 'number') dateString = new Date(dateString).toISOString().split('T')[0];
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }
  function calcularIdade(dataNascimento) {
    if (!dataNascimento) return 'N/A';
    const hoje = new Date();
    const nasc = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
    if (idade === 0) {
      const diffTime = Math.abs(hoje - nasc);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 30) return `${diffDays} dias`;
      return `${Math.floor(diffDays / 30)} meses`;
    }
    return `${idade} anos`;
  }
  function getStatusReprodutivoDisplay(status) {
    const map = { 'vazia': 'Vazia','prenha':'Prenha','lactante':'Lactante','seca':'Seca','novilha':'Novilha','recria':'Recria','cria':'Cria','touro':'Touro','rufao':'Rufão','indefinida':'Indefinida' };
    return map[status] || status;
  }

  function varToRgb(cssVar, alpha = 1) {
    const style = getComputedStyle(document.documentElement);
    const color = style.getPropertyValue(cssVar).trim();
    if (color.startsWith('#')) {
      const r = parseInt(color.substring(1, 3), 16);
      const g = parseInt(color.substring(3, 5), 16);
      const b = parseInt(color.substring(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return color;
  }

  // ---------- ID generation (atomic) ----------
  function getNextIdAtomic() {
    const id = `${config.idPrefix}${padNumber(config.idNext, 3)}`;
    config.idNext++;
    saveStorage();
    return id;
  }

  // ---------- Image resize/compress ----------
  function resizeImageFile(file, maxWidth = 800, quality = 0.75) {
    return new Promise((resolve, reject) => {
      if (!file) return resolve(null);
      const img = new Image();
      const reader = new FileReader();
      reader.onload = function (e) {
        img.onload = function () {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((maxWidth / width) * height);
            width = maxWidth;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = function (err) { reject(err); };
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // ---------- Camera ----------
  let stream = null;
  let availableCams = [];
  async function enumerateCameras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      availableCams = devices.filter(d => d.kind === 'videoinput');
      DOM.cameraSelect.innerHTML = '';
      if (availableCams.length) {
        availableCams.forEach((d, i) => {
          const opt = document.createElement('option'); opt.value = d.deviceId; opt.textContent = d.label || `Câmara ${i+1}`; DOM.cameraSelect.appendChild(opt);
        });
        DOM.cameraSelect.style.display = 'block';
      } else {
        DOM.cameraSelect.innerHTML = '<option value="">Nenhuma câmara encontrada</option>';
        DOM.cameraSelect.style.display = 'none';
      }
    } catch (err) {
      console.error('enumerateCameras', err);
      DOM.cameraSelect.innerHTML = '<option value="">Erro</option>';
      DOM.cameraSelect.style.display = 'none';
    }
  }
  async function startCamera(deviceId = null) {
    try {
      stopCamera();
      const constraints = deviceId ? { video: { deviceId: { exact: deviceId } } } : { video: { facingMode: 'environment' } };
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      DOM.videoElement.srcObject = stream;
      DOM.videoElement.style.display = 'block';
      DOM.captureButton.style.display = 'inline-block';
      DOM.cameraControlsDiv.style.display = 'block';
      DOM.openCameraButton.style.display = 'none';
    } catch (err) {
      console.error('startCamera', err);
      showCustomAlert('Erro ao aceder à câmara: ' + (err.message || err.name));
      DOM.openCameraButton.style.display = 'block';
      DOM.cameraControlsDiv.style.display = 'none';
    }
  }
  function stopCamera() {
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
    DOM.videoElement.srcObject = null;
    DOM.videoElement.style.display = 'none';
    if (DOM.captureButton) DOM.captureButton.style.display = 'none';
    if (DOM.cameraControlsDiv) DOM.cameraControlsDiv.style.display = 'none';
    if (DOM.openCameraButton) DOM.openCameraButton.style.display = 'block';
  }
  async function capturarImagem() {
    if (!DOM.videoElement || !DOM.videoElement.srcObject) { showCustomAlert('Câmara não ativa'); return; }
    DOM.loadingMessage.style.display = 'block';
    const canvas = DOM.canvasElement;
    canvas.width = DOM.videoElement.videoWidth || 640;
    canvas.height = DOM.videoElement.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(DOM.videoElement, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    const blob = await fetch(dataUrl).then(r => r.blob());
    const resized = await resizeImageFile(blob, 800, 0.75);
    DOM.animalFotoUrlInput.value = resized || dataUrl;
    DOM.previewFotoImg.src = resized || dataUrl;
    DOM.previewFotoImg.style.display = 'block';
    DOM.loadingMessage.style.display = 'none';
    stopCamera();
  }
  async function previewFoto(event) {
    const file = event?.target?.files?.[0];
    if (file) {
      try {
        const resized = await resizeImageFile(file, 800, 0.75);
        DOM.previewFotoImg.src = resized;
        DOM.previewFotoImg.style.display = 'block';
        DOM.animalFotoUrlInput.value = resized;
      } catch (err) {
        console.error('previewFoto', err);
        showCustomAlert('Erro ao processar a imagem.');
      } finally {
        stopCamera();
      }
    } else {
      DOM.previewFotoImg.src = ""; DOM.previewFotoImg.style.display = 'none'; DOM.animalFotoUrlInput.value = "";
    }
  }

  // ---------- Vaccine UI ----------
  function createVaccineHistoryItem(vaccineName, dateValue = '', observacao = '') {
    const wrapper = document.createElement('div');
    wrapper.className = 'vaccine-history-item';
    wrapper.style.display = 'flex';
    wrapper.style.gap = '8px';
    wrapper.style.alignItems = 'center';
    wrapper.style.marginBottom = '6px';
    wrapper.innerHTML = `
      <input type="date" class="vaccine-date" value="${dateValue}">
      <input type="text" class="vaccine-note" placeholder="Observação (opcional)" value="${observacao}">
      <button type="button" class="btn-danger btn-small">Remover</button>
    `;
    wrapper.querySelector('button').addEventListener('click', () => wrapper.remove());
    return wrapper;
  }

  function buildVaccineControls(animal = null) {
    DOM.vaccineCheckboxesContainer.innerHTML = '';
    bovineVaccines.forEach(vName => {
      const vaccineId = vName.replace(/[^a-zA-Z0-9]/g, '');
      const div = document.createElement('div');
      div.classList.add('vaccine-item');
      div.style.flexDirection = 'column';
      div.style.alignItems = 'flex-start';
      div.innerHTML = `
        <div style="display:flex; gap:8px; align-items:center; width:100%;">
          <strong style="flex:1">${vName}</strong>
          <button type="button" class="btn-secondary btn-small" data-action="add-date" data-vaccine="${vName}">+ Data</button>
        </div>
        <div class="vaccine-history" id="vaccine-history-${vaccineId}" style="width:100%; margin-top:6px;"></div>
      `;
      DOM.vaccineCheckboxesContainer.appendChild(div);
      const historyDiv = div.querySelector('.vaccine-history');
      const existingRecord = (animal && animal.vacinas) ? animal.vacinas.find(v => v.nome === vName) : null;
      const historico = existingRecord ? (existingRecord.historico || []) : [];
      historico.forEach(h => historyDiv.appendChild(createVaccineHistoryItem(vName, h.data, h.observacao)));
      const addBtn = div.querySelector('[data-action="add-date"]');
      addBtn.addEventListener('click', () => historyDiv.appendChild(createVaccineHistoryItem(vName, new Date().toISOString().split('T')[0], '')));
    });
  }

  // ---------- Events UI ----------
  function createEventMini(type = 'observacao', date = '', details = '') {
    const wrapper = document.createElement('div');
    wrapper.className = 'event-mini';
    wrapper.style.display = 'flex';
    wrapper.style.gap = '8px';
    wrapper.style.alignItems = 'center';
    wrapper.style.marginBottom = '6px';
    wrapper.innerHTML = `
      <select class="event-type">
        <option value="parto" ${type==='parto'?'selected':''}>Parto</option>
        <option value="cobertura" ${type==='cobertura'?'selected':''}>Cobertura</option>
        <option value="vacina" ${type==='vacina'?'selected':''}>Vacina</option>
        <option value="tratamento" ${type==='tratamento'?'selected':''}>Tratamento</option>
        <option value="observacao" ${type==='observacao'?'selected':''}>Observação</option>
        <option value="producao" ${type==='producao'?'selected':''}>Produção</option>
      </select>
      <input type="date" class="event-date" value="${date}">
      <input type="text" class="event-details" placeholder="Detalhes" value="${details}">
      <button type="button" class="btn-danger btn-small">Remover</button>
    `;
    wrapper.querySelector('button').addEventListener('click', () => wrapper.remove());
    return wrapper;
  }

  function buildEventListUI(animal = null) {
    if (!DOM.animalEventsList) return;
    DOM.animalEventsList.innerHTML = '';
    const events = animal ? (animal.events || []) : [];
    events.forEach(e => DOM.animalEventsList.appendChild(createEventMini(e.type, e.date, e.details)));
    if (DOM.btnAddEvent) DOM.btnAddEvent.onclick = () => DOM.animalEventsList.appendChild(createEventMini('observacao', new Date().toISOString().split('T')[0], ''));
  }

  // ---------- Parent selects (filter by sexo) ----------
  function populateParentSelects() {
    const pai = DOM.animalPaiSelect; const mae = DOM.animalMaeSelect;
    if (!pai || !mae) return;
    pai.innerHTML = '<option value="">Nenhum</option>';
    mae.innerHTML = '<option value="">Nenhum</option>';
    // pai: only machos; mae: only femeas
    animais.forEach(a => {
      if (a.sexo === 'macho') { const opt = document.createElement('option'); opt.value = a.id; opt.textContent = `${a.nome} (${a.id})`; pai.appendChild(opt); }
      if (a.sexo === 'femea') { const opt = document.createElement('option'); opt.value = a.id; opt.textContent = `${a.nome} (${a.id})`; mae.appendChild(opt); }
    });
  }

  // ---------- Render list & helpers ----------
  function renderAnimalList() {
    if (!DOM.animalListTbody) return;
    DOM.animalListTbody.innerHTML = '';
    const filtro = DOM.filtroCategoriaSelect?.value || 'todos';
    const busca = (DOM.buscaAnimalInput?.value || '').toLowerCase();
    const brincoFiltro = (DOM.filtroBrincoInput?.value || '').toLowerCase();

    const list = animais.filter(a => {
      const matchCat = filtro === 'todos' || a.statusReprodutivo === filtro;
      const matchBusca = a.nome?.toLowerCase().includes(busca) || a.id?.toLowerCase().includes(busca) || (a.raca || '').toLowerCase().includes(busca);
      const matchBrinco = !brincoFiltro || (a.brinco || '').toLowerCase().includes(brincoFiltro);
      return matchCat && matchBusca && matchBrinco;
    });

    if (list.length === 0) {
      DOM.animalListTbody.innerHTML = '<tr><td colspan="8">Nenhum animal encontrado.</td></tr>';
      return;
    }
    list.forEach(animal => {
      const row = document.createElement('tr');

      const fotoCell = document.createElement('td');
      if (animal.fotoUrl) {
        const img = document.createElement('img');
        img.src = animal.fotoUrl;
        img.alt = `Foto de ${animal.nome}`;
        img.classList.add('animal-photo-thumbnail');
        fotoCell.appendChild(img);
      } else {
        fotoCell.textContent = 'N/A';
      }
      row.appendChild(fotoCell);

      const makeCell = (html) => { const td = document.createElement('td'); td.innerHTML = html; return td; };
      row.appendChild(makeCell(animal.id));
      row.appendChild(makeCell(animal.brinco || ''));
      row.appendChild(makeCell(animal.nome));
      row.appendChild(makeCell(animal.peso ? (animal.peso + ' kg') : 'N/A'));
      row.appendChild(makeCell(getStatusReprodutivoDisplay(animal.statusReprodutivo)));
      row.appendChild(makeCell(`${formatDate(animal.dataNascimento)} (${calcularIdade(animal.dataNascimento)})`));

      const actions = document.createElement('td');
      actions.innerHTML = `
        <button class="btn-info btn-small" onclick="viewAnimal('${animal.id}')">Ver</button>
        <button class="btn-secondary btn-small" onclick="editAnimal('${animal.id}')">Editar</button>
        <button class="btn-danger btn-small" onclick="deleteAnimal('${animal.id}')">Excluir</button>
      `;
      row.appendChild(actions);

      DOM.animalListTbody.appendChild(row);
    });
  }

  // ---------- Open form ----------
  async function openAnimalForm(animal = null) {
    DOM.animalForm.reset();
    DOM.previewFotoImg.style.display = 'none';
    DOM.previewFotoImg.src = '';
    stopCamera();
    populateParentSelects();

    if (animal) {
      DOM.modalAnimalForm.querySelector('h3').textContent = 'Editar Animal';
      DOM.animalIdInput.value = animal.id;
      DOM.animalBrincoInput.value = animal.brinco || '';
      DOM.animalNomeInput.value = animal.nome || '';
      DOM.animalRacaInput.value = animal.raca || '';
      DOM.animalPesoInput.value = animal.peso || '';
      DOM.animalDataNascInput.value = animal.dataNascimento || '';
      DOM.animalSexoSelect.value = animal.sexo || '';
      DOM.animalStatusReprodutivoSelect.value = animal.statusReprodutivo || '';
      DOM.animalDataPartoInput.value = animal.dataParto || '';
      DOM.animalNumPartosInput.value = animal.numPartos || 0;
      DOM.animalNumLactacoesInput.value = animal.numLactacoes || 0;
      if (animal.pai) DOM.animalPaiSelect.value = animal.pai; else DOM.animalPaiSelect.value = '';
      if (animal.mae) DOM.animalMaeSelect.value = animal.mae; else DOM.animalMaeSelect.value = '';
      DOM.animalDataCoberturaInput.value = animal.dataCobertura || '';
      DOM.animalObservacoesTextarea.value = animal.observacoes || '';
      DOM.animalObservacoesClinicasTextarea.value = animal.observacoesClinicas || '';
      DOM.animalFotoUrlInput.value = animal.fotoUrl || '';
      if (animal.fotoUrl) { DOM.previewFotoImg.src = animal.fotoUrl; DOM.previewFotoImg.style.display = 'block'; }
      buildVaccineControls(animal);
      buildEventListUI(animal);
      currentAnimalId = animal.id;
      DOM.animalDataPartoGroup.style.display = animal.statusReprodutivo === 'lactante' ? 'block' : 'none';
    } else {
      DOM.modalAnimalForm.querySelector('h3').textContent = 'Registar Novo Animal';
      // Show preview id but DO NOT increment config yet
      DOM.animalIdInput.value = `${config.idPrefix}${padNumber(config.idNext, 3)}`;
      DOM.animalBrincoInput.value = '';
      DOM.animalNomeInput.value = '';
      DOM.animalRacaInput.value = '';
      DOM.animalPesoInput.value = '';
      DOM.animalDataNascInput.value = '';
      DOM.animalSexoSelect.value = '';
      DOM.animalStatusReprodutivoSelect.value = 'vazia';
      DOM.animalDataPartoInput.value = '';
      DOM.animalNumPartosInput.value = 0;
      DOM.animalNumLactacoesInput.value = 0;
      DOM.animalPaiSelect.value = '';
      DOM.animalMaeSelect.value = '';
      DOM.animalDataCoberturaInput.value = '';
      DOM.animalObservacoesTextarea.value = '';
      DOM.animalObservacoesClinicasTextarea.value = '';
      DOM.animalFotoUrlInput.value = '';
      buildVaccineControls(null);
      buildEventListUI(null);
      currentAnimalId = '';
      DOM.animalDataPartoGroup.style.display = 'none';
    }
    await enumerateCameras();
    openModal(DOM.modalAnimalForm);
    setTimeout(() => {
      (DOM.animalBrincoInput && DOM.animalBrincoInput.value === '') ? DOM.animalBrincoInput.focus() : DOM.animalNomeInput.focus();
    }, 200);
  }

  // ---------- Merge unique events helper ----------
  function mergeUniqueEvents(existingEvents = [], newEvents = []) {
    const result = existingEvents.slice();
    newEvents.forEach(ne => {
      const exists = result.some(re => re.type === ne.type && re.date === ne.date && (re.details || '').trim() === (ne.details || '').trim());
      if (!exists) result.push(ne);
    });
    return result;
  }

  // ---------- Save animal ----------
  async function salvarAnimal(event) {
    event.preventDefault();
    const formIdValue = DOM.animalIdInput.value && DOM.animalIdInput.value.trim();
    const isNewPreview = !currentAnimalId; // if opening form with no currentAnimalId => new
    const brinco = (DOM.animalBrincoInput.value || '').trim();
    const nome = (DOM.animalNomeInput.value || '').trim();
    const raca = (DOM.animalRacaInput.value || '').trim();
    const peso = parseFloat(DOM.animalPesoInput.value) || null;
    const dataNascimento = DOM.animalDataNascInput.value || null;
    const sexo = DOM.animalSexoSelect.value || '';
    const statusReprodutivo = DOM.animalStatusReprodutivoSelect.value || '';
    const dataParto = DOM.animalDataPartoInput.value || null;
    const numPartos = parseInt(DOM.animalNumPartosInput.value) || 0;
    const numLactacoes = parseInt(DOM.animalNumLactacoesInput.value) || 0;
    const pai = DOM.animalPaiSelect.value || null;
    const mae = DOM.animalMaeSelect.value || null;
    const dataCobertura = DOM.animalDataCoberturaInput.value || null;
    const observacoes = DOM.animalObservacoesTextarea.value || '';
    const observacoesClinicas = DOM.animalObservacoesClinicasTextarea.value || '';
    const fotoUrlFromInput = (DOM.animalFotoUrlInput.value || '').trim();

    // Basic validations
    if (!nome) { showInlineValidation(DOM.animalNomeInput, 'Nome obrigatório'); return; } else clearInlineValidation(DOM.animalNomeInput);
    if (!dataNascimento) { showInlineValidation(DOM.animalDataNascInput, 'Data de nascimento obrigatória'); return; } else clearInlineValidation(DOM.animalDataNascInput);
    if (!sexo) { showInlineValidation(DOM.animalSexoSelect, 'Sexo obrigatório'); return; } else clearInlineValidation(DOM.animalSexoSelect);
    if (peso !== null && peso <= 0) { showInlineValidation(DOM.animalPesoInput, 'Peso deve ser maior que 0'); return; } else clearInlineValidation(DOM.animalPesoInput);
    if (statusReprodutivo === 'lactante' && !dataParto) { showInlineValidation(DOM.animalDataPartoInput, 'Data do último parto obrigatória para lactantes'); return; } else clearInlineValidation(DOM.animalDataPartoInput);

    // Parent validation: cannot be self; pai must be macho; mae must be femea
    if (pai) {
      if (pai === formIdValue) { showInlineValidation(DOM.animalPaiSelect, 'Pai não pode ser o próprio animal'); return; } else clearInlineValidation(DOM.animalPaiSelect);
      const paiObj = animais.find(a => a.id === pai);
      if (paiObj && paiObj.sexo !== 'macho') { showInlineValidation(DOM.animalPaiSelect, 'Pai selecionado não é macho'); return; } else clearInlineValidation(DOM.animalPaiSelect);
    }
    if (mae) {
      if (mae === formIdValue) { showInlineValidation(DOM.animalMaeSelect, 'Mãe não pode ser o próprio animal'); return; } else clearInlineValidation(DOM.animalMaeSelect);
      const maeObj = animais.find(a => a.id === mae);
      if (maeObj && maeObj.sexo !== 'femea') { showInlineValidation(DOM.animalMaeSelect, 'Mãe selecionada não é fêmea'); return; } else clearInlineValidation(DOM.animalMaeSelect);
    }

    // Brinco uniqueness
    if (brinco) {
      const existingBrinco = animais.find(a => a.brinco === brinco && a.id !== currentAnimalId);
      if (existingBrinco) { showInlineValidation(DOM.animalBrincoInput, 'Brinco já existe para outro animal'); return; } else clearInlineValidation(DOM.animalBrincoInput);
    }

    // Photo handling
    let finalPhoto = fotoUrlFromInput || null;
    if (DOM.animalFotoInput && DOM.animalFotoInput.files && DOM.animalFotoInput.files.length > 0) {
      finalPhoto = await resizeImageFile(DOM.animalFotoInput.files[0], 800, 0.75);
      // Optional size limit check (500KB)
      try {
        const b = await (await fetch(finalPhoto)).blob();
        if (b.size > 500 * 1024) {
          // warn but still accept
          showCustomAlert('Imagem processada, mas ainda maior que 500KB. Considere reduzir a imagem.');
        }
      } catch (err) { /* ignore */ }
    }

    // Vaccines: collect historico
    const vacinas = [];
    const vaccineItems = DOM.vaccineCheckboxesContainer.querySelectorAll('.vaccine-item');
    vaccineItems.forEach(item => {
      const title = item.querySelector('strong')?.textContent || '';
      const historyDiv = item.querySelector('.vaccine-history');
      const historico = [];
      historyDiv.querySelectorAll('.vaccine-history-item').forEach(hItem => {
        const dateVal = hItem.querySelector('.vaccine-date')?.value || null;
        const obs = hItem.querySelector('.vaccine-note')?.value || '';
        if (dateVal) historico.push({ data: dateVal, observacao: obs });
      });
      if (title) vacinas.push({ nome: title, historico });
    });

    // Events: collect from UI
    const eventsFromUI = [];
    DOM.animalEventsList.querySelectorAll('.event-mini').forEach(em => {
      const type = em.querySelector('.event-type')?.value || 'observacao';
      const date = em.querySelector('.event-date')?.value || new Date().toISOString().split('T')[0];
      const details = em.querySelector('.event-details')?.value || '';
      eventsFromUI.push({ type, date, details });
    });

    // Build animal object - assign ID atomically if creating new
    let assignedId = formIdValue;
    const existingIdx = animais.findIndex(a => a.id === assignedId);
    const creatingNew = (!currentAnimalId || existingIdx === -1) && !animais.some(a => a.id === assignedId && a.id === currentAnimalId);

    if (creatingNew) {
      // If the preview id was used, ensure we generate and increment atomic id
      // If user supplied a custom ID (not equal to preview) allow it but ensure uniqueness
      // If the preview id equals config preview, generate atomic id so config advances
      const previewId = `${config.idPrefix}${padNumber(config.idNext, 3)}`;
      if (!assignedId || assignedId === '' || assignedId === previewId) {
        assignedId = getNextIdAtomic();
      } else {
        // user-supplied id: ensure uniqueness
        if (animais.find(a => a.id === assignedId)) {
          // conflict: generate new
          assignedId = getNextIdAtomic();
        }
      }
    }

    // merge existing events with UI events without duplicates
    const existingAnimal = animais.find(a => a.id === assignedId);
    const existingEvents = existingAnimal ? (existingAnimal.events || []) : [];
    const mergedEvents = mergeUniqueEvents(existingEvents, eventsFromUI);

    const animalObj = {
      id: assignedId,
      brinco: brinco || null,
      nome,
      raca,
      peso,
      dataNascimento,
      sexo,
      statusReprodutivo,
      dataParto,
      numPartos,
      numLactacoes,
      pai: pai || null,
      mae: mae || null,
      dataCobertura,
      observacoes,
      observacoesClinicas,
      fotoUrl: finalPhoto,
      producaoLeite: existingAnimal ? (existingAnimal.producaoLeite || []) : [],
      vacinas,
      events: mergedEvents
    };

    // Save: update or push
    const idx = animais.findIndex(a => a.id === assignedId);
    if (idx > -1) {
      animais[idx] = Object.assign({}, animais[idx], animalObj);
    } else {
      animais.push(animalObj);
    }

    saveStorage();
    renderAnimalList();
    updateDashboard();
    closeModal(DOM.modalAnimalForm);
    showCustomAlert('Dados do animal guardados com sucesso!');
  }

  // ---------- View/Edit/Delete exposed ----------
  function viewAnimal(id) {
    const animal = animais.find(a => a.id === id);
    if (!animal) return;
    DOM.detalhesAnimalTitulo.textContent = `Detalhes do Animal: ${animal.nome} (${animal.id})`;
    let vacinasHtml = '<h4>Histórico de Vacinas</h4>';
    if (animal.vacinas && animal.vacinas.length) {
      vacinasHtml += '<ul>';
      animal.vacinas.forEach(v => {
        vacinasHtml += `<li><strong>${v.nome}</strong>: `;
        if (v.historico && v.historico.length) {
          vacinasHtml += '<ul>';
          v.historico.forEach(h => vacinasHtml += `<li>${formatDate(h.data)} ${h.observacao ? '- ' + h.observacao : ''}</li>`);
          vacinasHtml += '</ul>';
        } else vacinasHtml += 'Sem histórico';
        vacinasHtml += '</li>';
      });
      vacinasHtml += '</ul>';
    } else vacinasHtml += '<p>Sem registos de vacinas.</p>';

    DOM.detalhesAnimalConteudo.innerHTML = `
      ${animal.fotoUrl ? `<img src="${animal.fotoUrl}" alt="Foto do Animal" class="details-image">` : ''}
      <div>
        <p><strong>ID:</strong> ${animal.id}</p>
        <p><strong>Brinco:</strong> ${animal.brinco || 'N/A'}</p>
        <p><strong>Nome:</strong> ${animal.nome}</p>
        <p><strong>Raça:</strong> ${animal.raca || 'N/A'}</p>
        <p><strong>Peso:</strong> ${animal.peso ? animal.peso + ' kg' : 'N/A'}</p>
        <p><strong>Data Nasc.:</strong> ${formatDate(animal.dataNascimento)} (${calcularIdade(animal.dataNascimento)})</p>
        <p><strong>Sexo:</strong> ${animal.sexo === 'femea' ? 'Fêmea' : 'Macho'}</p>
        <p><strong>Status Reprodutivo:</strong> ${getStatusReprodutivoDisplay(animal.statusReprodutivo)}</p>
        ${animal.dataParto ? `<p><strong>Data Último Parto:</strong> ${formatDate(animal.dataParto)}</p>` : ''}
        <p><strong>Nº Partos:</strong> ${animal.numPartos || 0}</p>
        <p><strong>Nº Lactações:</strong> ${animal.numLactacoes || 0}</p>
        <p><strong>Data Última Cobertura:</strong> ${formatDate(animal.dataCobertura)}</p>
        <p><strong>Pai:</strong> ${animal.pai || 'N/A'}</p>
        <p><strong>Mãe:</strong> ${animal.mae || 'N/A'}</p>
        <p><strong>Observações:</strong> ${animal.observacoes || 'N/A'}</p>
        <p><strong>Observações Clínicas:</strong> ${animal.observacoesClinicas || 'N/A'}</p>
        ${vacinasHtml}
      </div>
    `;

    DOM.detalhesAnimalTimeline.innerHTML = '<h4>Timeline de Eventos</h4>';
    if (animal.events && animal.events.length) {
      const sortedEvents = [...animal.events].sort((a, b) => new Date(b.date) - new Date(a.date));
      sortedEvents.forEach(e => {
        const div = document.createElement('div'); div.className = 'event-item';
        div.innerHTML = `<strong>${e.type}</strong> — ${formatDate(e.date)} <div>${e.details || ''}</div>`;
        DOM.detalhesAnimalTimeline.appendChild(div);
      });
    } else {
      DOM.detalhesAnimalTimeline.innerHTML += '<p>Nenhum evento registado.</p>';
    }
    openModal(DOM.modalDetalhesAnimal);
  }

  function editAnimal(id) {
    const animal = animais.find(a => a.id === id);
    if (animal) openAnimalForm(animal);
  }

  function deleteAnimal(id) {
    showCustomConfirm(`Tem certeza que deseja excluir o animal com ID ${id}?`, () => {
      animais = animais.filter(a => a.id !== id);
      saveStorage();
      renderAnimalList();
      updateDashboard();
      showCustomAlert('Animal excluído com sucesso!');
    });
  }

  // ---------- Tarefas (CRUD) ----------
  function getNextTaskId() {
    const next = typeof config.nextTaskNum === 'number' && !isNaN(config.nextTaskNum) ? config.nextTaskNum : 1;
    const id = `T${padNumber(next, 3)}`;
    config.nextTaskNum = next + 1;
    saveStorage();
    return id;
  }

  function populateTarefaAnimalSelect() {
    if (!DOM.tarefaAnimalSelect) return;
    DOM.tarefaAnimalSelect.innerHTML = '<option value="">Nenhum</option>';
    animais.forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.id;
      opt.textContent = `${a.nome} (${a.id})`;
      DOM.tarefaAnimalSelect.appendChild(opt);
    });
  }

  function openTarefaForm() {
    if (!DOM.modalTarefaForm) return;
    DOM.tarefaForm.reset();
    populateTarefaAnimalSelect();
    if (DOM.tarefaData) DOM.tarefaData.value = new Date().toISOString().split('T')[0];
    DOM.modalTarefaForm.querySelector('h3').textContent = 'Adicionar Nova Tarefa';
    openModal(DOM.modalTarefaForm);
    setTimeout(() => DOM.tarefaNomeInput && DOM.tarefaNomeInput.focus(), 150);
  }

  function salvarTarefa(event) {
    event.preventDefault();
    const nome = (DOM.tarefaNomeInput?.value || '').trim();
    const data = DOM.tarefaData?.value || '';
    const hora = DOM.tarefaHora?.value || '';
    const animalId = DOM.tarefaAnimalSelect?.value || '';
    const descricao = (DOM.tarefaDescricao?.value || '').trim();
    if (!nome) { showInlineValidation(DOM.tarefaNomeInput, 'Nome obrigatório'); return; } else clearInlineValidation(DOM.tarefaNomeInput);
    if (!data) { showInlineValidation(DOM.tarefaData, 'Data obrigatória'); return; } else clearInlineValidation(DOM.tarefaData);
    const tarefa = { id: getNextTaskId(), nome, data, hora, animalId: animalId || '', descricao, concluida: false };
    tarefas.push(tarefa);
    saveStorage();
    renderProximasTarefas();
    updateDashboard();
    closeModal(DOM.modalTarefaForm);
    showCustomAlert('Tarefa adicionada!');
  }

  function markTarefaConcluida(id) {
    const idx = tarefas.findIndex(t => t.id === id);
    if (idx > -1) {
      tarefas[idx].concluida = !tarefas[idx].concluida;
      saveStorage();
      renderProximasTarefas();
      updateDashboard();
    }
  }

  function deleteTarefa(id) {
    showCustomConfirm('Deseja remover esta tarefa?', () => {
      tarefas = tarefas.filter(t => t.id !== id);
      saveStorage();
      renderProximasTarefas();
      updateDashboard();
      showCustomAlert('Tarefa removida.');
    });
  }

  function renderProximasTarefas() {
    const ul = DOM.proximasTarefasLista;
    const calUl = DOM.listaTarefasCalendario;
    if (!ul) return;
    ul.innerHTML = '';
    const sorted = [...tarefas].sort((a, b) => {
      const aKey = `${a.data || ''} ${a.hora || ''}`.trim();
      const bKey = `${b.data || ''} ${b.hora || ''}`.trim();
      return aKey.localeCompare(bKey);
    });
    if (sorted.length === 0) {
      ul.innerHTML = '<li>Nenhuma tarefa pendente.</li>';
    } else {
      sorted.forEach(t => {
        const li = document.createElement('li');
        li.className = 'task-item' + (t.concluida ? ' completed' : '');
        const animal = animais.find(a => a.id === t.animalId);
        const animalText = animal ? `${animal.nome} (${animal.id})` : '—';
        li.innerHTML = `
          <div class="task-info">
            <h4>${t.nome}</h4>
            <div>${formatDate(t.data)} ${t.hora ? t.hora : ''} • Animal: ${animalText}</div>
            ${t.descricao ? `<div>${t.descricao}</div>` : ''}
          </div>
          <div class="task-actions">
            <button type="button" class="btn-success btn-small" data-action="toggle" data-id="${t.id}">${t.concluida ? 'Reabrir' : 'Concluir'}</button>
            <button type="button" class="btn-danger btn-small" data-action="delete" data-id="${t.id}">Excluir</button>
          </div>
        `;
        ul.appendChild(li);
      });
      ul.querySelectorAll('[data-action="toggle"]').forEach(btn => btn.addEventListener('click', (ev) => markTarefaConcluida(ev.currentTarget.getAttribute('data-id'))));
      ul.querySelectorAll('[data-action="delete"]').forEach(btn => btn.addEventListener('click', (ev) => deleteTarefa(ev.currentTarget.getAttribute('data-id'))));
    }

    if (calUl) {
      calUl.innerHTML = '';
      const today = new Date();
      const ym = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
      const monthTasks = sorted.filter(t => (t.data || '').startsWith(ym));
      if (monthTasks.length === 0) calUl.innerHTML = '<li>Nenhuma tarefa agendada neste mês.</li>';
      else monthTasks.slice(0, 10).forEach(t => {
        const li = document.createElement('li');
        li.textContent = `${formatDate(t.data)} ${t.hora ? t.hora : ''} - ${t.nome}`;
        calUl.appendChild(li);
      });
    }
  }

  // ---------- Dairy control ----------
  function populateSelectVacaLactacao() {
    if (!DOM.selectVacaLactacao) return;
    DOM.selectVacaLactacao.innerHTML = '<option value="">Selecione uma vaca lactante</option>';
    animais.filter(a => a.sexo === 'femea' && a.statusReprodutivo === 'lactante').forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.id;
      opt.textContent = `${a.nome} (${a.id})`;
      DOM.selectVacaLactacao.appendChild(opt);
    });
  }

  function renderProducaoLeiteHistorico(vacaId) {
    const tbody = DOM.producaoLeiteTbody;
    if (!tbody) return;
    const vaca = animais.find(a => a.id === vacaId);
    tbody.innerHTML = '';
    if (!vaca) {
      tbody.innerHTML = '<tr><td colspan="4">Selecione uma vaca para ver o histórico de produção.</td></tr>';
      return;
    }
    const records = [...(vaca.producaoLeite || [])].sort((a, b) => (b.data || '').localeCompare(a.data || '') || (a.periodo || '').localeCompare(b.periodo || ''));
    if (records.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4">Sem registos de produção.</td></tr>';
      return;
    }
    records.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${formatDate(r.data)}</td>
        <td>${r.periodo === 'manha' ? 'Manhã' : 'Tarde'}</td>
        <td>${Number(r.quantidade).toFixed(1)}</td>
        <td><button type="button" class="btn-danger btn-small" data-action="del-milk" data-id="${r.id}">Excluir</button></td>
      `;
      tbody.appendChild(tr);
    });
    tbody.querySelectorAll('[data-action="del-milk"]').forEach(btn => btn.addEventListener('click', (ev) => deleteMilkRecord(vaca.id, ev.currentTarget.getAttribute('data-id'))));
  }

  function registrarProducaoLeite() {
    const vacaId = DOM.selectVacaLactacao?.value || '';
    const quantidade = parseFloat(DOM.leiteQuantidadeInput?.value);
    const data = DOM.leiteDataInput?.value || '';
    const periodo = DOM.leitePeriodoSelect?.value || '';
    if (!vacaId) { showCustomAlert('Selecione uma vaca.'); return; }
    if (!data) { showInlineValidation(DOM.leiteDataInput, 'Data obrigatória'); return; } else clearInlineValidation(DOM.leiteDataInput);
    if (!periodo) { showInlineValidation(DOM.leitePeriodoSelect, 'Período obrigatório'); return; } else clearInlineValidation(DOM.leitePeriodoSelect);
    if (!quantidade || quantidade <= 0) { showInlineValidation(DOM.leiteQuantidadeInput, 'Quantidade inválida'); return; } else clearInlineValidation(DOM.leiteQuantidadeInput);
    const vaca = animais.find(a => a.id === vacaId);
    if (!vaca) { showCustomAlert('Vaca não encontrada.'); return; }
    if (!Array.isArray(vaca.producaoLeite)) vaca.producaoLeite = [];
    const rec = { id: `ML${Date.now()}`, quantidade, data, periodo };
    vaca.producaoLeite.push(rec);
    // log event
    if (!Array.isArray(vaca.events)) vaca.events = [];
    vaca.events.push({ type: 'producao', date: data, details: `${periodo}: ${quantidade.toFixed(1)} L` });
    saveStorage();
    renderProducaoLeiteHistorico(vacaId);
    updateProducaoDiariaChart();
    updateDashboard();
    showCustomAlert('Produção registada!');
  }

  function deleteMilkRecord(vacaId, recordId) {
    const vaca = animais.find(a => a.id === vacaId);
    if (!vaca) return;
    vaca.producaoLeite = (vaca.producaoLeite || []).filter(r => r.id !== recordId);
    saveStorage();
    renderProducaoLeiteHistorico(vacaId);
    updateProducaoDiariaChart();
    updateDashboard();
    showCustomAlert('Registo de produção removido.');
  }

  // ---------- Charts & Dashboard ----------
  function getLastNDaysIso(n = 7) {
    const arr = [];
    const today = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      arr.push(d.toISOString().split('T')[0]);
    }
    return arr;
  }

  function updateProducaoDiariaChart() {
    if (!DOM.producaoDiariaChartCanvas || typeof Chart === 'undefined') return;
    if (charts.producaoDiaria) { charts.producaoDiaria.destroy(); charts.producaoDiaria = null; }
    const days = getLastNDaysIso(7);
    const totals = days.map(d => {
      let sum = 0;
      animais.forEach(a => (a.producaoLeite || []).forEach(r => { if (r.data === d) sum += Number(r.quantidade) || 0; }));
      return Number(sum.toFixed(1));
    });
    const labels = days.map(d => {
      const [y,m,dd] = d.split('-');
      return `${dd}/${m}`;
    });
    const ctx = DOM.producaoDiariaChartCanvas.getContext('2d');
    charts.producaoDiaria = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Litros',
          data: totals,
          borderColor: varToRgb('--primary-color', 0.9),
          backgroundColor: varToRgb('--primary-color', 0.15),
          tension: 0.25,
          fill: true,
          pointRadius: 3
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
    });
  }

  function updateDistribuicaoRebanhoChart() {
    if (!DOM.distribuicaoRebanhoChartCanvas || typeof Chart === 'undefined') return;
    if (charts.distribuicaoRebanho) { charts.distribuicaoRebanho.destroy(); charts.distribuicaoRebanho = null; }
    const categorias = ['lactante','seca','prenha','novilha','recria','cria','touro','rufao','indefinida'];
    const labels = categorias.map(getStatusReprodutivoDisplay);
    const data = categorias.map(c => animais.filter(a => a.statusReprodutivo === c).length);
    const colors = [
      varToRgb('--primary-color', 0.8),
      varToRgb('--info-color', 0.8),
      varToRgb('--accent-color', 0.8),
      'rgba(100, 181, 246, 0.8)',
      'rgba(174, 213, 129, 0.8)',
      'rgba(255, 204, 128, 0.8)',
      'rgba(144, 164, 174, 0.8)',
      'rgba(255, 138, 128, 0.8)',
      'rgba(206, 147, 216, 0.8)'
    ];
    const ctx = DOM.distribuicaoRebanhoChartCanvas.getContext('2d');
    charts.distribuicaoRebanho = new Chart(ctx, {
      type: 'doughnut',
      data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 1 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });
  }

  function updateDashboard() {
    if (DOM.totalAnimais) DOM.totalAnimais.textContent = String(animais.length);
    const lact = animais.filter(a => a.statusReprodutivo === 'lactante').length;
    if (DOM.vacasLactacao) DOM.vacasLactacao.textContent = String(lact);
    const pend = tarefas.filter(t => !t.concluida).length;
    if (DOM.tarefasPendentes) DOM.tarefasPendentes.textContent = String(pend);

    // Próximos partos (base: dataCobertura + 290 dias)
    const partoUl = DOM.proximosPartosLista; if (partoUl) {
      partoUl.innerHTML = '';
      const today = new Date();
      const max = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
      const items = animais.filter(a => a.dataCobertura).map(a => {
        const d = new Date(a.dataCobertura);
        d.setDate(d.getDate() + 290);
        return { a, parto: d };
      }).filter(x => x.parto >= today && x.parto <= max)
        .sort((x,y) => x.parto - y.parto);
      if (items.length === 0) partoUl.innerHTML = '<li>Nenhuma vaca com parto previsto para os próximos 7 dias.</li>';
      else items.forEach(({a, parto}) => {
        const li = document.createElement('li');
        const iso = parto.toISOString().split('T')[0];
        li.textContent = `${a.nome} (${a.id}) — ${formatDate(iso)}`;
        partoUl.appendChild(li);
      });
    }

    // Próximos cios (base: dataParto + 45 dias)
    const cioUl = DOM.proximosCioLista; if (cioUl) {
      cioUl.innerHTML = '';
      const today = new Date();
      const max = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30);
      const items = animais.filter(a => a.dataParto).map(a => {
        const d = new Date(a.dataParto);
        d.setDate(d.getDate() + 45);
        return { a, cio: d };
      }).filter(x => x.cio >= today && x.cio <= max)
        .sort((x,y) => x.cio - y.cio);
      if (items.length === 0) cioUl.innerHTML = '<li>Nenhuma vaca em cio previsto para os próximos 30 dias.</li>';
      else items.forEach(({a, cio}) => {
        const li = document.createElement('li');
        const iso = cio.toISOString().split('T')[0];
        li.textContent = `${a.nome} (${a.id}) — ${formatDate(iso)}`;
        cioUl.appendChild(li);
      });
    }

    // Charts
    updateProducaoDiariaChart();
    updateDistribuicaoRebanhoChart();
  }

  // ---------- Reports ----------
  function exportToCsv() {
    const headers = ['id','brinco','nome','raca','peso','dataNascimento','sexo','statusReprodutivo','dataParto','dataCobertura','observacoes','fotoUrl'];
    const esc = (v) => {
      if (v === null || v === undefined) return '';
      const s = String(v);
      if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
      return s;
    };
    const rows = animais.map(a => [a.id, a.brinco || '', a.nome || '', a.raca || '', a.peso ?? '', a.dataNascimento || '', a.sexo || '', a.statusReprodutivo || '', a.dataParto || '', a.dataCobertura || '', a.observacoes || '', a.fotoUrl || '']);
    const csv = [headers.join(','), ...rows.map(r => r.map(esc).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'animais_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showCustomAlert('CSV exportado com sucesso.');
  }

  function generateReportPdf() {
    try {
      const { jsPDF } = window.jspdf || {};
      if (!jsPDF) { showCustomAlert('Biblioteca jsPDF não carregada.'); return; }
      const doc = new jsPDF('p', 'pt');
      const tipo = DOM.selectRelatorioTipo?.value || '';
      const titleMap = {
        'animais-geral': 'Relatório de Animais (Geral)',
        'producao-mensal': 'Relatório de Produção (últimos 30 dias)',
        'tarefas-pendentes': 'Relatório de Tarefas Pendentes'
      };
      const title = titleMap[tipo] || 'Relatório';
      doc.setFontSize(16);
      doc.text(title, 40, 40);

      const body = [];
      let head = [];
      const fmt = (d) => d ? formatDate(d) : '';
      if (tipo === 'animais-geral') {
        head = [['ID','Brinco','Nome','Sexo','Status','Nascimento','Peso']];
        animais.forEach(a => body.push([a.id, a.brinco || '', a.nome || '', a.sexo === 'femea' ? 'Fêmea' : 'Macho', getStatusReprodutivoDisplay(a.statusReprodutivo), fmt(a.dataNascimento), a.peso ? `${a.peso} kg` : '']));
      } else if (tipo === 'producao-mensal') {
        head = [['Animal','Data','Período','Quantidade (L)']];
        const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30);
        animais.forEach(a => (a.producaoLeite || []).forEach(r => {
          const d = new Date(r.data);
          if (d >= cutoff) body.push([`${a.nome} (${a.id})`, fmt(r.data), r.periodo === 'manha' ? 'Manhã' : 'Tarde', Number(r.quantidade).toFixed(1)]);
        }));
      } else if (tipo === 'tarefas-pendentes') {
        head = [['Data','Hora','Tarefa','Animal']];
        tarefas.filter(t => !t.concluida).sort((a,b) => `${a.data} ${a.hora}`.localeCompare(`${b.data} ${b.hora}`)).forEach(t => {
          const animal = animais.find(a => a.id === t.animalId);
          body.push([fmt(t.data), t.hora || '', t.nome, animal ? `${animal.nome} (${animal.id})` : '—']);
        });
      } else {
        showCustomAlert('Selecione um tipo de relatório.');
        return;
      }

      if (doc.autoTable) {
        doc.autoTable({ head, body, startY: 60, styles: { fontSize: 10 } });
      }
      doc.save('relatorio.pdf');
    } catch (e) {
      console.error(e);
      showCustomAlert('Falha ao gerar PDF.');
    }
  }

  // ---------- CSV import robust parser (improved) ----------
  function parseCsvRow(line) {
    const res = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; continue; }
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === ',' && !inQuotes) { res.push(cur); cur = ''; continue; }
      cur += ch;
    }
    res.push(cur);
    return res;
  }

  function importCsvFile(event) {
    const file = event?.target?.files?.[0];
    if (!file) { showCustomAlert('Nenhum ficheiro CSV selecionado.'); return; }
    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
      if (lines.length === 0) { showCustomAlert('CSV vazio'); return; }
      const headersRaw = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
      const headers = headersRaw.map(h => h.normalize('NFKD'));
      const aliases = {
        id: ['id','identifier'],
        brinco: ['brinco','tag','chip','ear','ear_tag'],
        nome: ['nome','name'],
        raca: ['raca','raça','breed'],
        peso: ['peso','weight'],
        datanascimento: ['datanascimento','data_nascimento','birthdate','dob'],
        sexo: ['sexo','sex','gender'],
        statusreprodutivo: ['statusreprodutivo','status','reproductive_status'],
        dataparto: ['dataparto','data_parto'],
        datacobertura: ['datacobertura','data_cobertura'],
        observacoes: ['observacoes','observacoes','notes','obs'],
        foto: ['fotourl','foto','image','photo']
      };
      const mapIndex = {};
      headers.forEach((h, idx) => {
        for (const key in aliases) {
          if (aliases[key].includes(h) || h === key) { mapIndex[key] = idx; break; }
        }
      });
      let imported = 0, skipped = 0;
      for (let i = 1; i < lines.length; i++) {
        const row = parseCsvRow(lines[i]);
        if (!row || row.length === 0) continue;
        const get = (k) => {
          if (mapIndex[k] !== undefined && row[mapIndex[k]] !== undefined) return row[mapIndex[k]].replace(/^"|"$/g, '').trim();
          return '';
        };
        const nome = get('nome') || `SemNome_${i}`;
        let id = get('id');
        const brinco = get('brinco') || null;
        const raca = get('raca') || '';
        const peso = get('peso') ? parseFloat(get('peso')) : null;
        const dataNascimento = get('datanascimento') || null;
        const sexo = (get('sexo') || 'macho').toLowerCase();
        const statusReprodutivo = get('statusreprodutivo') || 'indefinida';
        const dataParto = get('dataparto') || null;
        const dataCobertura = get('datacobertura') || null;
        const observacoes = get('observacoes') || '';
        const fotoUrl = get('foto') || null;

        // determine ID and detect duplicates
        if (!id) {
          id = `${config.idPrefix}${padNumber(config.idNext, 3)}`;
          config.idNext++;
        } else {
          // if specified id already exists, create a new one instead
          if (animais.find(a => a.id === id)) {
            id = `${config.idPrefix}${padNumber(config.idNext, 3)}`;
            config.idNext++;
          }
        }

        // brinco duplicate check: if brinco exists, drop brinco to avoid conflict
        if (brinco && animais.find(a => a.brinco === brinco)) {
          // Skip or clear brinco - choose to clear to keep rest of data
          console.warn(`Brinco ${brinco} duplicado; será ignorado na linha ${i+1}.`);
        }

        const obj = {
          id,
          brinco: (brinco && !animais.find(a => a.brinco === brinco)) ? brinco : null,
          nome,
          raca,
          peso,
          dataNascimento,
          sexo,
          statusReprodutivo,
          dataParto,
          dataCobertura,
          observacoes,
          fotoUrl,
          producaoLeite: [],
          vacinas: [],
          events: []
        };
        animais.push(obj);
        imported++;
      }
      saveStorage();
      renderAnimalList();
      updateDashboard();
      showCustomAlert(`Import CSV: ${imported} importados, ${skipped} ignorados.`);
    };
    reader.readAsText(file);
  }

  // ---------- JSON Import/Export & Reset (kept robust) ----------
  function exportDataToJson() {
    const dataToExport = { animais, tarefas, config };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rebanho_data_backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showCustomAlert('Dados exportados para rebanho_data_backup.json!');
  }
  function importDataFromJson(event) {
    const file = event?.target?.files?.[0];
    if (!file) { showCustomAlert('Nenhum ficheiro selecionado.'); return; }
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const importedData = JSON.parse(e.target.result);
        if (importedData.animais && Array.isArray(importedData.animais) && importedData.tarefas && Array.isArray(importedData.tarefas)) {
          showCustomConfirm('Tem certeza que deseja restaurar os dados? Isso substituirá todos os dados atuais.', () => {
            animais = importedData.animais;
            tarefas = importedData.tarefas;
            config = Object.assign(config, importedData.config || {});
            saveStorage();
            updateDashboard();
            renderAnimalList();
            renderProximasTarefas();
            populateSelectVacaLactacao();
            populateTarefaAnimalSelect();
            showCustomAlert('Dados restaurados com sucesso!');
          });
        } else {
          showCustomAlert('Formato de ficheiro JSON inválido. O ficheiro deve conter arrays "animais" e "tarefas".');
        }
      } catch (error) {
        console.error('Erro ao ler ou analisar o ficheiro JSON:', error);
        showCustomAlert('Erro ao ler ou analisar o ficheiro JSON. Certifique-se de que é um ficheiro JSON válido.');
      }
    };
    reader.readAsText(file);
  }

  function resetAllData() {
    showCustomConfirm('Tem certeza que deseja REPOR TODOS OS DADOS? Esta ação não pode ser desfeita.', () => {
      localStorage.clear();
      animais = [];
      tarefas = [];
      config = { idPrefix: 'AN', idNext: 1, notificacoesPush: false, notificacoesAntecedenciaHoras: 24 };
      loadStorage();
      updateDashboard();
      renderAnimalList();
      renderProximasTarefas();
      populateSelectVacaLactacao();
      populateTarefaAnimalSelect();
      showCustomAlert('Todos os dados foram repostos!');
    });
  }

  // ---------- Inline validation & modal ----------
  function createCustomModal(message, type, callback = null) {
    const existing = document.getElementById('custom-app-modal');
    if (existing) existing.remove();
    const modal = document.createElement('div');
    modal.id = 'custom-app-modal';
    modal.classList.add('modal', 'active');
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = message;
    modalContent.appendChild(messageParagraph);
    const buttonContainer = document.createElement('div');
    buttonContainer.style.marginTop = '20px';
    buttonContainer.style.textAlign = 'right';
    if (type === 'alert') {
      const okButton = document.createElement('button');
      okButton.textContent = 'OK';
      okButton.classList.add('btn-primary');
      okButton.onclick = () => modal.remove();
      buttonContainer.appendChild(okButton);
    } else if (type === 'confirm') {
      const cancelButton = document.createElement('button');
      cancelButton.textContent = 'Cancelar';
      cancelButton.classList.add('btn-secondary');
      cancelButton.onclick = () => modal.remove();
      buttonContainer.appendChild(cancelButton);
      const confirmButton = document.createElement('button');
      confirmButton.textContent = 'Confirmar';
      confirmButton.classList.add('btn-danger');
      confirmButton.onclick = () => { modal.remove(); if (callback) callback(); };
      buttonContainer.appendChild(confirmButton);
    }
    modalContent.appendChild(buttonContainer);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  }
  function showCustomAlert(message) { createCustomModal(message, 'alert'); }
  function showCustomConfirm(message, callback) { createCustomModal(message, 'confirm', callback); }

  function showInlineValidation(el, message) {
    if (!el) return;
    el.style.borderColor = 'var(--danger-color)';
    let next = el.nextElementSibling;
    if (next && next.classList && next.classList.contains('inline-validation')) next.textContent = message;
    else {
      const span = document.createElement('div'); span.className = 'inline-validation'; span.style.color = 'var(--danger-color)'; span.style.fontSize = '0.85rem'; span.textContent = message; el.parentNode.insertBefore(span, el.nextSibling);
    }
  }
  function clearInlineValidation(el) {
    if (!el) return;
    el.style.borderColor = '';
    const next = el.nextElementSibling;
    if (next && next.classList && next.classList.contains('inline-validation')) next.remove();
  }

  // ---------- Initialization & event binding ----------
  document.addEventListener('DOMContentLoaded', () => {
    loadStorage();

    DOM.navLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = event.target.getAttribute('href').substring(1);
        showSection(targetId);
      });
    });

    DOM.closeModalButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const modal = event.target.closest('.modal');
        if (modal) { closeModal(modal); if (modal.id === 'modal-animal-form') stopCamera(); }
      });
    });

    // Animals
    DOM.btnNovoAnimal?.addEventListener('click', () => openAnimalForm());
    DOM.animalForm?.addEventListener('submit', salvarAnimal);
    DOM.filtroCategoriaSelect?.addEventListener('change', renderAnimalList);
    DOM.filtroBrincoInput?.addEventListener('input', renderAnimalList);
    DOM.buscaAnimalInput?.addEventListener('input', renderAnimalList);
    DOM.animalStatusReprodutivoSelect?.addEventListener('change', (event) => {
      if (event.target.value === 'lactante') DOM.animalDataPartoGroup.style.display = 'block';
      else { DOM.animalDataPartoGroup.style.display = 'none'; DOM.animalDataPartoInput.value = ''; }
    });

    // Photo & camera
    DOM.animalFotoInput?.addEventListener('change', previewFoto);
    DOM.openCameraButton?.addEventListener('click', async () => { await startCamera(DOM.cameraSelect.value || null); });
    DOM.captureButton?.addEventListener('click', capturarImagem);
    DOM.cameraSelect?.addEventListener('change', (event) => startCamera(event.target.value));

    // Events within animal form
    if (DOM.btnAddEvent) DOM.btnAddEvent.addEventListener('click', () => DOM.animalEventsList.appendChild(createEventMini('observacao', new Date().toISOString().split('T')[0], '')));

    // Tarefas
    DOM.btnNovaTarefa?.addEventListener('click', openTarefaForm);
    DOM.tarefaForm?.addEventListener('submit', salvarTarefa);

    // Dairy control
    DOM.selectVacaLactacao?.addEventListener('change', (event) => {
      const selectedVacaId = event.target.value;
      if (selectedVacaId) renderProducaoLeiteHistorico(selectedVacaId);
      else DOM.producaoLeiteTbody.innerHTML = '<tr><td colspan="4">Selecione uma vaca para ver o histórico de produção.</td></tr>';
    });
    DOM.btnRegistrarLeite?.addEventListener('click', registrarProducaoLeite);

    // Reports
    if (DOM.btnGerarRelatorioPdf) DOM.btnGerarRelatorioPdf.addEventListener('click', generateReportPdf);
    if (DOM.btnExportarCsv) DOM.btnExportarCsv.addEventListener('click', exportToCsv);

    // Settings
    if (DOM.btnExportarDados) DOM.btnExportarDados.addEventListener('click', exportDataToJson);
    if (DOM.inputImportarDados) DOM.inputImportarDados.addEventListener('change', (event) => DOM.btnImportarDados.disabled = !(event.target.files && event.target.files.length > 0));
    if (DOM.btnImportarDados) DOM.btnImportarDados.addEventListener('click', () => importDataFromJson({ target: DOM.inputImportarDados }));

    // CSV import
    if (DOM.inputImportarCsv) DOM.inputImportarCsv.addEventListener('change', importCsvFile);
    if (DOM.btnImportarCsv) DOM.btnImportarCsv.addEventListener('click', () => { if (DOM.inputImportarCsv.files && DOM.inputImportarCsv.files.length > 0) importCsvFile({ target: DOM.inputImportarCsv }); else showCustomAlert('Selecione um ficheiro CSV primeiro.'); });

    // Reset
    if (DOM.btnResetarDados) DOM.btnResetarDados.addEventListener('click', resetAllData);

    // Config input handlers
    if (DOM.configIdPrefix) DOM.configIdPrefix.addEventListener('change', () => { config.idPrefix = DOM.configIdPrefix.value || 'AN'; saveStorage(); });
    if (DOM.configIdNext) DOM.configIdNext.addEventListener('change', () => { const v = parseInt(DOM.configIdNext.value) || 1; config.idNext = v; saveStorage(); });

    // Initial render
    renderAnimalList();
    renderProximasTarefas();
    populateSelectVacaLactacao();
    populateTarefaAnimalSelect();
    if (DOM.leiteDataInput) DOM.leiteDataInput.value = new Date().toISOString().split('T')[0];
    if (DOM.tarefaData) DOM.tarefaData.value = new Date().toISOString().split('T')[0];
    if (DOM.btnImportarDados) DOM.btnImportarDados.disabled = true;
  });

  // ---------- Utilities used earlier (kept for compatibility) ----------
  function showSection(id) {
    DOM.pageSections.forEach(section => section.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
    DOM.navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
    if (id === 'dashboard') updateDashboard();
    else if (id === 'animais') renderAnimalList();
    else if (id === 'agenda') { renderProximasTarefas(); populateTarefaAnimalSelect(); }
    else if (id === 'controle-leiteiro') populateSelectVacaLactacao();
  }
  function openModal(modal) { modal && modal.classList && (modal.classList.add('active'), modal.style.display = 'flex'); }
  function closeModal(modal) { modal && modal.classList && (modal.classList.remove('active'), modal.style.display = 'none'); }

  // ---------- Expose global functions for inline handlers ----------
  window.viewAnimal = viewAnimal;
  window.editAnimal = editAnimal;
  window.deleteAnimal = deleteAnimal;
  window.previewFoto = previewFoto;
  window.capturarImagem = capturarImagem;
  window.openAnimalForm = openAnimalForm;
  window.showCustomAlert = showCustomAlert;
  window.showCustomConfirm = showCustomConfirm;
  window.exportDataToJson = exportDataToJson;
  window.importDataFromJson = importDataFromJson;
  window.resetAllData = resetAllData;
  window.generateReportPdf = generateReportPdf;
  window.exportToCsv = exportToCsv;

  // ---------- Note: functions referenced above but unchanged are expected to exist in the same file (e.g., tarefa handling, charts) ----------
  // If you want I can inline the remaining 'unchanged' functions here entirely, but to keep this patch focused I updated the save/import/merge logic and parent filtering.
})();