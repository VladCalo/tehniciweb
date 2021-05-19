const listOfNavItems = [
    {
        id: 'home',
        label: 'Hotels',
        url: '/',
    },
    {
        id: 'book-a-room',
        label: 'Book a Room',
        url: '/book-room',
    },
    {
        id: 'my-account',
        label: 'My Account',
        url: '/my-account',
    },
    {
        id: 'about',
        label: 'About',
        url: '/about',
    },
];

const setSelectedNavigationItemStatus = () => {
    const currentUrl = window.location.pathname;

    console.log('CURRENT PATH:::', currentUrl);
    const selectedIds = listOfNavItems.filter((e) => currentUrl === e.url).map((e) => e.id);
    if (selectedIds && selectedIds.length > 0) {
        const selectedId = selectedIds[0];
        console.log('SELECTED MENU ID:::', selectedId);
        if (selectedId) {
            const hlink = document.getElementById(selectedId);
            if (hlink) {
                hlink.classList += 'selected';
            } else {
                console.error('A menu should be available. Please check with the website admin.');
            }
        }
    }
};

const createNavigationBar = () => {
    const elements = document.getElementsByTagName('nav');
    if (elements.length > 0) {
        const navElement = elements[0];
        console.log('JS Generated Element::', navElement);

        listOfNavItems.forEach((navItem) => {
            const hlink = document.createElement('a');
            hlink.setAttribute('id', navItem.id);
            hlink.href = navItem.url;
            hlink.innerText = navItem.label;
            navElement.appendChild(hlink);
        });
    }
};

const createGridHeader = (data) => {
    const grid = document.getElementsByClassName('grid')[0];
    const rowTemplate = document.getElementById('row-template');
    const row = rowTemplate.cloneNode(true);
    row.classList.remove('hidden');
    row.setAttribute('id', 'header');
    let index = 0;
    Object.keys(data).map((key) => {
        if (row.childNodes.length > index) {
            const div = row.children[index];
            if (div) {
                const span = div.firstChild;
                span.innerText = key;
                index++;
            }
        }
    });

    grid.appendChild(row);
};

const createGridRow = (data) => {
    const grid = document.getElementsByClassName('grid')[0];
    const rowTemplate = document.getElementById('row-template');
    const row = rowTemplate.cloneNode(true);
    row.classList.remove('hidden');
    row.setAttribute('id', 1);
    let index = 0;
    console.log(row);
    Object.keys(data).map((key) => {
        if (row.childNodes.length > index) {
            const div = row.children[index];
            console.log(div);
            if (div) {
                div.firstChild.innerText = unescape(data[key]);
                index++;
            }
        }
    });

    grid.appendChild(row);
};

createNavigationBar();
setSelectedNavigationItemStatus();

if (window.location.pathname === '/my-account') {
    fetch('http://localhost:3000/bookings.json')
        .then((response) => response.json())
        .then((response) => {
            console.log(response);
            const reservations = response.reservations;
            if (reservations.length > 0) {
                createGridHeader(reservations[0]);
                reservations.forEach((reservation) => createGridRow(reservation));
            } else {
                const grid = document.getElementsByClassName('grid')[0];
                grid.innerText = 'No reservations';
            }
        })
        .catch((error) => (window.location = '/404'));
}
