const nameinp=document.querySelector('.newitemrow input');
const addbtn=document.querySelector('.submititembtn');
const grlist=document.querySelector('.grocerylist');
const statlft=document.querySelectorAll('.infopanel .labelsgroup')[0];
const statrgt=document.querySelectorAll('.infopanel .labelsgroup')[1];

let items=JSON.parse(localStorage.getItem('buylist'))||[
    { id: 1, name: 'Помідори', quant: 2, ispurchased: true },
    { id: 2, name: 'Печиво', quant: 2, ispurchased: false },
    { id: 3, name: 'Сир', quant: 1, ispurchased: false }
];

function savedt() {
    localStorage.setItem('buylist', JSON.stringify(items));
}

function rend() {
    grlist.innerHTML='';
    statlft.innerHTML='';
    statrgt.innerHTML='';

    items.forEach(it => {
        const rw=document.createElement('div');
        rw.className='groceryrow';
        rw.dataset.id=it.id;

        const tcls=it.ispurchased ? 'producttitle ispurchased' : 'producttitle';
        let thtm=`<div class="${tcls}" data-action="edit">${it.name}</div>`;

        let qhtm='';
        if (it.ispurchased) {
            qhtm=`<span class="amountdisplay inactive">${it.quant}</span>`;
        } else {
            const dbtn=it.quant===1 ? 'style="opacity:0.5; cursor:not-allowed;"' : '';
            qhtm=`
                <button class="roundbtn decreasebtn" data-action="decrease" data-tooltip="Зменшити ксть" ${dbtn}>-</button>
                <span class="amountdisplay">${it.quant}</span>
                <button class="roundbtn increasebtn" data-action="increase" data-tooltip="Збільшити ксть">+</button>
            `;
        }

        const tgtxt=it.ispurchased ? 'Не куплено' : 'Куплено';
        const tgtip=it.ispurchased ? 'Скасувати купівлю' : 'Позначити купленим';
        const rmhtm=!it.ispurchased ? `<button class="removeitembtn" data-action="remove" data-tooltip="Видалити товар">✖</button>` : '';

        rw.innerHTML=`
            ${thtm}
            <div class="quantitymanager">${qhtm}</div>
            <button class="togglestatebtn" data-action="toggle" data-tooltip="${tgtip}">${tgtxt}</button>
            ${rmhtm}
        `;
        grlist.appendChild(rw);

        const lhtm=`<div class="summarylabel ${it.ispurchased ? 'ispurchased' : ''}">${it.name} <span class="labelcount">${it.quant}</span></div>`;
        if (it.ispurchased) {
            statrgt.insertAdjacentHTML('beforeend', lhtm);
        } else {
            statlft.insertAdjacentHTML('beforeend', lhtm);
        }
    });

    savedt();
}

function addit() {
    const nm=nameinp.value.trim();
    if (nm) {
        items.push({
            id: Date.now(),
            name: nm,
            quant: 1,
            ispurchased: false
        });
        nameinp.value='';
        nameinp.focus();
        rend();
    }
}

addbtn.addEventListener('click', addit);
nameinp.addEventListener('keypress', (e) => {
    if (e.key==='Enter') addit();
});

grlist.addEventListener('click', (e) => {
    const rw=e.target.closest('.groceryrow');
    if (!rw) return;
    const id=Number(rw.dataset.id);
    const it=items.find(i => i.id===id);
    if (!it) return;

    const act=e.target.dataset.action;

    if (act==='remove') {
        items=items.filter(i => i.id!==id);
        rend();
    }

    if (act==='toggle') {
        it.ispurchased=!it.ispurchased;
        rend();
    }

    if (act==='increase') {
        it.quant++;
        rend();
    }
    
    if (act==='decrease' && it.quant>1) {
        it.quant--;
        rend();
    }

    if (act==='edit' && !it.ispurchased) {
        const tdv=e.target;
        const cnm=it.name;
        
        tdv.innerHTML=`<input type="text" class="inlineeditfield" value="${cnm}">`;
        const einp=tdv.querySelector('input');
        
        einp.focus();
        
        const vl=einp.value;
        einp.value='';
        einp.value=vl;

        einp.addEventListener('blur', () => {
            const nnm=einp.value.trim();
            if (nnm) it.name=nnm;
            rend();
        });

        einp.addEventListener('keypress', (e) => {
            if (e.key==='Enter') einp.blur();
        });
    }
});
rend();