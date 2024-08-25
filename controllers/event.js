const { Event, Person } = require('../database/models');
const { Op } = require('sequelize');

const createEvent = async (req, res) => {
    const { person_id, event_type, event_date, event_place, description } = req.body;
    try {
        const person = await Person.findByPk(person_id);
        if (!person) {
            return res.status(404).json({ message: 'Person not found' });
        }

        const event = await Event.create({
            person_id,
            event_type,
            event_date,
            event_place,
            description
        });

        res.status(201).json({
            message: 'success',
            data: event
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'failed',
            error: err.message
        });
    }
};

const updateEvent = async (req, res) => {
    const { event_id } = req.params;
    const { event_type, event_date, event_place, description } = req.body;
    try {
        const event = await Event.findByPk(event_id);
        if (!event) return res.status(404).json({ message: `Event with id ${event_id} not found` });

        event.event_type = event_type || event.event_type;
        event.event_date = event_date || event.event_date;
        event.event_place = event_place || event.event_place;
        event.description = description || event.description;

        await event.save();

        res.status(200).json({
            message: 'updated',
            data: event
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'failed',
            error: err.message
        });
    }
};

const deleteEvent = async (req, res) => {
    const { event_id } = req.params;
    try {
        const event = await Event.findByPk(event_id);
        if (!event) return res.status(404).json({ message: `Event with id ${event_id} not found` });

        await event.destroy();

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

const getEvent = async (req, res) => {
    const { event_id } = req.params;
    try {
        const event = await Event.findByPk(event_id, {
            include: [{ model: Person }]
        });

        if (!event) return res.status(404).json({ message: `Event with id ${event_id} not found` });

        res.status(200).json({
            message: 'success',
            data: event
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'failed',
            error: err.message
        });
    }
};

const listEvents = async (req, res) => {
    let { pageSize, page, person_id, event_type, date_from, date_to, search } = req.query;
    pageSize = parseInt(pageSize || 10);
    page = parseInt(page || 1);

    let where = {};
    if (person_id) where.person_id = person_id;
    if (event_type) where.event_type = event_type;
    if (date_from || date_to) {
        where.event_date = {};
        if (date_from) where.event_date[Op.gte] = date_from;
        if (date_to) where.event_date[Op.lte] = date_to;
    }
    if (search) {
        where[Op.or] = [
            { event_type: { [Op.like]: `%${search}%` } },
            { event_place: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ];
    }

    try {
        const { count: total, rows: data } = await Event.findAndCountAll({
            where,
            include: [{ model: Person }],
            order: [['event_date', 'DESC']],
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
    createEvent,
    updateEvent,
    deleteEvent,
    getEvent,
    listEvents
};