// ============================================================
// Application State
// ============================================================
let currentWarehouseId = null;

// ============================================================
// Initialization
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
  initNavigation();
  initSubNavigation();
  await loadUnitInfo();
  await loadOverview();
  await loadStaff();
  await loadWarehouses();
  await loadWeapons();
  await loadTechEquipment();
  await loadVehicles();
  await loadMaterials();
  initEventListeners();
});

// ============================================================
// Navigation
// ============================================================
function initNavigation() {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById('tab-' + tab.dataset.tab);
      if (target) target.classList.add('active');
    });
  });
}

function initSubNavigation() {
  document.querySelectorAll('.sub-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const parent = tab.closest('.warehouse-detail-panel');
      parent.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
      parent.querySelectorAll('.subtab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById('subtab-' + tab.dataset.subtab);
      if (target) target.classList.add('active');
    });
  });
}

// ============================================================
// Unit Info
// ============================================================
async function loadUnitInfo() {
  const info = await window.api.getUnitInfo();
  if (info) {
    document.getElementById('unit-name').textContent = info.unit_name || 'TRUNG TÂM CÔNG NGHỆ XỬ LÝ BOM MÌN';
    document.getElementById('footer-officer').textContent = info.technical_officer || '...';
    document.getElementById('footer-statistician').textContent = info.statistician || '...';
  }
}

// ============================================================
// Overview
// ============================================================
async function loadOverview() {
  const data = await window.api.getOverview();
  if (data) {
    document.getElementById('overview-position').value = data.position || '';
    document.getElementById('overview-area').value = data.area || '';
    document.getElementById('overview-warehouse-system').value = data.warehouse_system || '';
    document.getElementById('overview-fence').value = data.fence_system || '';
    document.getElementById('overview-road').value = data.road_system || '';
    document.getElementById('overview-fire').value = data.fire_system || '';
    document.getElementById('overview-terrain').value = data.terrain_map || '';
    document.getElementById('overview-land').value = data.land_certificate || '';
  }
}

// ============================================================
// Event Listeners
// ============================================================
function initEventListeners() {
  // Save overview
  document.getElementById('save-overview').addEventListener('click', async () => {
    await window.api.saveOverview({
      position: document.getElementById('overview-position').value,
      area: document.getElementById('overview-area').value,
      warehouse_system: document.getElementById('overview-warehouse-system').value,
      fence_system: document.getElementById('overview-fence').value,
      road_system: document.getElementById('overview-road').value,
      fire_system: document.getElementById('overview-fire').value,
      terrain_map: document.getElementById('overview-terrain').value,
      land_certificate: document.getElementById('overview-land').value,
    });
    showNotification('Đã lưu thông tin tổng quan');
  });

  // Staff
  document.getElementById('add-staff-btn').addEventListener('click', () => addStaffRow());

  // Warehouses
  document.getElementById('add-warehouse-btn').addEventListener('click', () => addWarehouseRow());
  document.getElementById('save-warehouse-detail').addEventListener('click', saveWarehouseDetail);

  // Warehouse sub-tabs add buttons
  document.querySelectorAll('.add-wh-sub').forEach(btn => {
    btn.addEventListener('click', () => addWarehouseSubRow(btn.dataset.type));
  });

  // Weapons
  document.getElementById('add-weapon-btn').addEventListener('click', () => addWeaponRow());

  // Tech Equipment
  document.getElementById('add-tech-equipment-btn').addEventListener('click', () => addTechEquipmentRow());

  // Vehicles
  document.getElementById('add-vehicle-btn').addEventListener('click', () => addVehicleRow());

  // Materials
  document.getElementById('add-material-btn').addEventListener('click', () => addMaterialRow());
}

// ============================================================
// Staff CRUD
// ============================================================
async function loadStaff() {
  const staff = await window.api.getStaff();
  const tbody = document.getElementById('staff-tbody');
  tbody.innerHTML = '';
  staff.forEach((s, i) => {
    const tr = document.createElement('tr');
    tr.dataset.id = s.id;
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td><input value="${esc(s.full_name)}" data-field="full_name"></td>
      <td><input value="${esc(s.date_of_birth)}" data-field="date_of_birth"></td>
      <td><input value="${esc(s.id_number)}" data-field="id_number"></td>
      <td><input value="${esc(s.rank)}" data-field="rank"></td>
      <td><input value="${esc(s.position)}" data-field="position"></td>
      <td><input value="${esc(s.unit_department)}" data-field="unit_department"></td>
      <td><input value="${esc(s.education)}" data-field="education"></td>
      <td><input value="${esc(s.assigned_warehouse)}" data-field="assigned_warehouse"></td>
      <td><input value="${esc(s.assigned_weapons)}" data-field="assigned_weapons"></td>
      <td><input value="${esc(s.assigned_vehicles)}" data-field="assigned_vehicles"></td>
      <td><input value="${esc(s.assigned_equipment)}" data-field="assigned_equipment"></td>
      <td>
        <button class="btn btn-primary btn-sm save-row" onclick="saveStaffRow(this)">Lưu</button>
        <button class="btn btn-danger btn-sm" onclick="deleteStaffRow(${s.id})">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function addStaffRow() {
  await window.api.addStaff({ full_name: '' });
  await loadStaff();
}

async function saveStaffRow(btn) {
  const tr = btn.closest('tr');
  const id = parseInt(tr.dataset.id, 10);
  const data = {};
  tr.querySelectorAll('input[data-field]').forEach(input => {
    data[input.dataset.field] = input.value;
  });
  await window.api.updateStaff(id, data);
  showNotification('Đã lưu');
}

async function deleteStaffRow(id) {
  if (confirm('Bạn có chắc muốn xóa?')) {
    await window.api.deleteStaff(id);
    await loadStaff();
  }
}

// ============================================================
// Warehouses CRUD
// ============================================================
async function loadWarehouses() {
  const warehouses = await window.api.getWarehouses();
  const tbody = document.getElementById('warehouse-tbody');
  tbody.innerHTML = '';
  warehouses.forEach((w, i) => {
    const tr = document.createElement('tr');
    tr.dataset.id = w.id;
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td><input value="${esc(w.code)}" data-field="code"></td>
      <td><input value="${esc(w.function_desc)}" data-field="function_desc"></td>
      <td><input value="${esc(w.keeper)}" data-field="keeper"></td>
      <td><input value="${esc(w.managing_unit)}" data-field="managing_unit"></td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="saveWarehouseRow(this)">Lưu</button>
        <button class="btn btn-warning btn-sm" onclick="selectWarehouse(${w.id}, '${esc(w.code)}')">Chi tiết</button>
        <button class="btn btn-danger btn-sm" onclick="deleteWarehouseRow(${w.id})">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function addWarehouseRow() {
  await window.api.addWarehouse({ code: '' });
  await loadWarehouses();
}

async function saveWarehouseRow(btn) {
  const tr = btn.closest('tr');
  const id = parseInt(tr.dataset.id, 10);
  const data = {};
  tr.querySelectorAll('input[data-field]').forEach(input => {
    data[input.dataset.field] = input.value;
  });
  await window.api.updateWarehouse(id, data);
  showNotification('Đã lưu');
}

async function deleteWarehouseRow(id) {
  if (confirm('Bạn có chắc muốn xóa kho này?')) {
    await window.api.deleteWarehouse(id);
    if (currentWarehouseId === id) {
      currentWarehouseId = null;
      document.getElementById('warehouse-detail').style.display = 'none';
    }
    await loadWarehouses();
  }
}

async function selectWarehouse(id, code) {
  currentWarehouseId = id;
  document.getElementById('warehouse-detail').style.display = 'block';
  document.getElementById('warehouse-detail-title').textContent = `Chi tiết: ${code}`;

  // Load warehouse details
  const warehouses = await window.api.getWarehouses();
  const wh = warehouses.find(w => w.id === id);
  if (wh) {
    document.getElementById('wh-area').value = wh.area || '';
    document.getElementById('wh-construction').value = wh.construction_date || '';
  }

  // Load all sub-tables
  await loadWarehouseEquipment();
  await loadWarehouseInspections();
  await loadWarehouseAccess();
  await loadWarehouseHandover();
  await loadWarehouseExports();
  await loadWarehouseImports();
  await loadWarehouseLightning();
}

async function saveWarehouseDetail() {
  if (!currentWarehouseId) return;
  await window.api.updateWarehouse(currentWarehouseId, {
    area: document.getElementById('wh-area').value,
    construction_date: document.getElementById('wh-construction').value,
  });
  showNotification('Đã lưu chi tiết kho');
}

// ============================================================
// Warehouse Sub-Tables
// ============================================================
async function addWarehouseSubRow(type) {
  if (!currentWarehouseId) return;
  const base = { warehouse_id: currentWarehouseId };
  switch (type) {
    case 'equipment': await window.api.addWarehouseEquipment(base); await loadWarehouseEquipment(); break;
    case 'inspection': await window.api.addWarehouseInspection(base); await loadWarehouseInspections(); break;
    case 'access': await window.api.addWarehouseAccess(base); await loadWarehouseAccess(); break;
    case 'handover': await window.api.addWarehouseHandover(base); await loadWarehouseHandover(); break;
    case 'export': await window.api.addWarehouseExport(base); await loadWarehouseExports(); break;
    case 'import': await window.api.addWarehouseImport(base); await loadWarehouseImports(); break;
    case 'lightning': await window.api.addWarehouseLightning(base); await loadWarehouseLightning(); break;
  }
}

// Warehouse Equipment
async function loadWarehouseEquipment() {
  if (!currentWarehouseId) return;
  const items = await window.api.getWarehouseEquipment(currentWarehouseId);
  const tbody = document.getElementById('wh-equipment-tbody');
  tbody.innerHTML = '';
  items.forEach((item, i) => {
    const tr = document.createElement('tr');
    tr.dataset.id = item.id;
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td><input value="${esc(item.name)}" data-field="name"></td>
      <td><input value="${esc(item.model)}" data-field="model"></td>
      <td><input value="${esc(item.country)}" data-field="country"></td>
      <td><input value="${esc(item.certification)}" data-field="certification"></td>
      <td><input value="${esc(item.maintenance)}" data-field="maintenance"></td>
      <td><input value="${esc(item.import_export)}" data-field="import_export"></td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="saveWhSubRow('equipment', this)">Lưu</button>
        <button class="btn btn-danger btn-sm" onclick="deleteWhSubRow('equipment', ${item.id})">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Warehouse Inspections
async function loadWarehouseInspections() {
  if (!currentWarehouseId) return;
  const items = await window.api.getWarehouseInspections(currentWarehouseId);
  const tbody = document.getElementById('wh-inspection-tbody');
  tbody.innerHTML = '';
  items.forEach((item, i) => {
    const tr = document.createElement('tr');
    tr.dataset.id = item.id;
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td><input value="${esc(item.date)}" data-field="date"></td>
      <td><input value="${esc(item.inspector_name)}" data-field="inspector_name"></td>
      <td><input value="${esc(item.inspector_position)}" data-field="inspector_position"></td>
      <td><input value="${esc(item.content)}" data-field="content"></td>
      <td><input value="${esc(item.evaluation)}" data-field="evaluation"></td>
      <td><input value="${esc(item.requirements)}" data-field="requirements"></td>
      <td><input value="${esc(item.server_name)}" data-field="server_name"></td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="saveWhSubRow('inspection', this)">Lưu</button>
        <button class="btn btn-danger btn-sm" onclick="deleteWhSubRow('inspection', ${item.id})">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Warehouse Access
async function loadWarehouseAccess() {
  if (!currentWarehouseId) return;
  const items = await window.api.getWarehouseAccess(currentWarehouseId);
  const tbody = document.getElementById('wh-access-tbody');
  tbody.innerHTML = '';
  items.forEach((item, i) => {
    const tr = document.createElement('tr');
    tr.dataset.id = item.id;
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td><input value="${esc(item.date)}" data-field="date"></td>
      <td><input value="${esc(item.visitor_name)}" data-field="visitor_name"></td>
      <td><input value="${esc(item.companion_count)}" data-field="companion_count"></td>
      <td><input value="${esc(item.unit)}" data-field="unit"></td>
      <td><input value="${esc(item.responsible_person)}" data-field="responsible_person"></td>
      <td><input value="${esc(item.time_in)}" data-field="time_in"></td>
      <td><input value="${esc(item.time_out)}" data-field="time_out"></td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="saveWhSubRow('access', this)">Lưu</button>
        <button class="btn btn-danger btn-sm" onclick="deleteWhSubRow('access', ${item.id})">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Warehouse Handover
async function loadWarehouseHandover() {
  if (!currentWarehouseId) return;
  const items = await window.api.getWarehouseHandover(currentWarehouseId);
  const tbody = document.getElementById('wh-handover-tbody');
  tbody.innerHTML = '';
  items.forEach((item, i) => {
    const tr = document.createElement('tr');
    tr.dataset.id = item.id;
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td><input value="${esc(item.equipment_name)}" data-field="equipment_name"></td>
      <td><input value="${esc(item.unit)}" data-field="unit"></td>
      <td><input value="${esc(item.handover_date)}" data-field="handover_date"></td>
      <td><input value="${esc(item.quality_level)}" data-field="quality_level"></td>
      <td><input value="${esc(item.quantity)}" data-field="quantity"></td>
      <td><input value="${esc(item.giver)}" data-field="giver"></td>
      <td><input value="${esc(item.receiver)}" data-field="receiver"></td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="saveWhSubRow('handover', this)">Lưu</button>
        <button class="btn btn-danger btn-sm" onclick="deleteWhSubRow('handover', ${item.id})">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Warehouse Exports
async function loadWarehouseExports() {
  if (!currentWarehouseId) return;
  const items = await window.api.getWarehouseExports(currentWarehouseId);
  const tbody = document.getElementById('wh-export-tbody');
  tbody.innerHTML = '';
  items.forEach((item, i) => {
    const tr = document.createElement('tr');
    tr.dataset.id = item.id;
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td><input value="${esc(item.receiver_name)}" data-field="receiver_name"></td>
      <td><input value="${esc(item.receiver_unit)}" data-field="receiver_unit"></td>
      <td><input value="${esc(item.reason)}" data-field="reason"></td>
      <td><input value="${esc(item.item_name)}" data-field="item_name"></td>
      <td><input value="${esc(item.unit_measure)}" data-field="unit_measure"></td>
      <td><input value="${esc(item.required_quantity)}" data-field="required_quantity"></td>
      <td><input value="${esc(item.actual_quantity)}" data-field="actual_quantity"></td>
      <td><input value="${esc(item.unit_price)}" data-field="unit_price"></td>
      <td><input value="${esc(item.total_price)}" data-field="total_price"></td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="saveWhSubRow('export', this)">Lưu</button>
        <button class="btn btn-danger btn-sm" onclick="deleteWhSubRow('export', ${item.id})">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Warehouse Imports
async function loadWarehouseImports() {
  if (!currentWarehouseId) return;
  const items = await window.api.getWarehouseImports(currentWarehouseId);
  const tbody = document.getElementById('wh-import-tbody');
  tbody.innerHTML = '';
  items.forEach((item, i) => {
    const tr = document.createElement('tr');
    tr.dataset.id = item.id;
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td><input value="${esc(item.sender_name)}" data-field="sender_name"></td>
      <td><input value="${esc(item.sender_unit)}" data-field="sender_unit"></td>
      <td><input value="${esc(item.reason)}" data-field="reason"></td>
      <td><input value="${esc(item.item_name)}" data-field="item_name"></td>
      <td><input value="${esc(item.unit_measure)}" data-field="unit_measure"></td>
      <td><input value="${esc(item.required_quantity)}" data-field="required_quantity"></td>
      <td><input value="${esc(item.actual_quantity)}" data-field="actual_quantity"></td>
      <td><input value="${esc(item.unit_price)}" data-field="unit_price"></td>
      <td><input value="${esc(item.total_price)}" data-field="total_price"></td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="saveWhSubRow('import', this)">Lưu</button>
        <button class="btn btn-danger btn-sm" onclick="deleteWhSubRow('import', ${item.id})">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Warehouse Lightning Protection
async function loadWarehouseLightning() {
  if (!currentWarehouseId) return;
  const items = await window.api.getWarehouseLightning(currentWarehouseId);
  const tbody = document.getElementById('wh-lightning-tbody');
  tbody.innerHTML = '';
  items.forEach((item, i) => {
    const tr = document.createElement('tr');
    tr.dataset.id = item.id;
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td><input value="${esc(item.date)}" data-field="date"></td>
      <td><input value="${esc(item.weather)}" data-field="weather"></td>
      <td><input value="${esc(item.direct_rod1_rdo)}" data-field="direct_rod1_rdo"></td>
      <td><input value="${esc(item.direct_rod1_rxk)}" data-field="direct_rod1_rxk"></td>
      <td><input value="${esc(item.direct_rod1_result)}" data-field="direct_rod1_result"></td>
      <td><input value="${esc(item.direct_rod2_rdo)}" data-field="direct_rod2_rdo"></td>
      <td><input value="${esc(item.direct_rod2_rxk)}" data-field="direct_rod2_rxk"></td>
      <td><input value="${esc(item.direct_rod2_result)}" data-field="direct_rod2_result"></td>
      <td><input value="${esc(item.direct_rod3_rdo)}" data-field="direct_rod3_rdo"></td>
      <td><input value="${esc(item.direct_rod3_rxk)}" data-field="direct_rod3_rxk"></td>
      <td><input value="${esc(item.direct_rod3_result)}" data-field="direct_rod3_result"></td>
      <td><input value="${esc(item.induction_rdo)}" data-field="induction_rdo"></td>
      <td><input value="${esc(item.induction_result)}" data-field="induction_result"></td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="saveWhSubRow('lightning', this)">Lưu</button>
        <button class="btn btn-danger btn-sm" onclick="deleteWhSubRow('lightning', ${item.id})">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Generic save/delete for warehouse sub-rows
async function saveWhSubRow(type, btn) {
  const tr = btn.closest('tr');
  const id = parseInt(tr.dataset.id, 10);
  const data = {};
  tr.querySelectorAll('input[data-field]').forEach(input => {
    data[input.dataset.field] = input.value;
  });

  switch (type) {
    case 'equipment': await window.api.updateWarehouseEquipment(id, data); break;
    case 'inspection': await window.api.updateWarehouseInspection(id, data); break;
    case 'access': await window.api.updateWarehouseAccess(id, data); break;
    case 'handover': await window.api.updateWarehouseHandover(id, data); break;
    case 'export': await window.api.updateWarehouseExport(id, data); break;
    case 'import': await window.api.updateWarehouseImport(id, data); break;
    case 'lightning': await window.api.updateWarehouseLightning(id, data); break;
  }
  showNotification('Đã lưu');
}

async function deleteWhSubRow(type, id) {
  if (!confirm('Bạn có chắc muốn xóa?')) return;
  switch (type) {
    case 'equipment': await window.api.deleteWarehouseEquipment(id); await loadWarehouseEquipment(); break;
    case 'inspection': await window.api.deleteWarehouseInspection(id); await loadWarehouseInspections(); break;
    case 'access': await window.api.deleteWarehouseAccess(id); await loadWarehouseAccess(); break;
    case 'handover': await window.api.deleteWarehouseHandover(id); await loadWarehouseHandover(); break;
    case 'export': await window.api.deleteWarehouseExport(id); await loadWarehouseExports(); break;
    case 'import': await window.api.deleteWarehouseImport(id); await loadWarehouseImports(); break;
    case 'lightning': await window.api.deleteWarehouseLightning(id); await loadWarehouseLightning(); break;
  }
}

// ============================================================
// Weapons CRUD
// ============================================================
async function loadWeapons() {
  const items = await window.api.getWeapons();
  const tbody = document.getElementById('weapons-tbody');
  tbody.innerHTML = '';
  items.forEach((item, i) => {
    const tr = document.createElement('tr');
    tr.dataset.id = item.id;
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td><input value="${esc(item.name)}" data-field="name"></td>
      <td><input value="${esc(item.classification)}" data-field="classification"></td>
      <td><input value="${esc(item.unit_measure)}" data-field="unit_measure"></td>
      <td><input value="${esc(item.quantity)}" data-field="quantity"></td>
      <td><input value="${esc(item.country)}" data-field="country"></td>
      <td><input value="${esc(item.year)}" data-field="year"></td>
      <td><input value="${esc(item.assigned_unit)}" data-field="assigned_unit"></td>
      <td><input value="${esc(item.assigned_individual)}" data-field="assigned_individual"></td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="saveGenericRow('weapons', this)">Lưu</button>
        <button class="btn btn-danger btn-sm" onclick="deleteGenericRow('weapons', ${item.id})">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function addWeaponRow() {
  await window.api.addWeapon({ name: '' });
  await loadWeapons();
}

// ============================================================
// Tech Equipment CRUD
// ============================================================
async function loadTechEquipment() {
  const items = await window.api.getTechEquipment();
  const tbody = document.getElementById('tech-equipment-tbody');
  tbody.innerHTML = '';
  items.forEach((item, i) => {
    const tr = document.createElement('tr');
    tr.dataset.id = item.id;
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td><input value="${esc(item.name)}" data-field="name"></td>
      <td><input value="${esc(item.classification)}" data-field="classification"></td>
      <td><input value="${esc(item.unit_measure)}" data-field="unit_measure"></td>
      <td><input value="${esc(item.quantity)}" data-field="quantity"></td>
      <td><input value="${esc(item.country)}" data-field="country"></td>
      <td><input value="${esc(item.year)}" data-field="year"></td>
      <td><input value="${esc(item.assigned_unit)}" data-field="assigned_unit"></td>
      <td><input value="${esc(item.assigned_individual)}" data-field="assigned_individual"></td>
      <td><input value="${esc(item.repair)}" data-field="repair"></td>
      <td><input value="${esc(item.operating_hours)}" data-field="operating_hours"></td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="saveGenericRow('tech-equipment', this)">Lưu</button>
        <button class="btn btn-danger btn-sm" onclick="deleteGenericRow('tech-equipment', ${item.id})">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function addTechEquipmentRow() {
  await window.api.addTechEquipment({ name: '' });
  await loadTechEquipment();
}

// ============================================================
// Vehicles CRUD
// ============================================================
async function loadVehicles() {
  const items = await window.api.getVehicles();
  const tbody = document.getElementById('vehicles-tbody');
  tbody.innerHTML = '';
  items.forEach((item, i) => {
    const tr = document.createElement('tr');
    tr.dataset.id = item.id;
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td><input value="${esc(item.name)}" data-field="name"></td>
      <td><input value="${esc(item.classification)}" data-field="classification"></td>
      <td><input value="${esc(item.brand)}" data-field="brand"></td>
      <td><input value="${esc(item.vehicle_type)}" data-field="vehicle_type"></td>
      <td><input value="${esc(item.country)}" data-field="country"></td>
      <td><input value="${esc(item.year)}" data-field="year"></td>
      <td><input value="${esc(item.assigned_unit)}" data-field="assigned_unit"></td>
      <td><input value="${esc(item.assigned_individual)}" data-field="assigned_individual"></td>
      <td><input value="${esc(item.repair)}" data-field="repair"></td>
      <td><input value="${esc(item.operating_hours)}" data-field="operating_hours"></td>
      <td><input value="${esc(item.km)}" data-field="km"></td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="saveGenericRow('vehicles', this)">Lưu</button>
        <button class="btn btn-danger btn-sm" onclick="deleteGenericRow('vehicles', ${item.id})">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function addVehicleRow() {
  await window.api.addVehicle({ name: '' });
  await loadVehicles();
}

// ============================================================
// Materials CRUD
// ============================================================
async function loadMaterials() {
  const items = await window.api.getMaterials();
  const tbody = document.getElementById('materials-tbody');
  tbody.innerHTML = '';
  items.forEach((item, i) => {
    const tr = document.createElement('tr');
    tr.dataset.id = item.id;
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td><input value="${esc(item.name)}" data-field="name"></td>
      <td><input value="${esc(item.classification)}" data-field="classification"></td>
      <td><input value="${esc(item.unit_measure)}" data-field="unit_measure"></td>
      <td><input value="${esc(item.quantity)}" data-field="quantity"></td>
      <td><input value="${esc(item.country)}" data-field="country"></td>
      <td><input value="${esc(item.year)}" data-field="year"></td>
      <td><input value="${esc(item.assigned_unit)}" data-field="assigned_unit"></td>
      <td><input value="${esc(item.assigned_individual)}" data-field="assigned_individual"></td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="saveGenericRow('materials', this)">Lưu</button>
        <button class="btn btn-danger btn-sm" onclick="deleteGenericRow('materials', ${item.id})">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function addMaterialRow() {
  await window.api.addMaterial({ name: '' });
  await loadMaterials();
}

// ============================================================
// Generic Save/Delete for main tables
// ============================================================
async function saveGenericRow(type, btn) {
  const tr = btn.closest('tr');
  const id = parseInt(tr.dataset.id, 10);
  const data = {};
  tr.querySelectorAll('input[data-field]').forEach(input => {
    data[input.dataset.field] = input.value;
  });

  switch (type) {
    case 'weapons': await window.api.updateWeapon(id, data); break;
    case 'tech-equipment': await window.api.updateTechEquipment(id, data); break;
    case 'vehicles': await window.api.updateVehicle(id, data); break;
    case 'materials': await window.api.updateMaterial(id, data); break;
  }
  showNotification('Đã lưu');
}

async function deleteGenericRow(type, id) {
  if (!confirm('Bạn có chắc muốn xóa?')) return;
  switch (type) {
    case 'weapons': await window.api.deleteWeapon(id); await loadWeapons(); break;
    case 'tech-equipment': await window.api.deleteTechEquipment(id); await loadTechEquipment(); break;
    case 'vehicles': await window.api.deleteVehicle(id); await loadVehicles(); break;
    case 'materials': await window.api.deleteMaterial(id); await loadMaterials(); break;
  }
}

// ============================================================
// Utilities
// ============================================================
function esc(val) {
  if (val === null || val === undefined) return '';
  return String(val).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function showNotification(message) {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const div = document.createElement('div');
  div.className = 'notification';
  div.textContent = message;
  div.style.cssText = `
    position: fixed; bottom: 20px; right: 20px;
    background: #27ae60; color: white;
    padding: 10px 20px; border-radius: 6px;
    font-size: 13px; font-weight: 600;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 9999; transition: opacity 0.3s;
  `;
  document.body.appendChild(div);
  setTimeout(() => {
    div.style.opacity = '0';
    setTimeout(() => div.remove(), 300);
  }, 2000);
}
