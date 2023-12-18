const oracledb = require('oracledb');

// Defina o ORACLE_HOME explicitamente se não tiver configurado como variável de ambiente
process.env.ORACLE_HOME = 'C:\\Users\\user\\Downloads\\instantclient-basic-windows.x64-12.2.0.1.0\\instantclient_12_2';

const dbConfig = {
  user: 'A2M',
  password: 'a2m',
  connectString: '(DESCRIPTION = (ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.0.210)(PORT = 1521))(CONNECT_DATA = (SERVER = DEDICATED)(SERVICE_NAME = APOLLO)))',
};

async function conn() {
  try {
    // Estabelecer uma conexão com o banco de dados
    const connection = await oracledb.getConnection(dbConfig);

    console.log('Conexão com o banco de dados Oracle estabelecida com sucesso!');
    console.log('Versão do Oracle:', connection.oracleServerVersion);

    // Retornar a conexão
    return connection;

  } catch (err) {
    console.error('Erro ao conectar ao banco de dados Oracle:', err);
    throw err; // Lançar o erro para ser tratado pelo chamador da função
  }
}

module.exports = { conn }
