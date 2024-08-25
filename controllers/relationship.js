const { Relationship, Person } = require('../database/models');
const { Op } = require('sequelize');

const createRelationship = async (req, res) => {
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

const updateRelationship = async (req, res) => {
    const { relationship_id } = req.params;
    const { relationship_type, start_date, end_date } = req.body;
    try {
        const relationship = await Relationship.findByPk(relationship_id);
        if (!relationship) return res.status(404).json({ message: `Relationship with id ${relationship_id} not found` });

        relationship.relationship_type = relationship_type || relationship.relationship_type;
        relationship.start_date = start_date || relationship.start_date;
        relationship.end_date = end_date || relationship.end_date;

        await relationship.save();

        res.status(200).json({
            message: 'updated',
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

const deleteRelationship = async (req, res) => {
    const { relationship_id } = req.params;
    try {
        const relationship = await Relationship.findByPk(relationship_id);
        if (!relationship) return res.status(404).json({ message: `Relationship with id ${relationship_id} not found` });

        await relationship.destroy();

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

const getRelationship = async (req, res) => {
    const { relationship_id } = req.params;
    try {
        const relationship = await Relationship.findByPk(relationship_id, {
            include: [
                { model: Person, as: 'Person1' },
                { model: Person, as: 'Person2' }
            ]
        });

        if (!relationship) return res.status(404).json({ message: `Relationship with id ${relationship_id} not found` });

        res.status(200).json({
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

const listRelationships = async (req, res) => {
    let { pageSize, page, person_id, relationship_type, start_date_from, start_date_to, end_date_from, end_date_to } = req.query;
    pageSize = parseInt(pageSize || 10);
    page = parseInt(page || 1);

    let where = {};
    if (person_id) {
        where[Op.or] = [{ person1_id: person_id }, { person2_id: person_id }];
    }
    if (relationship_type) where.relationship_type = relationship_type;
    if (start_date_from || start_date_to) {
        where.start_date = {};
        if (start_date_from) where.start_date[Op.gte] = start_date_from;
        if (start_date_to) where.start_date[Op.lte] = start_date_to;
    }
    if (end_date_from || end_date_to) {
        where.end_date = {};
        if (end_date_from) where.end_date[Op.gte] = end_date_from;
        if (end_date_to) where.end_date[Op.lte] = end_date_to;
    }

    try {
        const { count: total, rows: data } = await Relationship.findAndCountAll({
            where,
            include: [
                { model: Person, as: 'Person1' },
                { model: Person, as: 'Person2' }
            ],
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
    createRelationship,
    updateRelationship,
    deleteRelationship,
    getRelationship,
    listRelationships
};