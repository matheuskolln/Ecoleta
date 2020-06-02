import express from 'express';

const app = express();

app.get('/users', (req, res) => {
    console.log('Listagem de usuários');

    res.json([
        'Matheus',
        'Rayssa',
        'Nicolas',
        'Henrique'
    ]);
});

app.listen(3333);
