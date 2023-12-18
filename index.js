const { conn } = require('./Controller/conn');
const oracledb = require('oracledb');
const axios = require('axios');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Configurar o outFormat para obter o resultado como objeto
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Função para cadastrar um produto na Nuvemshop
async function createProductOnNuvemshop(accessToken, storeId, productData) {
  const headers = {
    'Authentication': `bearer ${accessToken}`,
    'User-Agent': 'MyApp (guilhermeruj@gmail.com)'
  };

  try {
    const response = await axios.post(`https://api.tiendanube.com/v1/${storeId}/products`, productData, { headers });

    if (response.status === 201) {
      console.log('Produto cadastrado com sucesso na NuvemShop');
    } else {
      console.error('NuvemShop não aceitou o cadastro do produto');
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      console.error(`Erro ao cadastrar o produto na NuvemShop: ${error.response.data.message}`);
    } else {
      console.error('Erro ao cadastrar o produto na NuvemShop:', error.message);
    }
    console.error('Produto com erro:', productData);
  }
}

// Função no Controller para utilizar os dados da consulta e cadastrar os produtos
async function useQueryResult() {
  try {
    const accessToken = '86bad942ff967a8923a81fbd48bb37e012a5b091'; // Substitua 'seu_token_de_acesso' pelo valor real do token
    const storeId = '3032779'; // Substitua 'seu_id_da_loja' pelo ID real da loja

    if (!accessToken) {
      throw new Error('Erro na autenticação');
    }

    const connection = await conn();

    // Executar a consulta
    const result = await connection.execute(
      `SELECT * FROM A2M_PRODUTOS WHERE ATIVO = 'S'`
    );

    // Verificar se há registros na consulta
    if (result.rows.length === 0) {
      console.log('Nenhum produto encontrado.');
      return;
    }

    // Loop para cadastrar os produtos com um intervalo de 5 segundos entre cada cadastro
    const products = result.rows;
    for (const productFromDB of products) {
      const stock = formatStockValue(productFromDB.ESTOQUE);
      // Mapear os campos do banco de dados para as variáveis do exemplo
      const productData = {
        name: {
          en: productFromDB.DESCRICAO,
          es: productFromDB.DESCRICAO,
          pt: productFromDB.DESCRICAO,
        },
        variants: [
          {
            price: productFromDB.VRVENDA.toFixed(2), // Formatar o preço com duas casas decimais
            stock_management: true,
            stock: stock, // Arredondar o estoque para um valor inteiro
            cost: productFromDB.VRCUSTO.toFixed(2), // Formatar o custo com duas casas decimais
          }
        ],
      };
      await createProductOnNuvemshop(accessToken, storeId, productData);
      await wait(500); // Aguardar 5 segundos antes de cadastrar o próximo produto
    }
  } catch (error) {
    console.error('Erro ao cadastrar os produtos na NuvemShop:', error.message);
  }
}

function formatStockValue(stockValue) {
  // Verificar se o estoque é negativo
  if (stockValue < 0) {
    return 22000; // Valor para indicar estoque ilimitado
  }

  if (Number.isInteger(stockValue)) {
    // Se o valor for inteiro, multiplicar por 1000 para eliminar o ponto decimal.
    return stockValue * 1000;
  } else {
    // Se o valor contém casas decimais, multiplicar por 1000 e arredondar para cima.
    return Math.ceil(stockValue * 1000);
  }
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Chamar a função para utilizar os dados da consulta e cadastrar os produtos na Nuvemshop
useQueryResult();