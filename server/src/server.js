import { server } from './express.js';
import { sequelize } from './mysql.js';
await sequelize.sync();
console.log('Connected to MySQL');

server.listen(3000, () => console.log('Server listening on port 3000!'));

