const Koa = require('koa');
const static = require('koa-static');
const path = require('path');

const app = new Koa();
app.use(static(path.join(__dirname, 'files')));

app.listen(8889, err => {
    if (err) return console.log(err);
    console.log('update-server running at port 8889!');
});
