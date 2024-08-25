const { PersonAlias, Person } = require('../database/models');
const { Op } = require('sequelize');

const createPersonAlias = async (req, res) => {
    const { person_id, alias_name, alias_type } = req.body;
    try {
        const person = await Person.findByPk(person_id);
        if (!person) {
            return res.status(404).json({ message: 'Person not found' });
        }

        const personAlias = await PersonAlias.create({
            person_id,
            alias_name,
            alias_type
        });

        res.status(201).json({
            message: 'success',
            data: personAlias
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'failed',
            error: err.message
        });
    }
};

const updatePersonAlias = async (req, res) => {
    const { alias_id } = req.params;
    const { alias_name, alias_type } = req.body;
    try {
        const personAlias = await PersonAlias.findByPk(alias_id);
        if (!personAlias) return res.status(404).json({ message: `Person alias with id ${alias_id} not found` });

        personAlias.alias_name = alias_name || personAlias.alias_name;
        personAlias.alias_type = alias_type || personAlias.alias_type;

        await personAlias.save();

        res.status(200).json({
            message: 'updated',
            data: personAlias
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'failed',
            error: err.message
        });
    }
};

const deletePersonAlias = async (req, res) => {
    const { alias_id } = req.params;
    try {
        const personAlias = await PersonAlias.findByPk(alias_id);
        if (!personAlias) return res.status(404).json({ message: `Person alias with id ${alias_id} not found` });

        await personAlias.destroy();

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

const getPersonAlias = async (req, res) => {
    const { alias_id } = req.params;
    try {
        const personAlias = await PersonAlias.findByPk(alias_id, {
            include: [{ model: Person }]
        });

        if (!personAlias) return res.status(404).json({ message: `Person alias with id ${alias_id} not found` });

        res.status(200).json({
            message: 'success',
            data: personAlias
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'failed',
            error: err.message
        });
    }
};

const listPersonAliases = async (req, res) => {
    let { pageSize, page, person_id, alias_type, search } = req.query;
    pageSize = parseInt(pageSize || 10);
    page = parseInt(page || 1);

    let where = {};
    if (person_id) where.person_id = person_id;
    if (alias_type) where.alias_type = alias_type;
    if (search) {
        where.alias_name = { [Op.like]: `%${search}%` };
    }

    try {
        const { count: total, rows: data } = await PersonAlias.findAndCountAll({
            where,
            include: [{ model: Person }],
            order: [['createdAt', 'DESC']],
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
    createPersonAlias,
    updatePersonAlias,
    deletePersonAlias,
    getPersonAlias,
    listPersonAliases
};