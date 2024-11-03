$(document).ready(function () {
    const pageId = $('body').attr('id');

    if (pageId === 'schedulePage') {
        loadSchedule();

        $('#loadScheduleButton').on('click', function () {
            loadSchedule();
        });

        // Event handler for clearing schedule
        $('#clearScheduleButton').on('click', function () {
            if (confirm('Jeste li sigurni da želite obrisati postojeći raspored?')) {
                clearSchedule();
            }
        });

        // Event handler for generating schedule
        $('#generateScheduleButton').on('click', function () {
            if (confirm('Jeste li sigurni da želite generirati novi raspored? Ovo će obrisati postojeći raspored.')) {
                generateSchedule();
            }
        });

    } else if (pageId === 'exclusionsPage') {
        loadExclusions();
        $('#exclusionForm').on('submit', saveExclusion);
        $('#cancelExclusionEdit').on('click', function () {
            $('#exclusionForm')[0].reset();
            $('#exclusionId').val('');
        });
    } else if (pageId === 'studentsPage') {
        loadStudents();
        loadClasses(); // Load classes when managing students
        $('#studentForm').on('submit', saveStudent);
        $('#cancelStudentEdit').on('click', function () {
            $('#studentForm')[0].reset();
            $('#studentId').val('');
        });
    } else if (pageId === 'professorsPage') {
        loadProfessors();
        $('#professorForm').on('submit', saveProfessor);
        $('#cancelProfessorEdit').on('click', function () {
            $('#professorForm')[0].reset();
            $('#professorId').val('');
        });
   } 

    // Attach event handlers for dynamic elements
    $(document).on('click', '.edit-student', function () {
        const id = $(this).data('id');
        editStudent(id);
    });

    $(document).on('click', '.delete-student', function () {
        const id = $(this).data('id');
        deleteStudent(id);
    });

    $(document).on('click', '.edit-professor', function () {
        const id = $(this).data('id');
        editProfessor(id);
    });

    $(document).on('click', '.delete-professor', function () {
        const id = $(this).data('id');
        deleteProfessor(id);
    });

    $(document).on('click', '.delete-exclusion', function () {
        const id = $(this).data('id');
        deleteExclusion(id);
    });
});

// Global functions

// Učitavanje rasporeda
function loadSchedule() {
    const selectedDate = $('#dateSelect').val() || new Date().toISOString().split('T')[0];
    const apiUrl = `/api/Raspored?date=${encodeURIComponent(selectedDate)}`;
    console.log('Requesting schedule from:', apiUrl);

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
            row.append(`<td>${exclusion.datum.split('T')[0]}</td>`);
            row.append(`<td><button class="delete-exclusion" data-id="${exclusion.id}">Obriši</button></td>`);
            exclusionsTableBody.append(row);
        });
    }).fail(function (jqxhr, textStatus, error) {
        console.error('Greška prilikom učitavanja izuzetaka:', error);
        alert('Došlo je do pogreške prilikom učitavanja izuzetaka.');
    });
}

function saveExclusion(event) {
    event.preventDefault();
    const dateValue = $('#exclusionDate').val();
    const exclusion = {
        datum: dateValue + 'T00:00:00' // Append time to date
    };

    console.log('Saving exclusion:', exclusion);

    $.ajax({
        url: '/api/Izuzetak',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(exclusion),
        success: function () {
            alert('Izuzetak je uspješno spremljen.');
            $('#exclusionForm')[0].reset();
            loadExclusions();
        },
        error: function (jqxhr) {
            alert('Greška prilikom spremanja izuzetka: ' + jqxhr.responseText);
        }
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
            row.append(`<td>
                <button class="edit-student" data-id="${student.id}">Uredi</button>
                <button class="delete-student" data-id="${student.id}">Obriši</button>
            </td>`);
            studentsTableBody.append(row);
        });
    }).fail(function (jqxhr, textStatus, error) {
        console.error('Greška prilikom učitavanja učenika:', error);
        alert('Došlo je do pogreške prilikom učitavanja učenika.');
    });
}

function saveStudent(event) {
    event.preventDefault();

    // Convert studentId to integer if possible, or leave it undefined if empty
    const studentId = parseInt($('#studentId').val().trim()) || undefined;

    // Log to verify the studentId value
    console.log('Student ID (for edit, if present):', studentId);

    // Build the student object, only adding `id` if `studentId` is defined
    const student = {
        ime: $('#firstName').val(),
        prezime: $('#lastName').val(),
        razredId: parseInt($('#classId').val())
    };

    if (studentId) {
        student.id = studentId;
    }

    // Log the final student object before sending
    console.log('Final student object to save:', student);

    let ajaxOptions = {
        url: studentId ? `/api/Ucenik/${studentId}` : '/api/Ucenik',
        type: studentId ? 'PUT' : 'POST',
        contentType: 'application/json',
        data: JSON.stringify(student),
        success: function () {
            alert('Učenik je uspješno spremljen.');
            $('#studentForm')[0].reset();
            $('#studentId').val(''); // Clear the hidden field after saving
            loadStudents();
        },
        error: function (jqxhr) {
            console.error('Greška prilikom spremanja učenika:', jqxhr.responseText);
            alert('Greška prilikom spremanja učenika: ' + jqxhr.responseText);
        }
    };

    $.ajax(ajaxOptions);
}

function editStudent(id) {
    $.getJSON(`/api/Ucenik/${id}`, function (student) {
        $('#studentId').val(student.id);
        $('#firstName').val(student.ime);
        $('#lastName').val(student.prezime);
        $('#classId').val(student.razredId);
    }).fail(function (jqxhr, textStatus, error) {
        console.error('Greška prilikom dohvaćanja učenika:', error);
        alert('Došlo je do pogreške prilikom dohvaćanja podataka učenika.');
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

// Učitavanje razreda za dropdown
function loadClasses() {
    $.getJSON('/api/Razred', function (classes) {
        const classSelect = $('#classId');
        classSelect.empty(); // Clear existing options

        // Populate with options
        classSelect.append('<option value="">Odaberi razred</option>');
        $.each(classes, function (index, classItem) {
            classSelect.append(`<option value="${classItem.id}">${classItem.name} ${classItem.oznaka}</option>`);
        });
    }).fail(function (jqxhr, textStatus, error) {
        console.error('Greška prilikom učitavanja razreda:', error);
        alert('Došlo je do pogreške prilikom učitavanja razreda.');
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
            row.append(`<td>
                <button class="edit-professor" data-id="${professor.id}">Uredi</button>
                <button class="delete-professor" data-id="${professor.id}">Obriši</button>
            </td>`);
            professorsTableBody.append(row);
        });
    }).fail(function (jqxhr, textStatus, error) {
        console.error('Greška prilikom učitavanja profesora:', error);
        alert('Došlo je do pogreške prilikom učitavanja profesora.');
    });
}

function saveProfessor(event) {
    event.preventDefault();
    const professorId = $('#professorId').val().trim();
    console.log('professorId:', professorId);

    let professor;

    if (professorId) {
        // Existing professor - include `id`
        professor = {
            id: parseInt(professorId),
            ime: $('#professorFirstName').val(),
            prezime: $('#professorLastName').val(),
            predmet: $('#subject').val()
        };
    } else {
        // New professor - exclude `id`
        professor = {
            ime: $('#professorFirstName').val(),
            prezime: $('#professorLastName').val(),
            predmet: $('#subject').val()
        };
    }

    console.log('Saving professor:', professor);

    let ajaxOptions = {
        url: professorId ? `/api/Profesor/${professorId}` : '/api/Profesor',
        type: professorId ? 'PUT' : 'POST',
        contentType: 'application/json',
        data: JSON.stringify(professor),
        success: function () {
            alert('Profesor je uspješno spremljen.');
            $('#professorForm')[0].reset();
            $('#professorId').val('');
            loadProfessors();
        },
        error: function (jqxhr) {
            alert('Greška prilikom spremanja profesora: ' + jqxhr.responseText);
        }
    };

    $.ajax(ajaxOptions);
}

function editProfessor(id) {
    $.getJSON(`/api/Profesor/${id}`, function (professor) {
        $('#professorId').val(professor.id);
        $('#professorFirstName').val(professor.ime);
        $('#professorLastName').val(professor.prezime);
        $('#subject').val(professor.predmet);
    }).fail(function (jqxhr, textStatus, error) {
        console.error('Greška prilikom dohvaćanja profesora:', error);
        alert('Došlo je do pogreške prilikom dohvaćanja podataka profesora.');
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

function clearSchedule() {
    $.ajax({
        url: '/api/Raspored/clear',
        type: 'POST',
        success: function () {
            alert('Raspored je uspješno obrisan.');
            loadSchedule();
        },
        error: function (jqxhr) {
            alert('Greška prilikom brisanja rasporeda: ' + jqxhr.responseText);
        }
    });
}

function generateSchedule() {
    $.ajax({
        url: '/api/Raspored/generate',
        type: 'POST',
        success: function () {
            alert('Raspored je uspješno generiran.');
            loadSchedule();
        },
        error: function (jqxhr) {
            alert('Greška prilikom generiranja rasporeda: ' + jqxhr.responseText);
        }
    });
}
