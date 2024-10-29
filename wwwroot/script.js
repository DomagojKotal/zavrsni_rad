$(document).ready(function () {
    const pageId = $('body').attr('id');

    if (pageId === 'schedulePage') {
        loadSchedule();
    } else if (pageId === 'exclusionsPage') {
        loadExclusions();
        $('#exclusionForm').on('submit', saveExclusion);
    } else if (pageId === 'studentsPage') {
        loadStudents();
        $('#studentForm').on('submit', saveStudent);
    } else if (pageId === 'professorsPage') {
        loadProfessors();
        $('#professorForm').on('submit', saveProfessor);
    }
});

// Učitavanje rasporeda
function loadSchedule() {
    const selectedDate = $('#dateSelect').val() || new Date().toISOString().split('T')[0];
    const apiUrl = `/api/Raspored?date=${selectedDate}`;
    console.log('Requesting schedule from:', apiUrl);
    console.log(selectedDate);

    $.getJSON(apiUrl, function (schedules) {
        $('#selectedDate').text(selectedDate);
        const scheduleTableBody = $('#scheduleTableBody');
        scheduleTableBody.empty();
        $.each(schedules, function (index, entry) {
            const row = $('<tr></tr>');
            row.append(`<td>${entry.isJutarnjaSmjena ? 'Jutarnja' : 'Poslijepodnevna'}</td>`);
            row.append(`<td>${entry.ucenik.ime} ${entry.ucenik.prezime}</td>`);
            row.append(`<td>${entry.ucenik.razred.name} ${entry.ucenik.razred.oznaka}</td>`);
            row.append(`<td>${entry.profesor.ime} ${entry.profesor.prezime}</td>`);
            scheduleTableBody.append(row);
        });
    }).fail(function (jqxhr, textStatus, error) {
        console.error('Greška prilikom učitavanja rasporeda:', error);
        alert('Došlo je do pogreške prilikom učitavanja rasporeda.');
    });
}

// Učitavanje izuzetaka
function loadExclusions() {
    $.getJSON('/api/Izuzetak', function (exclusions) {
        const exclusionsTableBody = $('#exclusionsTableBody');
        exclusionsTableBody.empty();
        $.each(exclusions, function (index, exclusion) {
            const row = $('<tr></tr>');
            row.append(`<td>${exclusion.datum}</td>`);
            row.append(`<td><button onclick="deleteExclusion(${exclusion.id})">Obriši</button></td>`);
            exclusionsTableBody.append(row);
        });
    }).fail(function (jqxhr, textStatus, error) {
        console.error('Greška prilikom učitavanja izuzetaka:', error);
    });
}

function saveExclusion(event) {
    event.preventDefault();
    const exclusion = {
        datum: $('#exclusionDate').val()
    };

    $.post('/api/Izuzetak', exclusion)
        .done(function () {
            alert('Izuzetak je uspješno spremljen.');
            $('#exclusionForm')[0].reset();
            loadExclusions();
        })
        .fail(function (jqxhr) {
            alert('Greška prilikom spremanja izuzetka: ' + jqxhr.responseText);
        });
}

function deleteExclusion(id) {
    $.ajax({
        url: `/api/Izuzetak/${id}`,
        type: 'DELETE',
        success: function () {
            alert('Izuzetak je uspješno obrisan.');
            loadExclusions();
        },
        error: function (jqxhr) {
            alert('Greška prilikom brisanja izuzetka: ' + jqxhr.responseText);
        }
    });
}

// Učitavanje učenika
function loadStudents() {
    $.getJSON('/api/Ucenik', function (students) {
        const studentsTableBody = $('#studentsTableBody');
        studentsTableBody.empty();
        $.each(students, function (index, student) {
            const row = $('<tr></tr>');
            row.append(`<td>${student.ime} ${student.prezime}</td>`);
            row.append(`<td>${student.razred.name} ${student.razred.oznaka}</td>`);
            row.append(`<td><button onclick="editStudent(${student.id})">Uredi</button><button onclick="deleteStudent(${student.id})">Obriši</button></td>`);
            studentsTableBody.append(row);
        });
    }).fail(function (jqxhr, textStatus, error) {
        console.error('Greška prilikom učitavanja učenika:', error);
    });
}

function saveStudent(event) {
    event.preventDefault();
    const student = {
        ime: $('#studentFirstName').val(),
        prezime: $('#studentLastName').val(),
        razredId: $('#studentClass').val()
    };

    $.ajax({
        url: '/api/Ucenik',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(student),
        success: function () {
            alert('Učenik je uspješno spremljen.');
            $('#studentForm')[0].reset();
            loadStudents();
        },
        error: function (jqxhr) {
            alert('Greška prilikom spremanja učenika: ' + jqxhr.responseText);
        }
    });
}

function deleteStudent(id) {
    $.ajax({
        url: `/api/Ucenik/${id}`,
        type: 'DELETE',
        success: function () {
            alert('Učenik je uspješno obrisan.');
            loadStudents();
        },
        error: function (jqxhr) {
            alert('Greška prilikom brisanja učenika: ' + jqxhr.responseText);
        }
    });
}

// Učitavanje profesora
function loadProfessors() {
    $.getJSON('/api/Profesor', function (professors) {
        const professorsTableBody = $('#professorsTableBody');
        professorsTableBody.empty();
        $.each(professors, function (index, professor) {
            const row = $('<tr></tr>');
            row.append(`<td>${professor.ime} ${professor.prezime}</td>`);
            row.append(`<td>${professor.predmet}</td>`);
            row.append(`<td><button onclick="editProfessor(${professor.id})">Uredi</button><button onclick="deleteProfessor(${professor.id})">Obriši</button></td>`);
            professorsTableBody.append(row);
        });
    }).fail(function (jqxhr, textStatus, error) {
        console.error('Greška prilikom učitavanja profesora:', error);
    });
}

function saveProfessor(event) {
    event.preventDefault();
    const professor = {
        ime: $('#professorFirstName').val(),
        prezime: $('#professorLastName').val(),
        predmet: $('#professorSubject').val()
    };

    $.ajax({
        url: '/api/Profesor',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(professor),
        success: function () {
            alert('Profesor je uspješno spremljen.');
            $('#professorForm')[0].reset();
            loadProfessors();
        },
        error: function (jqxhr) {
            alert('Greška prilikom spremanja profesora: ' + jqxhr.responseText);
        }
    });
}

function deleteProfessor(id) {
    $.ajax({
        url: `/api/Profesor/${id}`,
        type: 'DELETE',
        success: function () {
            alert('Profesor je uspješno obrisan.');
            loadProfessors();
        },
        error: function (jqxhr) {
            alert('Greška prilikom brisanja profesora: ' + jqxhr.responseText);
        }
    });
}
