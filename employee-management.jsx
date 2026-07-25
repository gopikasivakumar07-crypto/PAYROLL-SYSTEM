<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Payroll System</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root{
    --accent:#4F63D2;
    --accent-dim:#EEF0FC;
    --accent-deep:#3B4CB0;
    --bg:#F7F8FA;
    --card:#FFFFFF;
    --ink:#1B1D28;
    --muted:#8A8FA3;
    --line:#E7E9F0;
    --green:#2E9D6B;
    --green-soft:#E6F6EE;
    --red:#DA4A4A;
    --red-soft:#FCEAEA;
    --amber:#C9891E;
    --amber-soft:#FBF1DF;
  }
  *{box-sizing:border-box;}
  body{
    margin:0;
    font-family:'Plus Jakarta Sans', sans-serif;
    background:var(--bg);
    color:var(--ink);
    -webkit-font-smoothing:antialiased;
  }

  .app{ display:grid; grid-template-columns:232px 1fr; min-height:100vh; }
  @media (max-width:820px){
    .app{ grid-template-columns:1fr; }
    .sidebar{ position:sticky; top:0; z-index:10; flex-direction:row; align-items:center; padding:14px 18px; }
    .sidebar .brand{ margin-bottom:0; }
    .sidenav{ flex-direction:row; margin-left:auto; }
  }

  /* ===== SIDEBAR ===== */
  .sidebar{
    background:var(--card);
    border-right:1px solid var(--line);
    padding:22px 16px;
    display:flex;
    flex-direction:column;
  }
  .brand{
    display:flex;
    align-items:center;
    gap:10px;
    margin-bottom:28px;
    padding:0 6px;
  }
  .brand .mark{
    width:32px; height:32px;
    border-radius:9px;
    background:var(--accent);
    color:#fff;
    display:flex; align-items:center; justify-content:center;
    font-weight:700;
    font-size:15px;
  }
  .brand .name{ font-size:15px; font-weight:700; }

  .sidenav{ display:flex; flex-direction:column; gap:2px; }
  .sidenav button{
    display:flex;
    align-items:center;
    gap:11px;
    background:none;
    border:none;
    color:var(--muted);
    padding:10px 12px;
    border-radius:9px;
    font-size:13.5px;
    font-family:'Plus Jakarta Sans', sans-serif;
    font-weight:500;
    cursor:pointer;
    text-align:left;
    transition:background .15s ease, color .15s ease;
  }
  .sidenav button svg{ width:17px; height:17px; flex-shrink:0; opacity:0.85; }
  .sidenav button:hover{ background:var(--bg); color:var(--ink); }
  .sidenav button.active{ background:var(--accent-dim); color:var(--accent-deep); font-weight:600; }

  .side-stats{
    margin-top:auto;
    padding-top:16px;
    border-top:1px solid var(--line);
    display:flex;
    flex-direction:column;
    gap:9px;
  }
  .side-stats .stat{ display:flex; justify-content:space-between; font-size:11.5px; color:var(--muted); padding:0 6px; }
  .side-stats .stat b{ color:var(--ink); font-weight:700; }

  /* ===== MAIN ===== */
  .main{ padding:32px 40px 60px; max-width:1080px; }
  .page-head{ margin-bottom:24px; }
  .page-head h1{ font-size:24px; font-weight:700; margin:0 0 6px; }
  .page-head p{ color:var(--muted); font-size:13.5px; margin:0; max-width:560px; line-height:1.55; }

  .view{ display:none; }
  .view.active{ display:block; }

  .card{
    background:var(--card);
    border:1px solid var(--line);
    border-radius:14px;
    padding:22px 24px;
    margin-bottom:20px;
  }
  .card h3{ font-size:14.5px; font-weight:700; margin:0 0 16px; }

  .grid-form{ display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
  @media (max-width:700px){ .grid-form{ grid-template-columns:1fr 1fr; } }

  .field label{ display:block; font-size:12px; font-weight:600; color:var(--muted); margin-bottom:6px; }
  .field input, .field select{
    width:100%;
    padding:10px 11px;
    font-family:'Plus Jakarta Sans', sans-serif;
    font-size:13.5px;
    color:var(--ink);
    background:var(--bg);
    border:1px solid var(--line);
    border-radius:8px;
    outline:none;
  }
  .field input:focus, .field select:focus{
    border-color:var(--accent);
    background:#fff;
    box-shadow:0 0 0 3px var(--accent-dim);
  }

  .btn{ padding:10px 18px; border-radius:8px; border:none; font-size:13px; font-weight:600; cursor:pointer; transition:opacity .15s ease, transform .1s ease; }
  .btn:active{ transform:translateY(1px); }
  .btn-primary{ background:var(--accent); color:#fff; }
  .btn-primary:hover{ opacity:0.9; }
  .btn-row{ margin-top:16px; }

  .msg{ display:none; font-size:12.5px; padding:10px 12px; border-radius:8px; margin-bottom:14px; }
  .msg.error{ display:block; background:var(--red-soft); color:var(--red); }
  .msg.success{ display:block; background:var(--green-soft); color:var(--green); }

  /* ===== EMPLOYEE LIST ===== */
  .roster{ display:grid; grid-template-columns:repeat(auto-fill, minmax(250px,1fr)); gap:14px; }
  .emp-card{
    background:var(--bg);
    border:1px solid var(--line);
    border-radius:12px;
    padding:16px;
  }
  .emp-card .top{ display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; }
  .emp-card .avatar{
    width:38px; height:38px;
    border-radius:10px;
    background:var(--accent-dim);
    color:var(--accent-deep);
    display:flex; align-items:center; justify-content:center;
    font-weight:700;
    font-size:14px;
  }
  .emp-card .id{ font-size:10.5px; color:var(--muted); font-weight:600; }
  .emp-card .name{ font-size:14.5px; font-weight:700; margin-top:8px; }
  .emp-card .role{ font-size:12px; color:var(--muted); }
  .emp-card .dept-tag{
    display:inline-block;
    margin-top:8px;
    font-size:10.5px;
    font-weight:600;
    padding:3px 9px;
    border-radius:20px;
    background:var(--card);
    border:1px solid var(--line);
    color:var(--ink);
  }
  .emp-card .pay-row{ display:flex; justify-content:space-between; font-size:11.5px; color:var(--muted); margin-top:10px; padding-top:9px; border-top:1px solid var(--line); }
  .emp-card .pay-row b{ color:var(--ink); font-weight:700; }
  .emp-card .remove{
    margin-top:12px; width:100%;
    background:none; border:1px solid var(--red-soft); color:var(--red);
    padding:7px; border-radius:7px; font-size:11.5px; font-weight:600; cursor:pointer;
  }
  .emp-card .remove:hover{ background:var(--red-soft); }
  .empty{ color:var(--muted); font-size:13px; padding:20px 0; text-align:center; }

  /* ===== ATTENDANCE ===== */
  .log-table{ width:100%; border-collapse:collapse; }
  .log-table th{ text-align:left; font-size:10.5px; text-transform:uppercase; letter-spacing:0.04em; color:var(--muted); padding:8px 10px; border-bottom:1px solid var(--line); }
  .log-table td{ padding:10px 10px; font-size:13.5px; border-bottom:1px solid var(--line); }
  .status-pill{ display:inline-flex; align-items:center; padding:4px 11px; border-radius:20px; font-size:11.5px; font-weight:700; }
  .status-pill.Present{ background:var(--green-soft); color:var(--green); }
  .status-pill.Absent{ background:var(--red-soft); color:var(--red); }
  .status-pill.OnLeave{ background:var(--amber-soft); color:var(--amber); }

  /* ===== LEAVE ===== */
  .leave-row{ display:flex; justify-content:space-between; align-items:center; padding:14px 4px; border-bottom:1px solid var(--line); gap:12px; flex-wrap:wrap; }
  .leave-row:last-child{ border-bottom:none; }
  .leave-info .who{ font-size:13.5px; font-weight:700; }
  .leave-info .meta{ font-size:11.5px; color:var(--muted); margin-top:2px; }
  .leave-actions{ display:flex; gap:8px; align-items:center; }
  .status-tag{ font-size:11px; font-weight:700; padding:5px 12px; border-radius:20px; }
  .status-tag.Pending{ background:var(--amber-soft); color:var(--amber); }
  .status-tag.Approved{ background:var(--green-soft); color:var(--green); }
  .status-tag.Rejected{ background:var(--red-soft); color:var(--red); }
  .btn-tiny{ padding:6px 13px; font-size:11.5px; border-radius:7px; border:none; cursor:pointer; font-weight:700; }
  .btn-approve{ background:var(--green); color:#fff; }
  .btn-reject{ background:var(--red); color:#fff; }
</style>
</head>
<body>

<div class="app">
  <div class="sidebar">
    <div class="brand">
      <div class="mark">P</div>
      <div class="name">Payroll System</div>
    </div>
    <div class="sidenav">
      <button class="active" id="navEmployees" onclick="switchView('employees')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        Employees
      </button>
      <button id="navAttendance" onclick="switchView('attendance')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
        Attendance
      </button>
      <button id="navLeave" onclick="switchView('leave')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 15l2 2 4-4"/></svg>
        Leave Requests
      </button>
    </div>
    <div class="side-stats">
      <div class="stat"><span>Headcount</span><b id="statHeadcount">0</b></div>
      <div class="stat"><span>Attendance logged</span><b id="statAttendance">0</b></div>
      <div class="stat"><span>Leave pending</span><b id="statPending">0</b></div>
    </div>
  </div>

  <div class="main">

    <!-- EMPLOYEES -->
    <div class="view active" id="view-employees">
      <div class="page-head">
        <h1>Employee records</h1>
        <p>Add employees with department, designation, and salary structure, or remove a record for someone who's left.</p>
      </div>

      <div class="card">
        <h3>Add employee</h3>
        <div class="msg" id="empMsg"></div>
        <div class="grid-form">
          <div class="field"><label>Full name</label><input id="empName" placeholder="e.g. Arjun Mehta"></div>
          <div class="field"><label>Department</label>
            <select id="empDept">
              <option value="">Select…</option>
              <option>Engineering</option>
              <option>Sales</option>
              <option>Finance</option>
              <option>Operations</option>
              <option>Human Resources</option>
            </select>
          </div>
          <div class="field"><label>Designation</label><input id="empDesig" placeholder="e.g. Software Engineer"></div>
          <div class="field"><label>Basic salary (₹)</label><input id="empBasic" type="number" min="0" placeholder="e.g. 45000"></div>
          <div class="field"><label>HRA (₹)</label><input id="empHra" type="number" min="0" placeholder="e.g. 12000"></div>
          <div class="field"><label>Other allowances (₹)</label><input id="empAllow" type="number" min="0" placeholder="e.g. 5000"></div>
        </div>
        <div class="btn-row"><button class="btn btn-primary" onclick="addEmployee()">+ Add employee</button></div>
      </div>

      <div class="card">
        <h3>Roster</h3>
        <div class="roster" id="rosterGrid"></div>
        <div class="empty" id="rosterEmpty">No employees yet. Add your first employee above.</div>
      </div>
    </div>

    <!-- ATTENDANCE -->
    <div class="view" id="view-attendance">
      <div class="page-head">
        <h1>Daily attendance</h1>
        <p>Record the status — Present, Absent, or On Leave — for an employee on a given date.</p>
      </div>

      <div class="card">
        <h3>Record attendance</h3>
        <div class="msg" id="attMsg"></div>
        <div class="grid-form">
          <div class="field"><label>Employee</label><select id="attEmp"><option value="">Select employee…</option></select></div>
          <div class="field"><label>Date</label><input id="attDate" type="date"></div>
          <div class="field"><label>Status</label>
            <select id="attStatus">
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>
        <div class="btn-row"><button class="btn btn-primary" onclick="recordAttendance()">Record attendance</button></div>
      </div>

      <div class="card">
        <h3>Attendance log</h3>
        <table class="log-table">
          <thead><tr><th>Employee</th><th>Date</th><th>Status</th></tr></thead>
          <tbody id="attLogBody"></tbody>
        </table>
        <div class="empty" id="attEmpty">No attendance recorded yet.</div>
      </div>
    </div>

    <!-- LEAVE -->
    <div class="view" id="view-leave">
      <div class="page-head">
        <h1>Leave requests</h1>
        <p>Submit a leave request with type and date range, then review and decide on pending requests.</p>
      </div>

      <div class="card">
        <h3>Submit leave request</h3>
        <div class="msg" id="leaveMsg"></div>
        <div class="grid-form">
          <div class="field"><label>Employee</label><select id="leaveEmp"><option value="">Select employee…</option></select></div>
          <div class="field"><label>Leave type</label>
            <select id="leaveType">
              <option>Casual Leave</option>
              <option>Sick Leave</option>
              <option>Earned Leave</option>
            </select>
          </div>
          <div class="field"><label>From date</label><input id="leaveFrom" type="date"></div>
          <div class="field"><label>To date</label><input id="leaveTo" type="date"></div>
        </div>
        <div class="btn-row"><button class="btn btn-primary" onclick="submitLeave()">Submit request</button></div>
      </div>

      <div class="card">
        <h3>Review requests</h3>
        <div id="leaveList"></div>
        <div class="empty" id="leaveEmpty">No leave requests yet.</div>
      </div>
    </div>

  </div>
</div>

<script>
  let employees = [];
  let attendanceLog = [];
  let leaveRequests = [];
  let empSeq = 0;
  let leaveSeq = 0;

  function switchView(name){
    ['employees','attendance','leave'].forEach(v => {
      document.getElementById('view-' + v).classList.toggle('active', v === name);
      document.getElementById('nav' + v.charAt(0).toUpperCase() + v.slice(1)).classList.toggle('active', v === name);
    });
  }

  function showMsg(id, text, type){
    const el = document.getElementById(id);
    el.textContent = text;
    el.className = 'msg ' + type;
    setTimeout(() => { el.className = 'msg'; el.textContent=''; }, 3500);
  }

  function fmt(n){ return '₹' + Number(n).toLocaleString('en-IN'); }
  function initials(name){ return name.trim().split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase(); }

  function addEmployee(){
    const name = document.getElementById('empName').value.trim();
    const dept = document.getElementById('empDept').value;
    const desig = document.getElementById('empDesig').value.trim();
    const basic = document.getElementById('empBasic').value;
    const hra = document.getElementById('empHra').value || 0;
    const allow = document.getElementById('empAllow').value || 0;

    if(!name || !dept || !desig || basic === ''){
      showMsg('empMsg', 'Please fill in name, department, designation, and basic salary.', 'error');
      return;
    }
    if(basic < 0 || hra < 0 || allow < 0){
      showMsg('empMsg', 'Salary fields must be non-negative numbers.', 'error');
      return;
    }

    empSeq++;
    const id = 'EMP' + String(empSeq).padStart(3, '0');
    employees.push({ id, name, dept, desig, basic:Number(basic), hra:Number(hra), allow:Number(allow) });

    ['empName','empDesig','empBasic','empHra','empAllow'].forEach(f => document.getElementById(f).value = '');
    document.getElementById('empDept').value = '';

    showMsg('empMsg', id + ' — ' + name + ' added to the roster.', 'success');
    renderAll();
  }

  function removeEmployee(id){
    employees = employees.filter(e => e.id !== id);
    renderAll();
  }

  function renderRoster(){
    const grid = document.getElementById('rosterGrid');
    const empty = document.getElementById('rosterEmpty');
    grid.innerHTML = '';
    empty.style.display = employees.length ? 'none' : 'block';

    employees.forEach(e => {
      const div = document.createElement('div');
      div.className = 'emp-card';
      div.innerHTML = `
        <div class="top">
          <div class="avatar">${initials(e.name)}</div>
          <div class="id">${e.id}</div>
        </div>
        <div class="name">${e.name}</div>
        <div class="role">${e.desig}</div>
        <div class="dept-tag">${e.dept}</div>
        <div class="pay-row"><span>Basic</span><b>${fmt(e.basic)}</b></div>
        <div class="pay-row"><span>HRA</span><b>${fmt(e.hra)}</b></div>
        <div class="pay-row"><span>Allowances</span><b>${fmt(e.allow)}</b></div>
        <button class="remove" onclick="removeEmployee('${e.id}')">Remove</button>
      `;
      grid.appendChild(div);
    });
  }

  function populateEmployeeSelects(){
    const selects = [document.getElementById('attEmp'), document.getElementById('leaveEmp')];
    selects.forEach(sel => {
      const current = sel.value;
      sel.innerHTML = '<option value="">Select employee…</option>' +
        employees.map(e => `<option value="${e.name}">${e.id} — ${e.name}</option>`).join('');
      sel.value = current;
    });
  }

  function recordAttendance(){
    const empName = document.getElementById('attEmp').value;
    const date = document.getElementById('attDate').value;
    const status = document.getElementById('attStatus').value;

    if(!empName || !date){
      showMsg('attMsg', 'Please select an employee and a date.', 'error');
      return;
    }

    attendanceLog.unshift({ empName, date, status });
    showMsg('attMsg', 'Attendance recorded for ' + empName + '.', 'success');
    renderAttendance();
  }

  function renderAttendance(){
    const body = document.getElementById('attLogBody');
    const empty = document.getElementById('attEmpty');
    body.innerHTML = '';
    empty.style.display = attendanceLog.length ? 'none' : 'block';

    attendanceLog.forEach(a => {
      const tr = document.createElement('tr');
      const cls = a.status.replace(' ', '');
      tr.innerHTML = `<td>${a.empName}</td><td>${a.date}</td><td><span class="status-pill ${cls}">${a.status}</span></td>`;
      body.appendChild(tr);
    });
  }

  function submitLeave(){
    const empName = document.getElementById('leaveEmp').value;
    const type = document.getElementById('leaveType').value;
    const from = document.getElementById('leaveFrom').value;
    const to = document.getElementById('leaveTo').value;

    if(!empName || !from || !to){
      showMsg('leaveMsg', 'Please select an employee and both dates.', 'error');
      return;
    }

    leaveSeq++;
    leaveRequests.unshift({ id:leaveSeq, empName, type, from, to, status:'Pending' });
    showMsg('leaveMsg', 'Leave request submitted for ' + empName + '.', 'success');
    ['leaveFrom','leaveTo'].forEach(f => document.getElementById(f).value = '');
    renderLeave();
  }

  function decideLeave(id, decision){
    const req = leaveRequests.find(r => r.id === id);
    if(req && req.status === 'Pending') req.status = decision;
    renderLeave();
  }

  function renderLeave(){
    const list = document.getElementById('leaveList');
    const empty = document.getElementById('leaveEmpty');
    list.innerHTML = '';
    empty.style.display = leaveRequests.length ? 'none' : 'block';

    leaveRequests.forEach(r => {
      const row = document.createElement('div');
      row.className = 'leave-row';
      row.innerHTML = `
        <div class="leave-info">
          <div class="who">${r.empName} — ${r.type}</div>
          <div class="meta">${r.from} → ${r.to}</div>
        </div>
        <div class="leave-actions">
          ${r.status === 'Pending'
            ? `<button class="btn-tiny btn-approve" onclick="decideLeave(${r.id}, 'Approved')">Approve</button>
               <button class="btn-tiny btn-reject" onclick="decideLeave(${r.id}, 'Rejected')">Reject</button>`
            : `<span class="status-tag ${r.status}">${r.status}</span>`}
        </div>
      `;
      list.appendChild(row);
    });
  }

  function renderStats(){
    document.getElementById('statHeadcount').textContent = employees.length;
    document.getElementById('statAttendance').textContent = attendanceLog.length;
    document.getElementById('statPending').textContent = leaveRequests.filter(r => r.status === 'Pending').length;
  }

  function renderAll(){
    renderRoster();
    populateEmployeeSelects();
    renderAttendance();
    renderLeave();
    renderStats();
  }

  renderAll();
</script>

</body>
</html>
