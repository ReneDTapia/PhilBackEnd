const app = require('./server');

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

