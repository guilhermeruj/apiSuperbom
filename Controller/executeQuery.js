const { conn } = require('./conn');

// Função para executar a pesquisa
async function executeQuery() {
  try {
    // Obter a conexão
    const connection = await conn();

    // Executar a consulta
    const result = await connection.execute(
      `SELECT * FROM A2M_PRODUTOS`
    );

    // Fechar a conexão após a execução da consulta
    await connection.close();

    // Retornar os dados da consulta
    return result.rows;

  } catch (error) {
    console.error('Ocorreu um erro durante a execução da consulta:', error);
    throw error; // Lançar o erro para ser tratado pelo chamador da função
  }
}

module.exports = { executeQuery };