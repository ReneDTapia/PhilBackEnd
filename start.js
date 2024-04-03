const app = require("./server");

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
