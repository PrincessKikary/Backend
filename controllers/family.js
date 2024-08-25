const { Family, Person } = require('../database/models');
const { Op } = require('sequelize');

const createFamily = async (req, res) => {
    const { family_name, description, founding_date, person_ids } = req.body;
    try {
        const family = await Family.create({
            family_name,
            description,
            founding_date
        });

        if (person_ids && person_ids.length > 0) {
            const persons = await Person.findAll({ where: { person_id: person_ids } });
            await family.setPersons(persons);
        }

        res.status(201).json({
            message: 'success',
            data: family
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'failed',
            error: err.message
        });
    }
};

const updateFamily = async (req, res) => {
    const { family_id } = req.params;
    const { family_name, description, founding_date, person_ids } = req.body;
    try {
        const family = await Family.findByPk(family_id);
        if (!family) return res.status(404).json({ message: `Family with id ${family_id} not found` });

        family.family_name = family_name || family.family_name;
        family.description = description || family.description;
        family.founding_date = founding_date || family.founding_date;

        await family.save();

        if (person_ids) {
            const persons = await Person.findAll({ where: { person_id: person_ids } });
            await family.setPersons(persons);
        }

        res.status(200).json({
            message: 'updated',
            data: family
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'failed',
            error: err.message
        });
    }
};

const deleteFamily = async (req, res) => {
    const { family_id } = req.params;
    try {
        const family = await Family.findByPk(family_id);
        if (!family) return res.status(404).json({ message: `Family with id ${family_id} not found` });

        await family.destroy();

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

const getFamily = async (req, res) => {
    const { family_id } = req.params;
    try {
        const family = await Family.findByPk(family_id, {
            include: [{ model: Person }]
        });

        if (!family) return res.status(404).json({ message: `Family with id ${family_id} not found` });

        res.status(200).json({
            message: 'success',
            data: family
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'failed',
            error: err.message
        });
    }
};

const listFamilies = async (req, res) => {
    let { pageSize, page, search, sort_by, order, founding_date_from, founding_date_to } = req.query;
    pageSize = parseInt(pageSize || 10);
    page = parseInt(page || 1);

    let where = {};
    if (search) {
        where[Op.or] = [
            { family_name: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ];
    }
    if (founding_date_from || founding_date_to) {
        where.founding_date = {};
        if (founding_date_from) where.founding_date[Op.gte] = founding_date_from;
        if (founding_date_to) where.founding_date[Op.lte] = founding_date_to;
    }

    try {
        const { count: total, rows: data } = await Family.findAndCountAll({
            where,
            include: [{ model: Person }],
            order: sort_by && order ? [[sort_by, order]] : [['createdAt', 'DESC']],
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

const addPersonToFamily = async (req, res) => {
    const { family_id } = req.params;
    const { person_id } = req.body;
    try {
        const family = await Family.findByPk(family_id);
        if (!family) return res.status(404).json({ message: `Family with id ${family_id} not found` });

        const person = await Person.findByPk(person_id);
        if (!person) return res.status(404).json({ message: `Person with id ${person_id} not found` });

        await family.addPerson(person);

        res.status(200).json({
            message: 'Person added to family',
            data: { family_id, person_id }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'failed',
            error: err.message
        });
    }
};

const removePersonFromFamily = async (req, res) => {
    const { family_id, person_id } = req.params;
    try {
        const family = await Family.findByPk(family_id);
        if (!family) return res.status(404).json({ message: `Family with id ${family_id} not found` });

        const person = await Person.findByPk(person_id);
        if (!person) return res.status(404).json({ message: `Person with id ${person_id} not found` });

        await family.removePerson(person);

        res.status(200).json({
            message: 'Person removed from family',
            data: { family_id, person_id }
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
    createFamily,
    updateFamily,
    deleteFamily,
    getFamily,
    listFamilies,
    addPersonToFamily,
    removePersonFromFamily
};