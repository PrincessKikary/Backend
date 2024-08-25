const { Person, Relationship, Event, Document, DnaTest, PersonAlias, Family } = require('../database/models');
const { Op } = require('sequelize');

const createPerson = async (req, res) => {
    const { first_name, last_name, birth_date, death_date, gender, birth_place, death_place, family_ids } = req.body;
    try {
        const person = await Person.create({
            first_name,
            last_name,
            birth_date,
            death_date,
            gender,
            birth_place,
            death_place
        });

        if (family_ids && family_ids.length > 0) {
            await person.setFamilies(family_ids);
        }

        res.status(201).json({
            message: 'success',
            data: person
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'failed',
            error: err.message
        });
    }
};

const updatePerson = async (req, res) => {
    const { person_id } = req.params;
    try {
        const person = await Person.findByPk(person_id);
        if (!person) return res.status(404).json({ message: `Person with id ${person_id} not found` });

        const updatableFields = ['first_name', 'last_name', 'birth_date', 'death_date', 'gender', 'birth_place', 'death_place'];
        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                person[field] = req.body[field];
            }
        });

        if (req.body.family_ids) {
            await person.setFamilies(req.body.family_ids);
        }

        await person.save();

        res.status(200).json({
            message: 'updated',
            data: person
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'failed',
            error: err.message
        });
    }
};

const deletePerson = async (req, res) => {
    const { person_id } = req.params;
    try {
        const person = await Person.findByPk(person_id);
        if (!person) return res.status(404).json({ message: `Person with id ${person_id} not found` });

        // Delete related records
        await Relationship.destroy({ where: { [Op.or]: [{ person1_id: person_id }, { person2_id: person_id }] } });
        await Event.destroy({ where: { person_id } });
        await Document.destroy({ where: { person_id } });
        await DnaTest.destroy({ where: { person_id } });
        await PersonAlias.destroy({ where: { person_id } });

        await person.destroy();

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

const getPerson = async (req, res) => {
    const { person_id } = req.params;
    try {
        const person = await Person.findByPk(person_id, {
            include: [
                { model: Relationship, as: 'Relationships1' },
                { model: Relationship, as: 'Relationships2' },
                { model: Event },
                { model: Document },
                { model: DnaTest },
                { model: PersonAlias },
                { model: Family }
            ]
        });

        if (!person) return res.status(404).json({ message: `Person with id ${person_id} not found` });

        res.status(200).json({
            message: 'success',
            data: person
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'failed',
            error: err.message
        });
    }
};

const listPersons = async (req, res) => {
    let { pageSize, page, search, sort_by, order, gender, birth_date_from, birth_date_to } = req.query;
    pageSize = parseInt(pageSize || 10);
    page = parseInt(page || 1);

    let where = {};
    if (search) {
        where[Op.or] = [
            { first_name: { [Op.like]: `%${search}%` } },
            { last_name: { [Op.like]: `%${search}%` } }
        ];
    }
    if (gender) where.gender = gender;
    if (birth_date_from || birth_date_to) {
        where.birth_date = {};
        if (birth_date_from) where.birth_date[Op.gte] = birth_date_from;
        if (birth_date_to) where.birth_date[Op.lte] = birth_date_to;
    }

    try {
        const { count: total, rows: data } = await Person.findAndCountAll({
            where,
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

const addRelationship = async (req, res) => {
    const { person1_id, person2_id, relationship_type, start_date, end_date } = req.body;
    try {
        const person1 = await Person.findByPk(person1_id);
        const person2 = await Person.findByPk(person2_id);

        if (!person1 || !person2) {
            return res.status(404).json({ message: 'One or both persons not found' });
        }

        const relationship = await Relationship.create({
            person1_id,
            person2_id,
            relationship_type,
            start_date,
            end_date
        });

        res.status(201).json({
            message: 'success',
            data: relationship
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
    createPerson,
    updatePerson,
    deletePerson,
    getPerson,
    listPersons,
    addRelationship
};