const { DnaTest, Person } = require('../database/models');
const { Op } = require('sequelize');

const createDnaTest = async (req, res) => {
    const { person_id, test_type, test_date, results } = req.body;
    try {
        const person = await Person.findByPk(person_id);
        if (!person) {
            return res.status(404).json({ message: 'Person not found' });
        }

        const dnaTest = await DnaTest.create({
            person_id,
            test_type,
            test_date,
            results
        });

        res.status(201).json({
            message: 'success',
            data: dnaTest
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'failed',
            error: err.message
        });
    }
};

const updateDnaTest = async (req, res) => {
    const { dna_test_id } = req.params;
    const { test_type, test_date, results } = req.body;
    try {
        const dnaTest = await DnaTest.findByPk(dna_test_id);
        if (!dnaTest) return res.status(404).json({ message: `DNA test with id ${dna_test_id} not found` });

        dnaTest.test_type = test_type || dnaTest.test_type;
        dnaTest.test_date = test_date || dnaTest.test_date;
        dnaTest.results = results || dnaTest.results;

        await dnaTest.save();

        res.status(200).json({
            message: 'updated',
            data: dnaTest
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'failed',
            error: err.message
        });
    }
};

const deleteDnaTest = async (req, res) => {
    const { dna_test_id } = req.params;
    try {
        const dnaTest = await DnaTest.findByPk(dna_test_id);
        if (!dnaTest) return res.status(404).json({ message: `DNA test with id ${dna_test_id} not found` });

        await dnaTest.destroy();

        res.status(200).json({
            message: 'deleted'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'failed',
            error: err.message
        });
    }
};

const getDnaTest = async (req, res) => {
    const { dna_test_id } = req.params;
    try {
        const dnaTest = await DnaTest.findByPk(dna_test_id, {
            include: [{ model: Person }]
        });

        if (!dnaTest) return res.status(404).json({ message: `DNA test with id ${dna_test_id} not found` });

        res.status(200).json({
            message: 'success',
            data: dnaTest
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'failed',
            error: err.message
        });
    }
};

const listDnaTests = async (req, res) => {
    let { pageSize, page, person_id, test_type, test_date_from, test_date_to } = req.query;
    pageSize = parseInt(pageSize || 10);
    page = parseInt(page || 1);

    let where = {};
    if (person_id) where.person_id = person_id;
    if (test_type) where.test_type = test_type;
    if (test_date_from || test_date_to) {
        where.test_date = {};
        if (test_date_from) where.test_date[Op.gte] = test_date_from;
        if (test_date_to) where.test_date[Op.lte] = test_date_to;
    }

    try {
        const { count: total, rows: data } = await DnaTest.findAndCountAll({
            where,
            include: [{ model: Person }],
            order: [['test_date', 'DESC']],
            limit: pageSize,
            offset: (page - 1) * pageSize
        });

        res.status(200).json({
            message: 'success',
            data: {
                total,
                page,
                pageSize,
                data
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'failed',
            error: err.message
        });
    }
};

module.exports = {
    createDnaTest,
    updateDnaTest,
    deleteDnaTest,
    getDnaTest,
    listDnaTests
};