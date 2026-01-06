document.addEventListener('DOMContentLoaded', () => {
    // 1. Inisialisasi Elemen
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    const addBtn = document.getElementById('addBtn');
    const tableBody = document.getElementById('todoTableBody');
    const emptyRow = document.getElementById('emptyRow');
    const filterBtn = document.getElementById('filterBtn');
    const deleteAllBtn = document.getElementById('deleteAllBtn');

    // State untuk filter (All -> Pending -> Completed -> All)
    let currentFilter = 'all';

    // 2. Fungsi untuk Menghitung Tanggal (Auto-Complete)
    const isOverdue = (dateString) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset waktu ke jam 12 malam agar fokus ke tanggal
        const taskDate = new Date(dateString);
        return taskDate < today;
    };

    // 3. Fungsi Menambah Tugas
    const addTask = () => {
        const task = taskInput.value.trim();
        const date = dateInput.value;

        if (task === "" || date === "") {
            alert("Harap isi nama tugas dan tanggal!");
            return;
        }

        if (emptyRow) emptyRow.style.display = 'none';

        const tr = document.createElement('tr');
        tr.className = 'todo-row';
        
        // Tentukan status awal: jika tanggal sudah lewat, otomatis "Done"
        const overdue = isOverdue(date);
        const statusText = overdue ? "Done" : "Pending";
        const statusClass = overdue ? "done" : "pending";

        tr.innerHTML = `
            <td class="task-name ${overdue ? 'line-through' : ''}">${task}</td>
            <td>${date}</td>
            <td class="status-cell"><span class="badge ${statusClass}">${statusText}</span></td>
            <td class="action-btns">
                ${!overdue ? '<button class="btn-check" title="Selesaikan">✅</button>' : ''}
                <button class="btn-delete" title="Hapus">❌</button>
            </td>
        `;

        // 4. Fitur Ubah Pending jadi Completed (Manual)
        const checkBtn = tr.querySelector('.btn-check');
        if (checkBtn) {
            checkBtn.onclick = function() {
                const statusCell = tr.querySelector('.status-cell');
                const taskName = tr.querySelector('.task-name');
                
                statusCell.innerHTML = '<span class="badge done">Done</span>';
                taskName.classList.add('line-through');
                this.remove(); // Hapus tombol check setelah diklik
            };
        }

        // 5. Fitur Hapus Per Baris
        tr.querySelector('.btn-delete').onclick = function() {
            tr.remove();
            if (tableBody.querySelectorAll('.todo-row').length === 0) {
                emptyRow.style.display = 'table-row';
            }
        };

        tableBody.appendChild(tr);
        taskInput.value = "";
        dateInput.value = "";
    };

    // 6. Fitur Filter (All -> Pending -> Completed)
    filterBtn.onclick = () => {
        const rows = tableBody.querySelectorAll('.todo-row');
        
        if (currentFilter === 'all') {
            currentFilter = 'pending';
            filterBtn.innerText = "FILTER: PENDING";
        } else if (currentFilter === 'pending') {
            currentFilter = 'completed';
            filterBtn.innerText = "FILTER: COMPLETED";
        } else {
            currentFilter = 'all';
            filterBtn.innerText = "FILTER: ALL";
        }

        rows.forEach(row => {
            const status = row.querySelector('.badge').innerText.toLowerCase();
            if (currentFilter === 'all') {
                row.style.display = 'table-row';
            } else if (currentFilter === 'pending' && status === 'pending') {
                row.style.display = 'table-row';
            } else if (currentFilter === 'completed' && status === 'done') {
                row.style.display = 'table-row';
            } else {
                row.style.display = 'none';
            }
        });
    };

    // 7. Fitur Delete All
    deleteAllBtn.onclick = () => {
        if (confirm("Hapus semua tugas?")) {
            const rows = tableBody.querySelectorAll('.todo-row');
            rows.forEach(r => r.remove());
            emptyRow.style.display = 'table-row';
        }
    };

    addBtn.addEventListener('click', addTask);
});