// Importando as dependências
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Inicializando as listas em memória
let clientes = [];
let carros = [];
let servicos = [];
let agendamentos = [];
let clienteId = 1;
let carroId = 1;
let servicoId = 1;
let agendamentoId = 1;

// Endpoints para Clientes
app.get('/clientes', (req, res) => {
    res.json(clientes);
});

app.post('/clientes', (req, res) => {
    const { nome, telefone } = req.body;

    if (!nome || nome.length < 3 || nome.length > 100) {
        return res.status(400).json({ mensagem: "'nome' deve conter entre 3 e 100 caracteres" });
    }

    if (!telefone || telefone.length !== 11 || !/^\d+$/.test(telefone)) {
        return res.status(400).json({ mensagem: "'telefone' deve conter exatamente 11 dígitos e apenas números" });
    }

    const cliente = { id: clienteId++, nome, telefone };
    clientes.push(cliente);
    res.status(201).json({ mensagem: "Cliente cadastrado com sucesso" });
});

app.get('/clientes/:codigo', (req, res) => {
    const cliente = clientes.find(c => c.id === parseInt(req.params.codigo));
    if (!cliente) return res.status(404).json({ message: "Cliente não encontrado" });
    res.json(cliente);
});

app.put('/clientes/:codigo', (req, res) => {
    const { nome, telefone } = req.body;
    const cliente = clientes.find(c => c.id === parseInt(req.params.codigo));

    if (!cliente) return res.status(404).json({ message: "Cliente não encontrado" });

    if (!nome || nome.length < 3 || nome.length > 100) {
        return res.status(400).json({ mensagem: "'nome' deve conter entre 3 e 100 caracteres" });
    }

    if (!telefone || telefone.length !== 11 || !/^\d+$/.test(telefone)) {
        return res.status(400).json({ mensagem: "'telefone' deve conter exatamente 11 dígitos e apenas números" });
    }

    cliente.nome = nome;
    cliente.telefone = telefone;
    res.json({ mensagem: "Cliente atualizado com sucesso" });
});

app.delete('/clientes/:codigo', (req, res) => {
    const index = clientes.findIndex(c => c.id === parseInt(req.params.codigo));
    if (index === -1) return res.status(404).json({ message: "Cliente não encontrado" });
    clientes.splice(index, 1);
    res.json({ mensagem: "Cliente removido com sucesso" });
});

// Endpoints para Carros
app.get('/carros', (req, res) => {
    res.json(carros);
});

app.post('/carros', (req, res) => {
    const { marca, modelo, tamanho, id_cliente } = req.body;

    if (!marca || marca.length < 3 || marca.length > 50) {
        return res.status(400).json({ mensagem: "'marca' deve conter entre 3 e 50 caracteres" });
    }

    if (!modelo || modelo.length < 2 || modelo.length > 50) {
        return res.status(400).json({ mensagem: "'modelo' deve conter entre 2 e 50 caracteres" });
    }

    const tamanhosValidos = ["HATCH", "SEDAN", "SUV", "PICAPE"];
    if (!tamanhosValidos.includes(tamanho)) {
        return res.status(400).json({ mensagem: "'tamanho' deve ser HATCH, SEDAN, SUV ou PICAPE" });
    }

    const cliente = clientes.find(c => c.id === id_cliente);
    if (!cliente) {
        return res.status(400).json({ mensagem: "'id_cliente' não corresponde a um cliente cadastrado" });
    }

    const carro = { id: carroId++, marca, modelo, tamanho, id_cliente };
    carros.push(carro);
    res.status(201).json({ mensagem: "Carro cadastrado com sucesso" });
});

app.get('/carros/:codigo', (req, res) => {
    const carro = carros.find(c => c.id === parseInt(req.params.codigo));
    if (!carro) return res.status(404).json({ message: "Carro não encontrado" });
    res.json(carro);
});

app.put('/ carros/:codigo', (req, res) => {
    const { marca, modelo, tamanho, id_cliente } = req.body;
    const carro = carros.find(c => c.id === parseInt(req.params.codigo));

    if (!carro) return res.status(404).json({ message: "Carro não encontrado" });

    if (!marca || marca.length < 3 || marca.length > 50) {
        return res.status(400).json({ mensagem: "'marca' deve conter entre 3 e 50 caracteres" });
    }

    if (!modelo || modelo.length < 2 || modelo.length > 50) {
        return res.status(400).json({ mensagem: "'modelo' deve conter entre 2 e 50 caracteres" });
    }

    const tamanhosValidos = ["HATCH", "SEDAN", "SUV", "PICAPE"];
    if (!tamanhosValidos.includes(tamanho)) {
        return res.status(400).json({ mensagem: "'tamanho' deve ser HATCH, SEDAN, SUV ou PICAPE" });
    }

    const cliente = clientes.find(c => c.id === id_cliente);
    if (!cliente) {
        return res.status(400).json({ mensagem: "'id_cliente' não corresponde a um cliente cadastrado" });
    }

    carro.marca = marca;
    carro.modelo = modelo;
    carro.tamanho = tamanho;
    carro.id_cliente = id_cliente;
    res.json({ mensagem: "Carro atualizado com sucesso" });
});

app.delete('/carros/:codigo', (req, res) => {
    const index = carros.findIndex(c => c.id === parseInt(req.params.codigo));
    if (index === -1) return res.status(404).json({ message: "Carro não encontrado" });
    carros.splice(index, 1);
    res.json({ mensagem: "Carro removido com sucesso" });
});

// Endpoints para Serviços
app.get('/servicos', (req, res) => {
    res.json(servicos);
});

app.post('/servicos', (req, res) => {
    const { descricao, valores } = req.body;

    if (!descricao || descricao.length < 5 || descricao.length > 100) {
        return res.status(400).json({ mensagem: "'descricao' deve conter entre 5 e 100 caracteres" });
    }

    if (!Array.isArray(valores) || valores.some(v => v.valor < 0)) {
        return res.status(400).json({ mensagem: "Os valores devem ser iguais ou maiores que 0" });
    }

    const servico = { id: servicoId++, descricao, valores };
    servicos.push(servico);
    res.status(201).json({ mensagem: "Serviço cadastrado com sucesso" });
});

app.get('/servicos/:codigo', (req, res) => {
    const servico = servicos.find(s => s.id === parseInt(req.params.codigo));
    if (!servico) return res.status(404).json({ message: "Serviço não encontrado" });
    res.json(servico);
});

app.put('/servicos/:codigo', (req, res) => {
    const { descricao, valores } = req.body;
    const servico = servicos.find(s => s.id === parseInt(req.params.codigo));

    if (!servico) return res.status(404).json({ message: "Serviço não encontrado" });

    if (!descricao || descricao.length < 5 || descricao.length > 100) {
        return res.status(400).json({ mensagem: "'descricao' deve conter entre 5 e 100 caracteres" });
    }

    if (!Array.isArray(valores) || valores.some(v => v.valor < 0)) {
        return res.status(400).json({ mensagem: "Os valores devem ser iguais ou maiores que 0" });
    }

    servico.descricao = descricao;
    servico.valores = valores;
    res.json({ mensagem: "Serviço atualizado com sucesso" });
});

app.delete('/servicos/:codigo', (req, res) => {
    const index = servicos.findIndex(s => s.id === parseInt(req.params.codigo));
    if (index === -1) return res.status(404).json({ message: "Serviço não encontrado" });
    servicos.splice(index, 1);
    res.json({ mensagem: "Serviço removido com sucesso" });
});

// Endpoints para Agendamentos
app.get('/agendamentos', (req, res) => {
    res.json(agendamentos);
});

app.post('/agendamentos', (req, res) => {
    const { id_carro, id_servico, data_hora } = req.body;

    const carro = carros.find(c => c.id === id_carro);
    if (! carro) {
        return res.status(400).json({ mensagem: "'id_carro' não corresponde a um carro cadastrado" });
    }

    const servico = servicos.find(s => s.id === id_servico);
    if (!servico) {
        return res.status(400).json({ mensagem: "'id_servico' não corresponde a um serviço cadastrado" });
    }

    if (!data_hora) {
        return res.status(400).json({ mensagem: "'data_hora' deve ser informado" });
    }

    const agendamento = { id: agendamentoId++, id_carro, id_servico, data_hora };
    agendamentos.push(agendamento);
    res.status(201).json({ mensagem: "Agendamento cadastrado com sucesso" });
});

app.get('/agendamentos/:codigo', (req, res) => {
    const agendamento = agendamentos.find(a => a.id === parseInt(req.params.codigo));
    if (!agendamento) return res.status(404).json({ message: "Agendamento não encontrado" });
    res.json(agendamento);
});

app.delete('/agendamentos/:codigo', (req, res) => {
    const index = agendamentos.findIndex(a => a.id === parseInt(req.params.codigo));
    if (index === -1) return res.status(404).json({ message: "Agendamento não encontrado" });
    agendamentos.splice(index, 1);
    res.json({ mensagem: "Agendamento removido com sucesso" });
});

// Iniciando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Exportando o módulo
module.exports = app;