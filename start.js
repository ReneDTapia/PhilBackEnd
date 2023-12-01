const app = require('./server2');

const PORT = process.env.PORT || 5006;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});