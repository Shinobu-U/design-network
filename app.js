        if (typeof cytoscapeSvg !== 'undefined') cytoscape.use(cytoscapeSvg);
        let cy;
        let currentData = [];
        let showName = true;
        let currentLayout = 'cose';
        let currentCommunity = 'none';
        let colorMode = 'specialty';
        let colorMap = {};
        let degreeDistChart = null;
        let isLogScale = false;
        let currentLanguage = 'ja';
        let isFullscreen = false;

        const specialtyNamesJa = ['建築', 'インテリア', 'プロダクト', 'グラフィック', '写真'];
        const specialtyNamesEn = ['Architecture', 'Interior', 'Product', 'Graphic Design', 'Photography'];

        const translations = {
            ja: {
                pageTitle: '「建築・デザイン事務所」中心のネットワーク調査',
                pageSubtitle: '建築・デザインの系譜を辿る。',
                pageSubtitleDesc: '建築・デザイン界のデザイナーの師弟関係をネットワーク図として可視化します。<br>また、所属事務所の在籍歴や独立年、デザイナーの国籍や留学先などから、デザイン界の系譜を辿ります。',
                langButtonText: 'English',
                uploadTitle: 'CSVファイルをアップロード',
                uploadText: 'ファイルをドラッグ&ドロップ または クリックして選択',
                uploadButton: 'ファイルを選択',
                dataEditTitle: 'データ編集',
                searchPlaceholder: '氏名、師匠、事務所名、出身校などで検索...',
                tableHeaders: { id: '識別番号', name: '氏名', nationality: '国籍', master: '師匠', school: '出身校', studyAbroad: '留学歴', firm: '所属事務所', specialty: '専門', lifespan: '生没年', joinYear: '在籍年', independentYear: '独立年', ownFirm: '設立事務所', note: '備考', action: '操作' },
                buttons: { delete: '削除', add: '＋ 新規データを追加', update: 'ネットワークを更新', download: '生データ', downloadMasked: '匿名化データ', downloadImage: 'ダウンロード', cancel: 'キャンセル', copy: 'コピー', copied: 'コピー済み' },
                exportTitle: '書き出し',
                drawingSettings: '描画設定',
                nodeColorLabel: 'ノード色分け',
                colorModes: { specialty: '専門（建築/インテリア/プロダクト/グラフィック/写真）', firm: '所属事務所', school: '出身校', ownFirm: '設立事務所', studyAbroad: '留学歴' },
                layoutLabel: 'レイアウト',
                layouts: { cose: 'Spring Layout (力指向)', breadthfirst: 'Breadthfirst (階層)', circle: 'Circle (円形)', grid: 'Grid (格子)', concentric: 'Concentric (同心円)', random: 'Random (ランダム)' },
                communityLabel: 'コミュニティ',
                communities: { none: '指定無し', firm: '所属事務所', school: '出身校', ownFirm: '設立事務所', specialty: '専門', nationality: '国籍' },
                metricsTitle: 'ネットワーク特徴量',
                degreeDistTitle: '次数分布',
                scaleToggleLinear: '対数表示',
                scaleToggleLog: '線形表示',
                metricLabels: { nodes: '全ノード数', edges: '全エッジ数', degree: '平均次数', clustering: 'クラスター係数', path: '平均パス長', efficiency: '大域効率', density: 'ネットワーク密度', components: '連結成分数', modularity: 'モジュラリティ' },
                metricsSummaryTitle: 'ネットワーク特徴量サマリー',
                usageTitle: '使い方',
                usageSteps: ['1. CSVファイルをドラッグ&ドロップまたはファイル選択でアップロード', '2. データ編集テーブルで情報を追加・編集・削除', '3. 「ネットワークを更新」ボタンでネットワーク図を表示', '4. ノード（人物）をドラッグして位置を調整、クリックで詳細情報表示', '5. 「CSVをダウンロード」ボタンで編集後のデータを保存'],
                addDataTitle: '新規データを追加',
                fullscreenEnter: '全画面表示',
                fullscreenExit: '戻る'
            },
            en: {
                pageTitle: 'Architecture & Design Lineage Network',
                pageSubtitle: 'Tracing the lineage of architecture and design.',
                pageSubtitleDesc: 'Visualizing the lineage of architecture and design through master-apprentice, mentorship, and training relationships.',
                langButtonText: '日本語',
                uploadTitle: 'Upload CSV File',
                uploadText: 'Drag & Drop or Click to Select File',
                uploadButton: 'Select File',
                dataEditTitle: 'Data Editing',
                searchPlaceholder: 'Search by name, mentor, firm, school...',
                tableHeaders: { id: 'ID', name: 'Name', nationality: 'Nationality', master: 'Mentor', school: 'School', studyAbroad: 'Study Abroad', firm: 'Firm/Studio', specialty: 'Specialty', lifespan: 'Lifespan', joinYear: 'Join Year', independentYear: 'Independent', ownFirm: 'Founded Firm', note: 'Note', action: 'Action' },
                buttons: { delete: 'Delete', add: '+ Add New', update: 'Update Network', download: 'Raw Data', downloadMasked: 'Anonymized', downloadImage: 'Download', cancel: 'Cancel', copy: 'Copy', copied: 'Copied' },
                exportTitle: 'Export',
                drawingSettings: 'Display Settings',
                nodeColorLabel: 'Node Coloring',
                colorModes: { specialty: 'Specialty', firm: 'Firm/Studio', school: 'School', ownFirm: 'Founded Firm', studyAbroad: 'Study Abroad' },
                layoutLabel: 'Layout',
                layouts: { cose: 'Spring Layout (Force-directed)', breadthfirst: 'Breadthfirst (Hierarchical)', circle: 'Circle', grid: 'Grid', concentric: 'Concentric', random: 'Random' },
                communityLabel: 'Community',
                communities: { none: 'None', firm: 'Firm/Studio', school: 'School', ownFirm: 'Founded Firm', specialty: 'Specialty', nationality: 'Nationality' },
                metricsTitle: 'Network Metrics',
                degreeDistTitle: 'Degree Distribution',
                scaleToggleLinear: 'Log Scale',
                scaleToggleLog: 'Linear Scale',
                metricLabels: { nodes: 'Nodes', edges: 'Edges', degree: 'Avg. Degree', clustering: 'Clustering', path: 'Avg. Path Length', efficiency: 'Global Efficiency', density: 'Density', components: 'Components', modularity: 'Modularity' },
                metricsSummaryTitle: 'Network Metrics Summary',
                usageTitle: 'How to Use',
                usageSteps: ['1. Upload CSV file by drag & drop or file selection', '2. Add, edit, or delete data in the editing table', '3. Click "Update Network" to display the graph', '4. Drag nodes to adjust positions, click for details', '5. Click "Download CSV" to save edited data'],
                addDataTitle: 'Add New Data',
                fullscreenEnter: 'Fullscreen',
                fullscreenExit: 'Exit'
            }
        };

        function toggleFullscreen() {
            const container = document.getElementById('networkDisplayContainer');
            const t = translations[currentLanguage];
            isFullscreen = !isFullscreen;
            if (isFullscreen) { container.classList.add('fullscreen'); document.getElementById('fullscreenText').textContent = t.fullscreenExit; document.getElementById('fullscreenIcon').textContent = '⮌'; }
            else { container.classList.remove('fullscreen'); document.getElementById('fullscreenText').textContent = t.fullscreenEnter; document.getElementById('fullscreenIcon').textContent = '⛶'; }
            if (cy && currentData.length > 0) setTimeout(() => { const { nodes, edges } = createNetworkData(currentData); visualizeNetwork(nodes, edges); updateLegend(); calculateNetworkMetrics(); }, 100);
        }

        function toggleLanguage() { currentLanguage = currentLanguage === 'ja' ? 'en' : 'ja'; updateLanguage(); }

        function updateLanguage() {
            const t = translations[currentLanguage];
            document.getElementById('pageTitle').textContent = t.pageTitle;
            document.getElementById('pageSubtitle').innerHTML = t.pageSubtitle;
            document.getElementById('pageSubtitleDesc').innerHTML = t.pageSubtitleDesc;
            document.getElementById('langText').textContent = t.langButtonText;
            document.title = t.pageTitle;
            document.getElementById('uploadTitle').textContent = t.uploadTitle;
            document.getElementById('uploadText').textContent = t.uploadText;
            document.getElementById('uploadButton').textContent = t.uploadButton;
            const det = document.getElementById('dataEditTitle'); if (det) det.textContent = t.dataEditTitle;
            const sl = document.getElementById('searchLabel'); if (sl) sl.textContent = currentLanguage === 'ja' ? 'キーワード検索' : 'Search';
            document.getElementById('searchBox').placeholder = t.searchPlaceholder;
            updateTableHeaders();
            const dst = document.getElementById('drawingSettingsTitle'); if (dst) dst.textContent = t.drawingSettings;
            const lnc = document.getElementById('labelNodeColor'); if (lnc) lnc.textContent = t.nodeColorLabel;
            updateSelectOptions('colorModeSelect', t.colorModes);
            const ll = document.getElementById('labelLayout'); if (ll) ll.textContent = t.layoutLabel;
            updateSelectOptions('layoutSelect', t.layouts);
            const lc = document.getElementById('labelCommunity'); if (lc) lc.textContent = t.communityLabel;
            updateSelectOptions('communitySelect', t.communities);
            const mt = document.getElementById('metricsTitle'); if (mt) mt.textContent = t.metricsTitle;
            const ddt = document.getElementById('degreeDistTitle'); if (ddt) ddt.textContent = t.degreeDistTitle;
            const sb = document.getElementById('scaleToggleBtn'); if (sb) sb.textContent = isLogScale ? t.scaleToggleLog : t.scaleToggleLinear;
            updateMetricLabels();
            const ut = document.getElementById('usageTitle'); if (ut) ut.textContent = t.usageTitle;
            for (let i = 1; i <= 5; i++) { const el = document.getElementById(`usageStep${i}`); if (el && t.usageSteps[i-1]) el.textContent = t.usageSteps[i-1]; }
            updateButtonTexts();
            const ft = document.getElementById('fullscreenText'); if (ft) ft.textContent = isFullscreen ? t.fullscreenExit : t.fullscreenEnter;
            if (currentData.length > 0) renderTable();
            if (cy) updateDegreeDistribution();
            if (document.getElementById('metricsSummary').style.display !== 'none') updateMetricsSummary();
        }

        function updateSelectOptions(selectId, optionsObj) {
            const select = document.getElementById(selectId); if (!select) return;
            const cur = select.value;
            Array.from(select.options).forEach(o => { if (optionsObj[o.value]) o.textContent = optionsObj[o.value]; });
            select.value = cur;
        }

        function updateTableHeaders() {
            const t = translations[currentLanguage];
            const headers = document.querySelectorAll('.data-table th');
            const keys = ['id','name','specialty','lifespan','nationality','master','school','studyAbroad','firm','joinYear','independentYear','ownFirm','note','action'];
            headers.forEach((h, i) => { if (keys[i] && t.tableHeaders[keys[i]]) h.textContent = t.tableHeaders[keys[i]]; });
        }

        function updateMetricLabels() {
            const t = translations[currentLanguage];
            const ids = { nodes:'metricNodes', edges:'metricEdges', degree:'metricAvgDegree', clustering:'metricClustering', path:'metricAvgPath', efficiency:'metricEfficiency', density:'metricDensity', components:'metricComponents' };
            Object.keys(ids).forEach(k => { const el = document.getElementById(ids[k])?.parentElement; if (el) { const s = el.querySelector('.metric-label span:first-child'); if (s) s.textContent = t.metricLabels[k]; } });
            if (isCommunitySpecified()) {
                const lbl = getCommunityLabel(getGroupingField());
                const ml = document.getElementById('modularityLabel');
                if (ml) ml.textContent = currentLanguage === 'ja' ? `モジュラリティ (グループ:${lbl})` : `Modularity (${translations.en.communities[getGroupingField()]})`;
            }
        }

        function updateButtonTexts() {
            const t = translations[currentLanguage];
            const ab = document.getElementById('btnAddData'); if (ab) ab.textContent = t.buttons.add;
            const ub = document.getElementById('btnUpdateNetwork'); if (ub) ub.textContent = t.buttons.update;
            const db = document.getElementById('btnDownloadCSV'); if (db) db.textContent = t.buttons.download;
            const dm = document.getElementById('btnDownloadMaskedCSV'); if (dm) dm.textContent = t.buttons.downloadMasked;
            const at = document.getElementById('addDataModalTitle'); if (at) at.textContent = t.addDataTitle;
            const ep = document.getElementById('exportPanelTitle'); if (ep) ep.textContent = t.exportTitle;
        }

        function getColorFromColormap(t) {
            t = Math.max(0, Math.min(1, t));
            const colors = [
                {pos:0.0, r:158,g:1,b:66}, {pos:0.2, r:213,g:62,b:79},
                {pos:0.4, r:244,g:109,b:67}, {pos:0.5, r:253,g:174,b:97},
                {pos:0.6, r:254,g:224,b:139}, {pos:0.7, r:230,g:245,b:152},
                {pos:0.8, r:171,g:221,b:164}, {pos:0.9, r:102,g:194,b:165},
                {pos:1.0, r:94,g:79,b:162}
            ];
            for (let i = 0; i < colors.length-1; i++) {
                if (t >= colors[i].pos && t <= colors[i+1].pos) {
                    const c1=colors[i], c2=colors[i+1], lt=(t-c1.pos)/(c2.pos-c1.pos);
                    return `rgb(${Math.round(c1.r+(c2.r-c1.r)*lt)},${Math.round(c1.g+(c2.g-c1.g)*lt)},${Math.round(c1.b+(c2.b-c1.b)*lt)})`;
                }
            }
            return 'rgb(94,79,162)';
        }

        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.classList.add('dragover'); });
        uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
        uploadArea.addEventListener('drop', e => {
            e.preventDefault(); uploadArea.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file && file.name.endsWith('.csv')) loadFile(file);
            else showError('CSVファイルをアップロードしてください');
        });
        fileInput.addEventListener('change', e => { const file = e.target.files[0]; if (file) loadFile(file); });

        function loadFile(file) {
            const reader = new FileReader();
            reader.onload = e => {
                try {
                    currentData = parseCSV(e.target.result);
                    renderTable();
                    document.getElementById('tableContainer').style.display = 'block';
                    hideError();
                    updateVisualization();
                } catch (err) { showError('ファイルの読み込みに失敗しました: ' + err.message); }
            };
            reader.readAsText(file, 'UTF-8');
        }

        function parseCSV(text) {
            const lines = text.trim().split('\n'), data = [];
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim(); if (!line) continue;
                const v = line.split(',').map(x => x.trim());
                if (v.length >= 7) data.push({ id:v[0], name:v[1], specialty:v[2]||'0', lifespan:v[3]||'', nationality:v[4]||'', master:v[5]||'', school:v[6]||'', studyAbroad:v[7]||'', firm:v[8]||'', joinYear:v[9]||'', independentYear:v[10]||'', ownFirm:v[11]||'', note:v[12]||'' });
            }
            return data;
        }

        function renderTable() {
            const tbody = document.getElementById('dataTableBody'); tbody.innerHTML = '';
            const t = translations[currentLanguage];
            const sNames = currentLanguage === 'ja' ? specialtyNamesJa : specialtyNamesEn;
            currentData.forEach((p, i) => {
                const row = tbody.insertRow(); row.setAttribute('data-index', i);
                const sel = `<select onchange="updateData(${i},'specialty',this.value)">${sNames.map((n,j)=>`<option value="${j}" ${p.specialty===String(j)?'selected':''}>${n}</option>`).join('')}</select>`;
                row.innerHTML = `
                    <td><input type="text" value="${p.id}" readonly style="width:48px;background:var(--surface);color:var(--secondary);cursor:default;text-align:center;"></td>
                    <td><input type="text" value="${p.name}" onchange="updateData(${i},'name',this.value)"></td>
                    <td>${sel}</td>
                    <td><input type="text" value="${p.lifespan}" onchange="updateData(${i},'lifespan',this.value)"></td>
                    <td><input type="text" value="${p.nationality||''}" onchange="updateData(${i},'nationality',this.value)"></td>
                    <td><input type="text" value="${p.master}" placeholder="複数の場合は | で区切る" onchange="updateData(${i},'master',this.value)"></td>
                    <td><input type="text" value="${p.school}" onchange="updateData(${i},'school',this.value)"></td>
                    <td><input type="text" value="${p.studyAbroad}" onchange="updateData(${i},'studyAbroad',this.value)"></td>
                    <td><input type="text" value="${p.firm}" placeholder="複数の場合は | で区切る" onchange="updateData(${i},'firm',this.value)"></td>
                    <td><input type="text" value="${p.joinYear}" placeholder="複数の場合は | で区切る" onchange="updateData(${i},'joinYear',this.value)"></td>
                    <td><input type="text" value="${p.independentYear}" onchange="updateData(${i},'independentYear',this.value)"></td>
                    <td><input type="text" value="${p.ownFirm}" onchange="updateData(${i},'ownFirm',this.value)"></td>
                    <td><input type="text" value="${p.note}" readonly placeholder="クリックして編集..." style="cursor:pointer;" onclick="openNoteEditor(${i}, this)"></td>
                    <td><button class="btn-small btn-delete" onclick="deleteRow(${i})">${t.buttons.delete}</button></td>`;
            });
            const sb = document.getElementById('searchBox'); if (sb && sb.value) filterTable();
        }

        function filterTable() {
            const filter = document.getElementById('searchBox').value.toLowerCase().trim();
            const rows = document.getElementById('dataTableBody').getElementsByTagName('tr');
            const sNames = currentLanguage === 'ja' ? specialtyNamesJa : specialtyNamesEn;
            for (let i = 0; i < rows.length; i++) {
                const p = currentData[parseInt(rows[i].getAttribute('data-index'))];
                if (!filter) { rows[i].style.display = ''; continue; }
                const text = [p.id,p.name,p.master,p.school,p.studyAbroad,p.firm,sNames[parseInt(p.specialty)]||'',p.lifespan,p.joinYear,p.independentYear,p.ownFirm,p.note].join(' ').toLowerCase();
                rows[i].style.display = text.includes(filter) ? '' : 'none';
            }
        }

        function updateData(i, f, v) { currentData[i][f] = v; }

        function deleteRow(i) {
            if (confirm('この行を削除しますか？')) { currentData.splice(i, 1); renderTable(); if (cy) updateVisualization(); }
        }

        function openAddModal() {
            const nextId = currentData.length > 0 ? Math.max(...currentData.map(d => parseInt(d.id)||0))+1 : 0;
            document.getElementById('addDataForm').reset();
            document.getElementById('newId').value = nextId;
            document.getElementById('nextIdSuggestion').textContent = nextId;
            document.getElementById('addDataModal').style.display = 'block';
        }

        function closeAddModal() { document.getElementById('addDataModal').style.display = 'none'; }

        let _noteEditorIndex = null;
        let _noteEditorInput = null;
        function openNoteEditor(index, inputEl) {
            _noteEditorIndex = index;
            _noteEditorInput = inputEl;
            document.getElementById('noteEditorTextarea').value = inputEl.value;
            document.getElementById('noteEditorModal').style.display = 'block';
            setTimeout(() => document.getElementById('noteEditorTextarea').focus(), 100);
        }
        function closeNoteEditor() {
            document.getElementById('noteEditorModal').style.display = 'none';
            _noteEditorIndex = null;
            _noteEditorInput = null;
        }
        function saveNoteEdit() {
            const val = document.getElementById('noteEditorTextarea').value;
            if (_noteEditorInput) _noteEditorInput.value = val;
            if (_noteEditorIndex !== null) updateData(_noteEditorIndex, 'note', val);
            closeNoteEditor();
        }

        window.onclick = e => {
            if (e.target == document.getElementById('addDataModal')) closeAddModal();
            if (e.target == document.getElementById('helpModal')) closeHelpModal();
            if (e.target == document.getElementById('noteEditorModal')) closeNoteEditor();
        };

        function initColumnResize() {
            const ths = document.querySelectorAll('.data-table th');
            ths.forEach((th, i) => {
                if (i === ths.length - 1) return; // 操作列はスキップ
                const handle = document.createElement('div');
                handle.className = 'col-resize-handle';
                th.appendChild(handle);
                handle.addEventListener('mousedown', e => {
                    const startX = e.pageX;
                    const startWidth = th.getBoundingClientRect().width;
                    handle.classList.add('resizing');
                    const onMove = e => {
                        const w = startWidth + (e.pageX - startX);
                        if (w > 40) th.style.width = w + 'px';
                    };
                    const onUp = () => {
                        handle.classList.remove('resizing');
                        document.removeEventListener('mousemove', onMove);
                        document.removeEventListener('mouseup', onUp);
                    };
                    document.addEventListener('mousemove', onMove);
                    document.addEventListener('mouseup', onUp);
                    e.preventDefault();
                });
            });
        }

        document.addEventListener('DOMContentLoaded', () => {
            initColumnResize();
            const form = document.getElementById('addDataForm');
            if (form) form.addEventListener('submit', e => {
                e.preventDefault();
                const nd = { id:document.getElementById('newId').value.trim(), name:document.getElementById('newName').value.trim(), nationality:document.getElementById('newNationality').value.trim(), master:document.getElementById('newMaster').value.trim(), school:document.getElementById('newSchool').value.trim(), studyAbroad:document.getElementById('newStudyAbroad').value.trim(), firm:document.getElementById('newFirm').value.trim(), specialty:document.getElementById('newSpecialty').value, lifespan:document.getElementById('newLifespan').value.trim(), joinYear:document.getElementById('newJoinYear').value.trim(), independentYear:document.getElementById('newIndependentYear').value.trim(), ownFirm:document.getElementById('newOwnFirm').value.trim(), note:document.getElementById('newNote').value.trim() };
                if (currentData.some(d => d.id === nd.id)) { alert('この識別番号は既に使用されています。'); return; }
                currentData.push(nd); renderTable(); closeAddModal();
                if (cy && document.getElementById('networkDisplayContainer').style.display === 'flex') updateVisualization();
            });
        });

        function updateVisualization() {
            try {
                const { nodes, edges } = createNetworkData(currentData);
                visualizeNetwork(nodes, edges); updateLegend(); calculateNetworkMetrics();
                document.getElementById('networkDisplayContainer').style.display = 'flex';
                document.getElementById('networkControls').style.display = 'flex';
                document.getElementById('networkFilter').style.display = 'flex';

                document.getElementById('timelineSection').style.display = 'block';
                document.getElementById('networkMetrics').style.display = 'block';
                hideError();
            } catch (err) { showError('ネットワークの表示に失敗しました: ' + err.message); }
        }

        const helpContent = {
            ja: {
                nodes: { title: '全ノード数', body: '<p>ネットワーク内の総ノード数です。</p><div style="margin:15px 0;padding:10px;background:#f9f9f9;border:1px solid #eee;">\\[ N = |V| \\]</div><p>このネットワークでは、建築家・デザイナーの総人数を表します。</p>' },
                edges: { title: '全エッジ数', body: '<p>ネットワーク内の総エッジ数（師弟・指導関係の数）です。</p><div style="margin:15px 0;padding:10px;background:#f9f9f9;border:1px solid #eee;">\\[ M = |E| \\]</div>' },
                degree: { title: '平均次数', body: '<p>各ノードが持つエッジ数の平均です。</p><div style="margin:15px 0;padding:10px;background:#f9f9f9;border:1px solid #eee;">\\[ \\langle k \\rangle = \\frac{2M}{N} \\]</div><ul><li>値が高いほど、各人が多くの師弟・指導関係を持っています</li></ul>' },
                clustering: { title: 'クラスター係数', body: '<p>ネットワークのクラスタリング傾向を示す指標（0〜1）です。</p><div style="margin:15px 0;padding:10px;background:#f9f9f9;border:1px solid #eee;">\\[ C = \\frac{1}{N}\\sum_{i=1}^{N} C_i \\]</div>' },
                path: { title: '平均パス長', body: '<p>全ノードペア間の最短パスの平均長です。</p><div style="margin:15px 0;padding:10px;background:#f9f9f9;border:1px solid #eee;">\\[ L = \\frac{1}{N(N-1)}\\sum_{i \\neq j} d_{ij} \\]</div>' },
                efficiency: { title: '大域効率', body: '<p>全ノードペア間の距離の逆数の平均です。</p><div style="margin:15px 0;padding:10px;background:#f9f9f9;border:1px solid #eee;">\\[ E = \\frac{1}{N(N-1)}\\sum_{i \\neq j} \\frac{1}{d_{ij}} \\]</div>' },
                density: { title: 'ネットワーク密度', body: '<p>実際のエッジ数と可能な最大エッジ数の比率です。</p><div style="margin:15px 0;padding:10px;background:#f9f9f9;border:1px solid #eee;">\\[ D = \\frac{2M}{N(N-1)} \\]</div>' },
                components: { title: '連結成分数', body: '<p>ネットワーク内の独立した部分グラフの数です。</p><div style="margin:15px 0;padding:10px;background:#f9f9f9;border:1px solid #eee;">\\[ \\text{Components} = |\\{C_1, C_2, \\ldots, C_k\\}| \\]</div>' },
                modularity: { title: 'モジュラリティ', body: '<p>コミュニティ構造の品質を評価する指標（-1〜1）です。</p><div style="margin:15px 0;padding:10px;background:#f9f9f9;border:1px solid #eee;">\\[ Q = \\frac{1}{2m}\\sum_{ij}\\left[A_{ij} - \\frac{k_i k_j}{2m}\\right]\\delta(c_i, c_j) \\]</div><ul><li>0.3以上で明確なコミュニティ構造があると判定されます</li></ul>' }
            },
            en: {
                nodes: { title: 'Number of Nodes', body: '<p>Total number of nodes (architects/designers) in the network.</p><div style="margin:15px 0;padding:10px;background:#f9f9f9;border:1px solid #eee;">\\[ N = |V| \\]</div>' },
                edges: { title: 'Number of Edges', body: '<p>Total number of edges (mentor-apprentice relationships).</p><div style="margin:15px 0;padding:10px;background:#f9f9f9;border:1px solid #eee;">\\[ M = |E| \\]</div>' },
                degree: { title: 'Average Degree', body: '<p>Average number of connections per node.</p><div style="margin:15px 0;padding:10px;background:#f9f9f9;border:1px solid #eee;">\\[ \\langle k \\rangle = \\frac{2M}{N} \\]</div>' },
                clustering: { title: 'Clustering Coefficient', body: '<p>Measure of clustering tendency (0-1).</p><div style="margin:15px 0;padding:10px;background:#f9f9f9;border:1px solid #eee;">\\[ C = \\frac{1}{N}\\sum_{i=1}^{N} C_i \\]</div>' },
                path: { title: 'Average Path Length', body: '<p>Average shortest path between all node pairs.</p><div style="margin:15px 0;padding:10px;background:#f9f9f9;border:1px solid #eee;">\\[ L = \\frac{1}{N(N-1)}\\sum_{i \\neq j} d_{ij} \\]</div>' },
                efficiency: { title: 'Global Efficiency', body: '<p>Average inverse distance between all node pairs.</p><div style="margin:15px 0;padding:10px;background:#f9f9f9;border:1px solid #eee;">\\[ E = \\frac{1}{N(N-1)}\\sum_{i \\neq j} \\frac{1}{d_{ij}} \\]</div>' },
                density: { title: 'Network Density', body: '<p>Ratio of actual to maximum possible edges.</p><div style="margin:15px 0;padding:10px;background:#f9f9f9;border:1px solid #eee;">\\[ D = \\frac{2M}{N(N-1)} \\]</div>' },
                components: { title: 'Connected Components', body: '<p>Number of independent subgraphs.</p><div style="margin:15px 0;padding:10px;background:#f9f9f9;border:1px solid #eee;">\\[ \\text{Components} = |\\{C_1, \\ldots, C_k\\}| \\]</div>' },
                modularity: { title: 'Modularity', body: '<p>Measure of community structure quality (-1 to 1).</p><div style="margin:15px 0;padding:10px;background:#f9f9f9;border:1px solid #eee;">\\[ Q = \\frac{1}{2m}\\sum_{ij}\\left[A_{ij} - \\frac{k_i k_j}{2m}\\right]\\delta(c_i, c_j) \\]</div><ul><li>Values ≥ 0.3 indicate clear community structure</li></ul>' }
            }
        };

        function showHelpModal(type) {
            const c = helpContent[currentLanguage][type]; if (!c) return;
            document.getElementById('helpModalTitle').textContent = c.title;
            document.getElementById('helpModalBody').innerHTML = c.body;
            document.getElementById('helpModal').style.display = 'block';
            if (typeof renderMathInElement !== 'undefined') renderMathInElement(document.getElementById('helpModalBody'), { delimiters: [{left:'\\[',right:'\\]',display:true},{left:'\\(',right:'\\)',display:false}], throwOnError: false });
        }

        function closeHelpModal() { document.getElementById('helpModal').style.display = 'none'; }

        function copyMetricsToClipboard() {
            navigator.clipboard.writeText(document.getElementById('metricsTextBox').textContent).then(() => {
                const btn = document.getElementById('copyMetricsBtn'), orig = btn.innerHTML;
                btn.innerHTML = '✓ コピー済み'; btn.classList.add('copied');
                setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('copied'); }, 2000);
            }).catch(() => alert('コピーに失敗しました'));
        }

        function generateMetricsSummary() {
            const vals = ['metricNodes','metricEdges','metricAvgDegree','metricClustering','metricAvgPath','metricEfficiency','metricDensity','metricComponents'].map(id => document.getElementById(id).textContent);
            let text = currentLanguage === 'ja'
                ? `ネットワーク特徴量サマリー\n${'—'.repeat(40)}\n\n全ノード数 (N): ${vals[0]}\n全エッジ数 (M): ${vals[1]}\n平均次数 (⟨k⟩): ${vals[2]}\nクラスター係数 (C): ${vals[3]}\n平均パス長 (L): ${vals[4]}\n大域効率 (E): ${vals[5]}\nネットワーク密度 (D): ${vals[6]}\n連結成分数: ${vals[7]}`
                : `Network Metrics Summary\n${'—'.repeat(40)}\n\nNodes (N): ${vals[0]}\nEdges (M): ${vals[1]}\nAvg. Degree (⟨k⟩): ${vals[2]}\nClustering (C): ${vals[3]}\nAvg. Path Length (L): ${vals[4]}\nGlobal Efficiency (E): ${vals[5]}\nDensity (D): ${vals[6]}\nComponents: ${vals[7]}`;
            if (isCommunitySpecified()) {
                const q = document.getElementById('metricModularity').textContent;
                const lbl = currentLanguage === 'ja' ? getCommunityLabel(getGroupingField()) : translations.en.communities[getGroupingField()];
                text += currentLanguage === 'ja' ? `\nモジュラリティ (Q): ${q} [グループ: ${lbl}]` : `\nModularity (Q): ${q} [Community: ${lbl}]`;
            }
            return text;
        }

        function updateMetricsSummary() {
            document.getElementById('metricsTextBox').textContent = generateMetricsSummary();
            document.getElementById('metricsSummary').style.display = 'block';
        }

        function calculateNetworkMetrics() {
            if (!cy) return;
            const nodes = cy.nodes().filter(n => !n.data('isParent'));
            const edges = cy.edges().filter(e => !e.data('groupEdge'));
            const n = nodes.length;
            document.getElementById('metricNodes').textContent = n;
            document.getElementById('metricEdges').textContent = edges.length;

            let totalDeg = 0;
            nodes.forEach(node => { totalDeg += node.connectedEdges().filter(e => !e.data('groupEdge')).length; });
            document.getElementById('metricAvgDegree').textContent = n > 0 ? (totalDeg/n).toFixed(2) : 0;

            let totalC = 0, validN = 0;
            nodes.forEach(node => {
                const nbrs = node.connectedEdges().filter(e => !e.data('groupEdge')).connectedNodes().filter(nb => nb.id() !== node.id());
                const k = nbrs.length; if (k < 2) return;
                let eb = 0;
                for (let i = 0; i < nbrs.length; i++) for (let j = i+1; j < nbrs.length; j++) if (nbrs[i].edgesWith(nbrs[j]).filter(e => !e.data('groupEdge')).length > 0) eb++;
                totalC += eb / (k*(k-1)/2); validN++;
            });
            document.getElementById('metricClustering').textContent = validN > 0 ? (totalC/validN).toFixed(3) : 0;

            let totalP = 0, totalE = 0, pCount = 0;
            for (let i = 0; i < nodes.length; i++) {
                const dijk = cy.elements().dijkstra(nodes[i], e => e.data('groupEdge') ? Infinity : 1);
                for (let j = i+1; j < nodes.length; j++) {
                    const d = dijk.distanceTo(nodes[j]);
                    if (d < Infinity) { totalP += d; totalE += 1/d; pCount++; }
                }
            }
            document.getElementById('metricAvgPath').textContent = pCount > 0 ? (totalP/pCount).toFixed(2) : '∞';
            const maxPairs = n*(n-1)/2;
            document.getElementById('metricEfficiency').textContent = maxPairs > 0 ? (totalE/maxPairs).toFixed(3) : 0;
            document.getElementById('metricDensity').textContent = maxPairs > 0 ? (edges.length/maxPairs).toFixed(3) : 0;
            document.getElementById('metricComponents').textContent = cy.elements().components().length;

            const mi = document.getElementById('modularityItem');
            if (isCommunitySpecified()) {
                document.getElementById('metricModularity').textContent = calculateModularity().toFixed(3);
                document.getElementById('modularityLabel').textContent = `モジュラリティ (グループ:${getCommunityLabel(getGroupingField())})`;
                mi.style.display = 'block';
            } else { mi.style.display = 'none'; }

            updateDegreeDistribution();
            updateMetricsSummary();
        }

        function updateDegreeDistribution() {
            if (!cy) return;
            const nodes = cy.nodes().filter(n => !n.data('isParent'));
            const degCount = {};
            nodes.forEach(node => { const d = node.connectedEdges().filter(e => !e.data('groupEdge')).length; degCount[d] = (degCount[d]||0)+1; });
            const sorted = Object.keys(degCount).map(Number).sort((a,b) => a-b);
            const dL = currentLanguage === 'ja' ? '次数' : 'Degree';
            const nL = currentLanguage === 'ja' ? 'ノード数' : 'Nodes';
            if (degreeDistChart) degreeDistChart.destroy();
            const ctx = document.getElementById('degreeDistributionChart').getContext('2d');
            degreeDistChart = new Chart(ctx, {
                type: 'bar',
                data: { labels: sorted.map(d=>`${d}`), datasets: [{ label: nL, data: sorted.map(d=>degCount[d]), backgroundColor: 'rgba(36,35,33,0.7)', borderColor: 'rgba(36,35,33,1)', borderWidth: 1 }] },
                options: { responsive: true, maintainAspectRatio: true, aspectRatio: 1, plugins: { legend: { display: false }, tooltip: { callbacks: { title: c => dL+': '+c[0].label, label: c => nL+': '+c.parsed.y } } }, scales: { x: { type: isLogScale?'logarithmic':'linear', title: { display: true, text: dL, font:{size:11} } }, y: { type: isLogScale?'logarithmic':'linear', title: { display: true, text: nL, font:{size:11} }, beginAtZero: !isLogScale, ticks: { precision: 0 } } } }
            });
        }

        function toggleLogScale() {
            isLogScale = !isLogScale;
            const t = translations[currentLanguage];
            document.getElementById('scaleToggleBtn').textContent = isLogScale ? t.scaleToggleLog : t.scaleToggleLinear;
            if (cy) updateDegreeDistribution();
        }

        function updateLegend() {
            const lc = document.getElementById('colorLegend'); lc.innerHTML = '';
            const titleMap = { specialty: currentLanguage==='ja'?'専門':'Specialty', firm: currentLanguage==='ja'?'所属事務所':'Firm', school: currentLanguage==='ja'?'出身校':'School', ownFirm: currentLanguage==='ja'?'設立事務所':'Founded Firm', studyAbroad: currentLanguage==='ja'?'留学歴':'Study Abroad' };
            document.getElementById('legendTitle').textContent = titleMap[colorMode] || colorMode;
            Object.entries(colorMap).forEach(([key, color]) => {
                const item = document.createElement('div'); item.className = 'legend-item';
                const circle = document.createElement('div'); circle.className = 'legend-circle'; circle.style.background = color;
                const label = document.createElement('span'); label.textContent = key;
                item.appendChild(circle); item.appendChild(label); lc.appendChild(item);
            });
        }

        function isCommunitySpecified() { return currentCommunity !== 'none'; }
        function getGroupingField() { return isCommunitySpecified() ? currentCommunity : null; }
        function getCommunityLabel(f) { return { firm:'所属事務所', school:'出身校', ownFirm:'設立事務所', specialty:'専門', nationality:'国籍' }[f] || f; }

        function getLayoutConfig(layoutName) {
            if (isCommunitySpecified()) return { name:'cose', animate:true, animationDuration:1000, nodeRepulsion:6000, idealEdgeLength: e => e.data('groupEdge')?15:80, edgeElasticity: e => e.data('groupEdge')?500:200, gravity:0.8, numIter:2500, padding:50 };
            const configs = {
                cose: { name:'cose', animate:true, animationDuration:1000, fit:true, nodeRepulsion:8000, idealEdgeLength:100, edgeElasticity:100, gravity:1, numIter:1000, padding:50 },
                breadthfirst: { name:'breadthfirst', directed:true, animate:true, animationDuration:500, fit:true, spacingFactor:1.5, padding:50 },
                circle: { name:'circle', animate:true, animationDuration:500, fit:true, padding:50 },
                grid: { name:'grid', animate:true, animationDuration:500, fit:true, padding:50 },
                concentric: { name:'concentric', animate:true, animationDuration:500, fit:true, padding:50, concentric: node => node.connectedEdges().filter(e=>!e.data('groupEdge')).length, levelWidth: ()=>2 },
                random: { name:'random', animate:true, animationDuration:500, fit:true, padding:50 }
            };
            return configs[layoutName] || configs.cose;
        }

        function changeCommunity() {
            currentCommunity = document.getElementById('communitySelect').value;
            const ls = document.getElementById('layoutSelect');
            ls.disabled = isCommunitySpecified(); ls.style.opacity = isCommunitySpecified()?'0.4':'1'; ls.style.cursor = isCommunitySpecified()?'not-allowed':'pointer';
            if (cy && currentData.length > 0) updateVisualization();
        }

        function changeLayout() {
            currentLayout = document.getElementById('layoutSelect').value;
            if (cy && currentData.length > 0 && !isCommunitySpecified()) cy.layout(getLayoutConfig(currentLayout)).run();
        }

        function changeColorMode() {
            colorMode = document.getElementById('colorModeSelect').value;
            const cs = document.getElementById('communitySelect');
            const map = { specialty:'none', firm:'firm', school:'school', ownFirm:'ownFirm', studyAbroad:'none' };
            cs.value = map[colorMode] || 'none'; currentCommunity = cs.value;
            const ls = document.getElementById('layoutSelect');
            ls.disabled = isCommunitySpecified(); ls.style.opacity = isCommunitySpecified()?'0.4':'1'; ls.style.cursor = isCommunitySpecified()?'not-allowed':'pointer';
            if (cy && currentData.length > 0) updateVisualization();
        }

        function calculateModularity() {
            if (!cy || !isCommunitySpecified()) return 0;
            const gf = getGroupingField();
            const nodes = cy.nodes().filter(n => !n.data('isParent'));
            const edges = cy.edges().filter(e => !e.data('groupEdge'));
            const m = edges.length; if (m === 0) return 0;
            const nComm = {}, nDeg = {};
            nodes.forEach(n => {
                const d = currentData.find(p => p.id === n.id());
                if (d) nComm[n.id()] = d[gf] || '未設定';
                nDeg[n.id()] = n.connectedEdges().filter(e => !e.data('groupEdge')).length;
            });
            let q = 0;
            nodes.forEach((ni, i) => nodes.forEach((nj, j) => {
                if (i >= j) return;
                const delta = nComm[ni.id()] === nComm[nj.id()] ? 1 : 0;
                const Aij = ni.edgesWith(nj).filter(e => !e.data('groupEdge')).length > 0 ? 1 : 0;
                q += (Aij - (nDeg[ni.id()]*nDeg[nj.id()])/(2*m)) * delta;
            }));
            return (2*q)/(2*m);
        }

        function createNetworkData(data) {
            const nodes = [], edges = [];
            const gf = getGroupingField();
            const groups = {};
            if (gf) data.forEach(p => { const k = getFirstValue(p[gf])||'未設定'; if (!groups[k]) groups[k]=[]; groups[k].push(p.id); });

            colorMap = {};
            const gcm = {};
            if (gf) Object.keys(groups).forEach((k,i) => { gcm[k] = getColorFromColormap(i/Math.max(Object.keys(groups).length-1,1)); });

            const sNames = currentLanguage === 'ja' ? specialtyNamesJa : specialtyNamesEn;

            if (colorMode === 'specialty') {
                sNames.forEach((n,i) => { colorMap[n] = getColorFromColormap(i/(sNames.length-1)); });
            } else {
                const fm = { firm:'firm', school:'school', ownFirm:'ownFirm', studyAbroad:'studyAbroad' };
                const field = fm[colorMode];
                if (field) { const uniq = [...new Set(data.map(p => getFirstValue(p[field])||'未設定'))]; uniq.forEach((v,i) => { colorMap[v] = getColorFromColormap(i/Math.max(uniq.length-1,1)); }); }
            }

            if (gf) Object.keys(groups).forEach(k => nodes.push({ data: { id:'parent-'+k, label:k, isParent:true, backgroundColor:gcm[k] } }));

            data.forEach(p => {
                let nc;
                if (colorMode === 'specialty') nc = colorMap[sNames[parseInt(p.specialty)]||sNames[0]];
                else { const fm={firm:'firm',school:'school',ownFirm:'ownFirm',studyAbroad:'studyAbroad'}; const f=fm[colorMode]; if(f) nc=colorMap[getFirstValue(p[f])||'未設定']; }

                const nd = { id:p.id, label:showName?p.name:p.id, name:p.name, master:p.master, specialty:p.specialty, school:p.school, studyAbroad:p.studyAbroad, firm:p.firm, lifespan:p.lifespan, joinYear:p.joinYear, independentYear:p.independentYear, ownFirm:p.ownFirm, note:p.note, nationality:p.nationality||'', color:nc };
                if (gf) nd.parent = 'parent-'+(getFirstValue(p[gf])||'未設定');
                nodes.push({ data: nd });

                if (p.master && p.master !== '' && p.master !== '-') {
                    const masterNames = p.master.split('|').map(m => m.trim()).filter(m => m);
                    masterNames.forEach((masterName, idx) => {
                        const mn = data.find(x => x.name === masterName);
                        if (mn) edges.push({ data: { id:`e${mn.id}-${p.id}-${idx}`, source:mn.id, target:p.id, label:'師弟' } });
                    });
                }
            });

            if (gf) Object.values(groups).forEach(g => { for(let i=0;i<g.length;i++) for(let j=i+1;j<g.length;j++) edges.push({data:{id:`group-e${g[i]}-${g[j]}`,source:g[i],target:g[j],groupEdge:true}}); });

            return { nodes, edges };
        }

        function visualizeNetwork(nodes, edges) {
            if (cy) cy.destroy();
            cy = cytoscape({
                container: document.getElementById('cy'),
                elements: { nodes, edges },
                compound: true,
                style: [
                    { selector: 'node', style: {
                        'background-color': ele => ele.data('color')||'#CFCFCF',
                        'label': 'data(label)',
                        'color': '#242321',
                        'text-valign': 'center', 'text-halign': 'center',
                        'font-family': 'Inter, sans-serif',
                        'font-size': '12px', 'font-weight': '600',
                        'width': ele => Math.max(36, 28+ele.connectedEdges().filter(e=>!e.data('groupEdge')).length*10)+'px',
                        'height': ele => Math.max(36, 28+ele.connectedEdges().filter(e=>!e.data('groupEdge')).length*10)+'px',
                        'border-width': 0,
                        'text-outline-width': 2, 'text-outline-color': '#FCFBF8'
                    }},
                    { selector: '$node > node', style: {
                        'padding': '28px',
                        'background-color': ele => ele.data('backgroundColor')||'#F5F4F0',
                        'background-opacity': 0.15,
                        'border-width': 2, 'border-color': ele => ele.data('backgroundColor')||'#CFCFCF',
                        'border-style': 'solid',
                        'label': 'data(label)',
                        'text-valign': 'top', 'text-halign': 'center',
                        'font-family': 'Chivo, sans-serif', 'font-size': '14px', 'font-weight': '700',
                        'color': '#71706E', 'text-margin-y': -12
                    }},
                    { selector: 'edge', style: {
                        'width': 1.5, 'line-color': '#CFCFCF',
                        'target-arrow-color': '#71706E', 'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier', 'arrow-scale': 1.2
                    }},
                    { selector: 'edge[groupEdge]', style: { 'width': 0, 'opacity': 0, 'target-arrow-shape': 'none' } },
                    { selector: 'node:selected', style: { 'border-width': 3, 'border-color': '#242321' } }
                ],
                layout: getLayoutConfig(currentLayout)
            });

            cy.on('tap', 'node', evt => {
                const d = evt.target.data(); if (d.isParent) return;
                const sNames = currentLanguage === 'ja' ? specialtyNamesJa : specialtyNamesEn;
                const sText = sNames[parseInt(d.specialty)] || (currentLanguage==='ja'?'不明':'Unknown');
                const isJa = currentLanguage === 'ja';
                const none = isJa ? 'なし' : 'None';

                // ポップアップに情報をセット
                document.getElementById('popupName').textContent = d.name;
                document.getElementById('popupInfo').innerHTML =
                    `ID: ${d.id}<br>` +
                    `${isJa?'専門':'Specialty'}: ${sText}<br>` +
                    `${isJa?'出身校':'School'}: ${d.school||none}<br>` +
                    `${isJa?'所属事務所':'Firm'}: ${formatMultiValue(d.firm)||none}<br>` +
                    `${isJa?'師匠':'Mentor'}: ${formatMultiValue(d.master)||none}`;
                document.getElementById('popupCenterBtn').textContent =
                    isJa ? 'この人を中心に表示' : 'Center this person';
                document.getElementById('popupCenterBtn').onclick = () => centerOnNode(d.id, d.name);

                // ポップアップをノード位置に表示
                const rp = evt.target.renderedPosition();
                const popup = document.getElementById('nodeInfoPopup');
                popup.style.display = 'block';
                const cont = document.getElementById('networkDisplayContainer');
                const maxLeft = cont.clientWidth - popup.offsetWidth - 10;
                const maxTop = cont.clientHeight - popup.offsetHeight - 10;
                popup.style.left = Math.min(rp.x + 12, maxLeft) + 'px';
                popup.style.top  = Math.min(rp.y + 12, maxTop) + 'px';
            });

            cy.on('tap', evt => { if (evt.target === cy) closeNodePopup(); });
        }

        // ── EXPORT ────────────────────────────────────────────────────────────
        function exportNetwork() {
            if (!cy) return;
            const format = document.getElementById('exportFormat').value;
            const now = new Date();
            const ts = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
            const filename = 'design-network_' + ts;

            if (format === 'svg') {
                const svgContent = cy.svg({ scale: 1, full: true, bg: '#FFFFFF' });
                const blob = new Blob([svgContent], { type: 'image/svg+xml' });
                _downloadBlob(blob, filename + '.svg');
            } else if (format === 'png') {
                cy.png({ output: 'blob-promise', bg: '#FFFFFF', scale: 2, full: true }).then(blob => {
                    _downloadBlob(blob, filename + '.png');
                });
            } else if (format === 'jpg') {
                cy.jpg({ output: 'blob-promise', bg: '#FFFFFF', scale: 2, full: true, quality: 0.92 }).then(blob => {
                    _downloadBlob(blob, filename + '.jpg');
                });
            }
        }

        function _downloadBlob(blob, filename) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = filename;
            document.body.appendChild(a); a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        // ── /EXPORT ───────────────────────────────────────────────────────────

        // ── TIMELINE ──────────────────────────────────────────────────────────
        function parsePeriodStr(str) {
            if (!str) return null;
            const m = str.match(/(\d{4})[–\-](\d{4})?/);
            if (!m) return null;
            return { start: parseInt(m[1]), end: m[2] ? parseInt(m[2]) : new Date().getFullYear() };
        }
        function parseMultiPeriodStr(str) {
            if (!str) return [];
            return str.split('|').map(s => parsePeriodStr(s.trim())).filter(Boolean);
        }

        function buildTimeline() {
            if (!currentData || currentData.length === 0) return;
            const field = document.getElementById('timelineField').value;
            const keyword = document.getElementById('timelineKeyword').value.trim().toLowerCase();
            const periodType = document.getElementById('timelinePeriodType').value;
            const sNames = currentLanguage === 'ja' ? specialtyNamesJa : specialtyNamesEn;

            const filtered = keyword
                ? currentData.filter(p => {
                    const val = field === 'specialty'
                        ? (sNames[parseInt(p.specialty)] || '').toLowerCase()
                        : (p[field] || '').toLowerCase();
                    return val.includes(keyword);
                })
                : currentData;

            document.getElementById('timelineStatus').textContent = filtered.length ? `${filtered.length} 件` : '該当なし';
            if (!filtered.length) { document.getElementById('timelineSvgContainer').innerHTML = ''; return; }
            renderTimeline(filtered, periodType);
        }

        function renderTimeline(people, periodType) {
            // 行データ構築
            const currentYear = new Date().getFullYear();
            const rows = people.map(p => {
                const bars = [];
                if (periodType === 'lifespan' || periodType === 'both') {
                    const ls = parsePeriodStr(p.lifespan);
                    if (ls) bars.push({ ...ls, type: 'lifespan' });
                }
                if (periodType === 'joinYear' || periodType === 'both') {
                    parseMultiPeriodStr(p.joinYear).forEach(b => bars.push({ ...b, type: 'joinYear' }));
                }
                return { person: p, bars };
            }).filter(r => r.bars.length > 0);

            if (!rows.length) {
                document.getElementById('timelineSvgContainer').innerHTML =
                    '<p style="padding:20px;color:var(--secondary);font-size:13px;">表示できる期間データがありません</p>';
                return;
            }

            // lifespan優先でソート（最も早いbarのstart年）
            rows.sort((a, b) => Math.min(...a.bars.map(x => x.start)) - Math.min(...b.bars.map(x => x.start)));

            // 年範囲
            const allYears = rows.flatMap(r => r.bars.flatMap(b => [b.start, b.end]));
            const minYear = Math.floor((Math.min(...allYears) - 3) / 10) * 10;
            const maxYear = Math.ceil((Math.max(...allYears) + 3) / 10) * 10;

            // レイアウト計算
            const nameWidth = 130, padLeft = 8, padRight = 24, padTop = 36, rowH = 30, barH = 12;
            const wrapperW = document.getElementById('timelineWrapper').clientWidth || 900;
            const chartW = Math.max(wrapperW - nameWidth - padLeft - padRight, 500);
            const totalW = nameWidth + padLeft + chartW + padRight;
            const totalH = padTop + rows.length * rowH + 24;
            const yr2x = y => nameWidth + padLeft + (y - minYear) / (maxYear - minYear) * chartW;

            let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}" style="font-family:'Inter',sans-serif;display:block;">`;
            s += `<rect width="${totalW}" height="${totalH}" fill="#FCFBF8"/>`;

            // グリッド（10年）
            for (let y = minYear; y <= maxYear; y += 10) {
                const x = yr2x(y);
                s += `<line x1="${x}" y1="${padTop - 8}" x2="${x}" y2="${totalH - 10}" stroke="#CFCFCF" stroke-width="1"/>`;
                s += `<text x="${x}" y="${padTop - 12}" text-anchor="middle" font-size="10" fill="#71706E">${y}</text>`;
            }
            // グリッド（5年・破線）
            for (let y = minYear + 5; y < maxYear; y += 10) {
                const x = yr2x(y);
                s += `<line x1="${x}" y1="${padTop - 4}" x2="${x}" y2="${totalH - 10}" stroke="#CFCFCF" stroke-width="0.5" stroke-dasharray="2,4"/>`;
            }

            // 行
            rows.forEach((row, i) => {
                const rowY = padTop + i * rowH;
                const midY = rowY + rowH / 2;
                if (i % 2 === 0)
                    s += `<rect x="${nameWidth + padLeft}" y="${rowY}" width="${chartW}" height="${rowH}" fill="#F5F4F0" opacity="0.6"/>`;

                // 名前
                const displayName = row.person.name.length > 10 ? row.person.name.slice(0, 10) + '…' : row.person.name;
                s += `<text x="${nameWidth}" y="${midY + 4}" text-anchor="end" font-size="12" fill="#242321">${displayName}</text>`;

                // lifespan を先に（下レイヤー）
                row.bars.filter(b => b.type === 'lifespan').forEach(b => {
                    const bx = yr2x(b.start), bw = Math.max(yr2x(b.end) - yr2x(b.start), 2);
                    const endLabel = (b.end === currentYear) ? '現在' : String(b.end);
                    s += `<rect x="${bx}" y="${midY - barH / 2 - 1}" width="${bw}" height="${barH + 2}" fill="#CFCFCF" rx="2" opacity="0.7">`;
                    s += `<title>${row.person.name}（生没年）: ${b.start}–${endLabel}</title></rect>`;
                });
                // joinYear を前面に
                row.bars.filter(b => b.type === 'joinYear').forEach(b => {
                    const bx = yr2x(b.start), bw = Math.max(yr2x(b.end) - yr2x(b.start), 3);
                    const endLabel = (b.end === currentYear) ? '現在' : String(b.end);
                    s += `<rect x="${bx}" y="${midY - barH / 2}" width="${bw}" height="${barH}" fill="#242321" rx="2">`;
                    s += `<title>${row.person.name}（在籍年）: ${b.start}–${endLabel}</title></rect>`;
                    if (bw > 44) s += `<text x="${bx + 4}" y="${midY + 4}" font-size="9" fill="#FCFBF8">${b.start}–${endLabel}</text>`;
                });
            });

            s += '</svg>';
            document.getElementById('timelineSvgContainer').innerHTML = s;

            // 凡例表示
            const legend = document.getElementById('timelineLegend');
            legend.style.display = periodType === 'both' ? 'flex' : 'none';
        }
        // ── /TIMELINE ─────────────────────────────────────────────────────────

        // ── NETWORK FILTER ────────────────────────────────────────────────────
        function applyNetworkFilter() {
            if (!cy) return;
            const sNames = currentLanguage === 'ja' ? specialtyNamesJa : specialtyNamesEn;

            // フィールドごとのキーワードリストを収集（空欄はスキップ）
            const conditions = [];
            document.querySelectorAll('.filter-field-input').forEach(input => {
                const field = input.dataset.field;
                const keywords = input.value.split(',').map(k => k.trim().toLowerCase()).filter(k => k);
                if (keywords.length > 0) conditions.push({ field, keywords });
            });

            if (conditions.length === 0) { clearNetworkFilter(); return; }

            let shown = 0, total = 0;
            cy.nodes().forEach(n => {
                if (n.data('isParent')) return;
                total++;
                const d = n.data();
                // いずれかの条件にマッチすればOK（条件間OR・条件内OR）
                const match = conditions.some(({ field, keywords }) => {
                    const val = field === 'specialty'
                        ? (sNames[parseInt(d.specialty)] || '').toLowerCase()
                        : (d[field] || '').toLowerCase();
                    return keywords.some(k => val.includes(k));
                });
                if (match) { n.style('display', 'element'); shown++; }
                else n.style('display', 'none');
            });
            cy.edges().forEach(e => {
                const s = e.source().style('display') !== 'none';
                const t = e.target().style('display') !== 'none';
                e.style('display', s && t ? 'element' : 'none');
            });

            document.getElementById('filterStatus').textContent = `${shown} / ${total} 件表示中`;
            cy.layout(getLayoutConfig(currentLayout)).run();
        }

        function toggleFilterPanel() {
            const body = document.getElementById('filterBody');
            const arrow = document.getElementById('filterArrow');
            const isOpen = body.classList.toggle('open');
            arrow.style.transform = isOpen ? 'rotate(90deg)' : '';
        }

        function clearNetworkFilter() {
            document.querySelectorAll('.filter-field-input').forEach(input => input.value = '');
            document.getElementById('filterStatus').textContent = '';
            if (!cy) return;
            cy.nodes().style('display', 'element');
            cy.edges().style('display', 'element');
            cy.layout(getLayoutConfig(currentLayout)).run();
        }
        // ── /NETWORK FILTER ───────────────────────────────────────────────────

        // ── RADIAL TREE LAYOUT ────────────────────────────────────────────────
        function computeRadialTreePositions(rootId, distances) {
            const R = 140; // レベルごとの半径

            // BFSツリーを構築（distances済みのノードのみ）
            const children = {};
            cy.nodes().filter(n => n.style('display') !== 'none')
                .forEach(n => { children[n.id()] = []; });
            cy.edges().filter(e => e.style('display') !== 'none').forEach(e => {
                const s = e.source().id(), t = e.target().id();
                const ds = distances[s], dt = distances[t];
                if (ds === undefined || dt === undefined) return;
                if (dt === ds + 1) children[s].push(t);
                else if (ds === dt + 1) children[t].push(s);
            });

            // サブツリーのサイズを計算
            const size = {};
            function calcSize(id) {
                size[id] = 1 + children[id].reduce((s, c) => s + calcSize(c), 0);
                return size[id];
            }
            calcSize(rootId);

            // 角度範囲を再帰的に割り当てて座標を計算
            const positions = {};
            function place(id, angleFrom, angleTo) {
                const angle = (angleFrom + angleTo) / 2;
                const r = distances[id] * R;
                positions[id] = { x: r * Math.cos(angle), y: r * Math.sin(angle) };
                if (children[id].length === 0) return;
                const parentSize = size[id] - 1;
                let a = angleFrom;
                children[id].forEach(c => {
                    const span = (angleTo - angleFrom) * size[c] / parentSize;
                    place(c, a, a + span);
                    a += span;
                });
            }

            positions[rootId] = { x: 0, y: 0 };
            if (children[rootId].length > 0) {
                const total = size[rootId] - 1;
                let a = 0;
                children[rootId].forEach(c => {
                    const span = 2 * Math.PI * size[c] / total;
                    place(c, a, a + span);
                    a += span;
                });
            }
            return positions;
        }
        // ── /RADIAL TREE LAYOUT ───────────────────────────────────────────────

        // ── RADIAL CENTER ─────────────────────────────────────────────────────
        function centerOnNode(nodeId, nodeName) {
            closeNodePopup();

            // BFSで各ノードへの距離を計算
            const distances = {};
            const queue = [nodeId];
            distances[nodeId] = 0;
            while (queue.length > 0) {
                const cur = queue.shift();
                cy.getElementById(cur).neighborhood('node').forEach(nb => {
                    const nid = nb.id();
                    if (distances[nid] === undefined) {
                        distances[nid] = distances[cur] + 1;
                        queue.push(nid);
                    }
                });
            }
            const maxDist = Math.max(...Object.values(distances));

            // 非連結ノード・エッジを非表示
            cy.nodes().forEach(n => {
                if (distances[n.id()] === undefined) n.style('display', 'none');
                else n.style('display', 'element');
            });
            cy.edges().forEach(e => {
                const src = e.source().id(), tgt = e.target().id();
                if (distances[src] === undefined || distances[tgt] === undefined)
                    e.style('display', 'none');
                else e.style('display', 'element');
            });

            // 放射状ツリーレイアウト（presetレイアウトでアニメーション＋fit一括管理）
            const positions = computeRadialTreePositions(nodeId, distances);

            cy.layout({
                name: 'preset',
                positions: node => positions[node.id()] || node.position(),
                animate: true,
                animationDuration: 900,
                fit: true,
                padding: 60
            }).run();

            document.getElementById('radialCenterName').textContent = nodeName || nodeId;
            document.getElementById('radialCenterBanner').style.display = 'flex';
        }

        function closeNodePopup() {
            document.getElementById('nodeInfoPopup').style.display = 'none';
        }

        function resetToNormalLayout() {
            document.getElementById('radialCenterBanner').style.display = 'none';
            cy.nodes().style('display', 'element');
            cy.edges().style('display', 'element');
            cy.layout(getLayoutConfig(currentLayout)).run();
        }
        // ── /RADIAL CENTER ────────────────────────────────────────────────────

        // ── MASK ──────────────────────────────────────────────────────────────
        let _originalData = null;
        let _isMasked = false;

        function _toUpper(n) {
            // 0-indexed → A, B, ... Z, AA, AB, ...
            let r = ''; n++;
            while (n > 0) { n--; r = String.fromCharCode(65 + n % 26) + r; n = Math.floor(n / 26); }
            return r;
        }
        function _toLower(n) {
            let r = ''; n++;
            while (n > 0) { n--; r = String.fromCharCode(97 + n % 26) + r; n = Math.floor(n / 26); }
            return r;
        }
        function _mapMulti(str, map) {
            if (!str) return '';
            return str.split('|').map(v => { const t = v.trim(); return map[t] ?? t; }).join('|');
        }

        function toggleMask() {
            if (_isMasked) {
                currentData = JSON.parse(JSON.stringify(_originalData));
                _originalData = null;
                _isMasked = false;
                document.getElementById('btnMask').textContent = '具体名を非表示';
            } else {
                _originalData = JSON.parse(JSON.stringify(currentData));

                // 氏名 → 番号
                const nameMap = {};
                currentData.forEach((p, i) => { nameMap[p.name] = String(i + 1); });

                // 出身校・留学歴 → 大文字アルファベット（同一マップ）
                const schoolVals = [...new Set(currentData.flatMap(p =>
                    [p.school, p.studyAbroad].flatMap(f => f ? f.split('|').map(v => v.trim()).filter(v => v) : [])
                ))];
                const schoolMap = {};
                schoolVals.forEach((v, i) => { schoolMap[v] = _toUpper(i); });

                // 所属事務所・設立事務所 → 小文字アルファベット（同一マップ）
                const firmVals = [...new Set(currentData.flatMap(p =>
                    [p.firm, p.ownFirm].flatMap(f => f ? f.split('|').map(v => v.trim()).filter(v => v) : [])
                ))];
                const firmMap = {};
                firmVals.forEach((v, i) => { firmMap[v] = _toLower(i); });

                currentData = currentData.map(p => ({
                    ...p,
                    name:             nameMap[p.name] ?? p.name,
                    master:           _mapMulti(p.master, nameMap),
                    school:           _mapMulti(p.school, schoolMap),
                    studyAbroad:      _mapMulti(p.studyAbroad, schoolMap),
                    firm:             _mapMulti(p.firm, firmMap),
                    ownFirm:          _mapMulti(p.ownFirm, firmMap),
                    note:             '',
                }));

                _isMasked = true;
                document.getElementById('btnMask').textContent = '具体名を再表示';
            }
            renderTable();
            if (cy && currentData.length > 0) updateVisualization();
        }
        // ── /MASK ─────────────────────────────────────────────────────────────

        function _buildMaskedData(source) {
            const nameMap = {};
            source.forEach((p, i) => { nameMap[p.name] = String(i + 1); });
            const schoolVals = [...new Set(source.flatMap(p =>
                [p.school, p.studyAbroad].flatMap(f => f ? f.split('|').map(v => v.trim()).filter(v => v) : [])
            ))];
            const schoolMap = {};
            schoolVals.forEach((v, i) => { schoolMap[v] = _toUpper(i); });
            const firmVals = [...new Set(source.flatMap(p =>
                [p.firm, p.ownFirm].flatMap(f => f ? f.split('|').map(v => v.trim()).filter(v => v) : [])
            ))];
            const firmMap = {};
            firmVals.forEach((v, i) => { firmMap[v] = _toLower(i); });
            return source.map(p => ({
                ...p,
                name:        nameMap[p.name] ?? p.name,
                master:      _mapMulti(p.master, nameMap),
                school:      _mapMulti(p.school, schoolMap),
                studyAbroad: _mapMulti(p.studyAbroad, schoolMap),
                firm:        _mapMulti(p.firm, firmMap),
                ownFirm:     _mapMulti(p.ownFirm, firmMap),
                note:        '',
            }));
        }

        function _csvTimestamp() {
            const now = new Date();
            return now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0')+'_'+String(now.getHours()).padStart(2,'0')+'-'+String(now.getMinutes()).padStart(2,'0');
        }

        function _buildCSVBlob(data) {
            const header = '識別番号,氏名,専門(建築:0/インテリア:1/プロダクト:2/グラフィック:3/写真:4),生没年,国籍,師匠(複数は|区切り),出身校,留学歴,所属事務所(複数は|区切り),在籍年(複数は|区切り),独立年,設立事務所,備考\n';
            const rows = data.map(p => `${p.id},${p.name},${p.specialty},${p.lifespan},${p.nationality||''},${p.master},${p.school},${p.studyAbroad},${p.firm},${p.joinYear},${p.independentYear},${p.ownFirm},${p.note}`).join('\n');
            return new Blob([header+rows], {type:'text/csv;charset=utf-8;'});
        }

        function downloadMaskedCSV() {
            const source = _isMasked ? _originalData : currentData;
            _downloadBlob(_buildCSVBlob(_buildMaskedData(source)), 'DN_masked_'+_csvTimestamp()+'.csv');
        }

        function downloadCSV() {
            _downloadBlob(_buildCSVBlob(currentData), 'DN_'+_csvTimestamp()+'.csv');
        }

        // | 区切りの複数値フィールドから最初の値を取得（色分け・グループ化に使用）
        function getFirstValue(str) {
            if (!str) return '';
            return str.split('|')[0].trim();
        }

        // | 区切りの複数値を整形して表示用テキストに変換
        function formatMultiValue(str) {
            if (!str) return 'なし';
            return str.split('|').map(v => v.trim()).filter(v => v).join(' / ') || 'なし';
        }

        function showError(msg) { const el = document.getElementById('errorMsg'); el.textContent = msg; el.style.display = 'block'; }
        function hideError() { document.getElementById('errorMsg').style.display = 'none'; }

        // ── PASSWORD GATE ─────────────────────────────────
        const GATE_PASSWORD = '#^BeTekW@R&42j@kizHF';

        (function() {
            if (sessionStorage.getItem('dn_auth') === '1') {
                document.getElementById('passwordGate').style.display = 'none';
            }
        })();

        function checkPassword() {
            const input = document.getElementById('gateInput').value;
            if (input === GATE_PASSWORD) {
                sessionStorage.setItem('dn_auth', '1');
                document.getElementById('passwordGate').style.display = 'none';
            } else {
                document.getElementById('gateError').style.display = 'block';
                document.getElementById('gateInput').value = '';
                document.getElementById('gateInput').focus();
            }
        }
        // ── /PASSWORD GATE ────────────────────────────────
