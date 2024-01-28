import * as http from 'http';

const server = http.createServer();
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server PORT ${PORT} is running!`);
});
