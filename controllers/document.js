const { Document, Person } = require('../database/models');
const { Op } = require('sequelize');

const createDocument = async (req, res) => {
    const { person_id, document_type, file_path, upload_date, description } = req.body;
    try {
        const person = await Person.findByPk(person_id);
        if (!person) {
            return res.status(404).json({ message: 'Person not found' });
        }

        const document = await Document.create({
            person_id,
            document_type,
            file_path,
            upload_date,
            description
        });

        res.status(201).json({
            message: 'success',
            data: document
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'failed',
            error: err.message
        });
    }
};

const updateDocument = async (req, res) => {
    const { document_id } = req.params;
    const { document_type, file_path, upload_date, description } = req.body;
    try {
        const document = await Document.findByPk(document_id);
        if (!document) return res.status(404).json({ message: `Document with id ${document_id} not found` });

        document.document_type = document_type || document.document_type;
        document.file_path = file_path || document.file_path;
        document.upload_date = upload_date || document.upload_date;
        document.description = description || document.description;

        await document.save();

        res.status(200).json({
            message: 'updated',
            data: document
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'failed',
            error: err.message
        });
    }
};

const deleteDocument = async (req, res) => {
    const { document_id } = req.params;
    try {
        const document = await Document.findByPk(document_id);
        if (!document) return res.status(404).json({ message: `Document with id ${document_id} not found` });

        // TODO: Add logic to delete the actual file from storage

        await document.destroy();

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

const getDocument = async (req, res) => {
    const { document_id } = req.params;
    try {
        const document = await Document.findByPk(document_id, {
            include: [{ model: Person }]
        });

        if (!document) return res.status(404).json({ message: `Document with id ${document_id} not found` });

        res.status(200).json({
            message: 'success',
            data: document
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'failed',
            error: err.message
        });
    }
};

const listDocuments = async (req, res) => {
    let { pageSize, page, person_id, document_type, upload_date_from, upload_date_to, search } = req.query;
    pageSize = parseInt(pageSize || 10);
    page = parseInt(page || 1);

    let where = {};
    if (person_id) where.person_id = person_id;
    if (document_type) where.document_type = document_type;
    if (upload_date_from || upload_date_to) {
        where.upload_date = {};
        if (upload_date_from) where.upload_date[Op.gte] = upload_date_from;
        if (upload_date_to) where.upload_date[Op.lte] = upload_date_to;
    }
    if (search) {
        where[Op.or] = [
            { document_type: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ];
    }

    try {
        const { count: total, rows: data } = await Document.findAndCountAll({
            where,
            include: [{ model: Person }],
            order: [['upload_date', 'DESC']],
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
    createDocument,
    updateDocument,
    deleteDocument,
    getDocument,
    listDocuments
};