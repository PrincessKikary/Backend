const { Person, Relationship, Family, Event, Document, DnaTest, PersonAlias } = require('../database/models');
const { Op } = require('sequelize');

const getPersonWithRelations = async (req, res) => {
    const { person_id } = req.params;
    try {
        const person = await Person.findByPk(person_id, {
            include: [
                { 
                    model: Relationship,
                    as: 'Relationships1',
                    include: [{ model: Person, as: 'Person2' }]
                },
                { 
                    model: Relationship,
                    as: 'Relationships2',
                    include: [{ model: Person, as: 'Person1' }]
                },
                { model: Family },
                { model: Event },
                { model: Document },
                { model: DnaTest },
                { model: PersonAlias }
            ]
        });

        if (!person) {
            return res.status(404).json({ message: 'Person not found' });
        }

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

const getFamilyTree = async (req, res) => {
    const { family_id } = req.params;
    const { depth = 3 } = req.query;  // Default depth of 3 generations

    try {
        const family = await Family.findByPk(family_id, {
            include: [{ model: Person }]
        });

        if (!family) {
            return res.status(404).json({ message: 'Family not found' });
        }

        const familyTree = await buildFamilyTree(family.Persons, parseInt(depth));

        res.status(200).json({
            message: 'success',
            data: familyTree
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'failed',
            error: err.message
        });
    }
};

const getAncestors = async (req, res) => {
    const { person_id } = req.params;
    const { generations = 3 } = req.query;

    try {
        const ancestors = await findAncestors(person_id, parseInt(generations));

        res.status(200).json({
            message: 'success',
            data: ancestors
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'failed',
            error: err.message
        });
    }
};

const getDescendants = async (req, res) => {
    const { person_id } = req.params;
    const { generations = 3 } = req.query;

    try {
        const descendants = await findDescendants(person_id, parseInt(generations));

        res.status(200).json({
            message: 'success',
            data: descendants
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'failed',
            error: err.message
        });
    }
};

// Helper function to build family tree
async function buildFamilyTree(persons, depth) {
    if (depth === 0 || !persons.length) return [];

    const tree = [];
    for (const person of persons) {
        const node = {
            id: person.person_id,
            name: `${person.first_name} ${person.last_name}`,
            birth_date: person.birth_date,
            death_date: person.death_date,
            children: []
        };

        const children = await Person.findAll({
            include: [{
                model: Relationship,
                as: 'Relationships2',
                where: { 
                    person1_id: person.person_id,
                    relationship_type: 'parent-child'
                }
            }]
        });

        node.children = await buildFamilyTree(children, depth - 1);
        tree.push(node);
    }

    return tree;
}

// Helper function to find ancestors
async function findAncestors(personId, generations) {
    if (generations === 0) return null;

    const person = await Person.findByPk(personId, {
        include: [{
            model: Relationship,
            as: 'Relationships2',
            where: { relationship_type: 'parent-child' },
            include: [{ model: Person, as: 'Person1' }]
        }]
    });

    if (!person) return null;

    const ancestors = {
        id: person.person_id,
        name: `${person.first_name} ${person.last_name}`,
        birth_date: person.birth_date,
        death_date: person.death_date,
        parents: []
    };

    for (const rel of person.Relationships2) {
        const parent = await findAncestors(rel.Person1.person_id, generations - 1);
        if (parent) ancestors.parents.push(parent);
    }

    return ancestors;
}

// Helper function to find descendants
async function findDescendants(personId, generations) {
    if (generations === 0) return null;

    const person = await Person.findByPk(personId, {
        include: [{
            model: Relationship,
            as: 'Relationships1',
            where: { relationship_type: 'parent-child' },
            include: [{ model: Person, as: 'Person2' }]
        }]
    });

    if (!person) return null;

    const descendants = {
        id: person.person_id,
        name: `${person.first_name} ${person.last_name}`,
        birth_date: person.birth_date,
        death_date: person.death_date,
        children: []
    };

    for (const rel of person.Relationships1) {
        const child = await findDescendants(rel.Person2.person_id, generations - 1);
        if (child) descendants.children.push(child);
    }

    return descendants;
}

module.exports = {
    getPersonWithRelations,
    getFamilyTree,
    getAncestors,
    getDescendants
};