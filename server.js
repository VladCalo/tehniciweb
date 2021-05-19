const http = require('http');
const path = require('path');
const fs = require('fs');

const port = 3000;
const baseUrl = `http://localhost:${port}/`;

const routes = [
    {
        urlPath: '/',
        page: 'index.html',
    },
    {
        urlPath: '/book-room',
        page: 'book-a-room.html',
    },
    {
        urlPath: '/my-account',
        page: 'my-account.html',
    },
    {
        urlPath: '/about',
        page: 'about.html',
    },
    {
        urlPath: '/404',
        page: '404.html',
    },
];

const server = http.createServer((req, res) => {
    console.info('Request Received!!');
    const url = req.url;
    const method = req.method;

    // serve routes
    if (routes.some((route) => url === route.urlPath) && method === 'GET') {
        const navigatedRoute = routes.filter((route) => route.urlPath === url)[0];
        const pagePath = path.join(__dirname, 'src', navigatedRoute.page);

        return fs.readFile(pagePath, (err, data) => {
            res.setHeader('Content-Type', 'text/html');
            res.statusCode = 200;
            res.write(data);
            return res.end();
        });
    }

    if (url === '/book-room' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });

        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            console.log(parsedBody);
            const bodyItems = parsedBody.split('&');
            console.log(bodyItems);
            const fields = bodyItems.map((field) => {
                const nameValue = field.split('=');
                const name = nameValue[0];
                const value = nameValue[1];
                return {
                    name,
                    value,
                };
            });
            console.log(fields);

            const reservation = fields.reduce((reservationItem, field) => ({ ...reservationItem, [field.name]: field.value }), {});
            console.log(reservation);

            // file format
            // {
            //     reservations: [
            //         {
            //             firstName: 'A'
            //             lastName: 'B'
            //         }
            //     ]
            // }

            const bookingFilePath = path.join(__dirname, 'src', 'data', 'bookings.json');
            return fs.readFile(bookingFilePath, (err, data) => {
                const bookings = JSON.parse(data.toString());
                bookings.reservations.push(reservation);

                fs.writeFile(bookingFilePath, JSON.stringify(bookings), (err) => {
                    console.info('Booking Successfully Completed!');
                    res.statusCode = 302;
                    res.setHeader('Location', '/my-account');
                    return res.end();
                });
            });
        });
    }

    if (url === '/bookings.json' && method === 'GET') {
        const filePath = path.join(__dirname, 'src', 'data', url);
        return fs.readFile(filePath, (err, data) => {
            if (err) {
                res.statusCode = 404;
                return res.end();
            }

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.write(data);
            return res.end();
        });
    }

    if (method === 'GET') {
        const requestedFile = url.replace(baseUrl, '');
        const filePath = path.join(__dirname, 'src', requestedFile);

        res.statusCode = 200;
        if (url.includes('css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (url.includes('js')) {
            res.setHeader('Content-Type', 'text/javascript');
        } else if (url.includes('images')) {
            res.setHeader('Content-Type', 'image/jpeg');
        } else {
            res.setHeader('Content-type', 'text/html');
            res.setHeader('Location', '/404');
            res.statusCode = 302;
            return res.end();
        }

        return fs.readFile(filePath, (err, data) => {
            res.write(data);
            return res.end();
        });
    }

    res.end();
});

server.listen(port);
console.info('Server Started!!');
