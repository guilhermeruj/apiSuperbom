const oracledb = require('oracledb');
const { conn } = require('./Controller/conn');

// Configurar o outFormat para obter o resultado como objeto
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Função no Controller para utilizar os dados da consulta
async function useQueryResult() {
  try {
    const connection = await conn();

    // Executar a consulta
    const result = await connection.execute(
      `SELECT * FROM A2M_PRODUTOS WHERE ATIVO = 'S'`
    );

    console.log(result)
    // Verificar se há registros na consulta
    if (result.rows.length === 0) {
      console.log('Nenhum produto encontrado.');
      return;
    }

    // Obter o primeiro registro da consulta
    const productFromDB = result.rows[0];
    console.log(productFromDB);

    // Restante do código permanece o mesmo...

  } catch (error) {
    console.error('Ocorreu um erro ao utilizar o resultado da consulta:', error);
  }
}

// Chamar a função para utilizar os dados da consulta
useQueryResult();
