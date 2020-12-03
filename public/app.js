const db = firebase.firestore();
const table = document.querySelector('#tbresult')
const form = document.querySelector('#addform')
db.collection('cadet').get().then((snapshot) => {
    snapshot.forEach(doc => {
        showData(doc);
    });
});
form.addEventListener('submit', (e) => {
    e.preventDefault();

    db.collection('cadet').add({
        name: form.name.value,
        surname: form.surname.value,
        age: form.age.value,
        club: form.club.value,
        class: form.class.value,
        department: form.department.value

    });
    form.name.value = '';
});


function showData(doc) {
    var row = table.insertRow(-1);

    var cell1 = row.insertCell(0)
    var cell2 = row.insertCell(1)
    var cell3 = row.insertCell(2)
    var cell4 = row.insertCell(3)
    var cell5 = row.insertCell(4)
    var cell6 = row.insertCell(5)
    var cell7 = row.insertCell(6)

    cell1.innerHTML = doc.data().name;
    cell2.innerHTML = doc.data().surname;
    cell3.innerHTML = doc.data().class;
    cell4.innerHTML = doc.data().age;
    cell5.innerHTML = doc.data().department;
    cell6.innerHTML = doc.data().club;
    let container = document.createElement('div');
    let btn = document.createElement('button');
    btn.textContent = 'ลบข้อมูล';
    btn.setAttribute('class', 'btn btn-danger');
    btn.setAttribute('data-id', doc.id);
    container.appendChild(btn);
    btn.addEventListener('click', (e) => {
        let id = e.target.getAttribute('data-id');
        db.collection('cadet').doc(id).delete();

    });
    cell7.appendChild(container)



}