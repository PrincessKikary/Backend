const { Person, Relationship, Family, Event, Document, DnaTest, PersonAlias } = require('../database/models');
const { Op, Sequelize } = require('sequelize');
const moment = require('moment');

const getDashboardSummary = async (req, res) => {
    try {
        const [
            totalPersons,
            totalFamilies,
            totalRelationships,
            totalEvents,
            totalDocuments,
            totalDnaTests,
            genderDistribution,
            ageDistribution,
            topFamilies,
            recentActivity
        ] = await Promise.all([
            Person.count(),
            Family.count(),
            Relationship.count(),
            Event.count(),
            Document.count(),
            DnaTest.count(),
            getGenderDistribution(),
            getAgeDistribution(),
            getTopFamilies(),
            getRecentActivity()
        ]);

        res.status(200).json({
            message: 'success',
            data: {
                totalPersons,
                totalFamilies,
                totalRelationships,
                totalEvents,
                totalDocuments,
                totalDnaTests,
                genderDistribution,
                ageDistribution,
                topFamilies,
                recentActivity
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

const getPersonGrowthRate = async (req, res) => {
    const { startDate, endDate, interval = 'month' } = req.query;
    try {
        const growthData = await getGrowthRate(Person, startDate, endDate, interval);
        res.status(200).json({
            message: 'success',
            data: growthData
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'failed',
            error: err.message
        });
    }
};

const getEventDistribution = async (req, res) => {
    try {
        const eventDistribution = await Event.findAll({
            attributes: ['event_type', [Sequelize.fn('COUNT', Sequelize.col('event_type')), 'count']],
            group: ['event_type'],
            order: [[Sequelize.fn('COUNT', Sequelize.col('event_type')), 'DESC']]
        });

        res.status(200).json({
            message: 'success',
            data: eventDistribution
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'failed',
            error: err.message
        });
    }
};

const getFamilyStatistics = async (req, res) => {
    const { family_id } = req.params;
    try {
        const family = await Family.findByPk(family_id, {
            include: [{ model: Person }]
        });

        if (!family) {
            return res.status(404).json({ message: 'Family not found' });
        }

        const memberCount = family.Persons.length;
        const oldestMember = family.Persons.reduce((oldest, current) => 
            (oldest.birth_date < current.birth_date) ? oldest : current
        );
        const youngestMember = family.Persons.reduce((youngest, current) => 
            (youngest.birth_date > current.birth_date) ? youngest : current
        );

        const genderDistribution = await getGenderDistribution(family.Persons.map(p => p.person_id));
        const ageDistribution = await getAgeDistribution(family.Persons.map(p => p.person_id));

        res.status(200).json({
            message: 'success',
            data: {
                family_name: family.family_name,
                memberCount,
                oldestMember: `${oldestMember.first_name} ${oldestMember.last_name}`,
                youngestMember: `${youngestMember.first_name} ${youngestMember.last_name}`,
                genderDistribution,
                ageDistribution
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

// Helper functions

async function getGenderDistribution(personIds = null) {
    const whereClause = personIds ? { person_id: personIds } : {};
    return Person.findAll({
        attributes: ['gender', [Sequelize.fn('COUNT', Sequelize.col('gender')), 'count']],
        where: whereClause,
        group: ['gender']
    });
}

async function getAgeDistribution(personIds = null) {
    const whereClause = personIds ? { person_id: personIds } : {};
    const persons = await Person.findAll({
        attributes: ['birth_date'],
        where: whereClause
    });

    const ageGroups = {
        '0-18': 0,
        '19-30': 0,
        '31-50': 0,
        '51-70': 0,
        '71+': 0
    };

    persons.forEach(person => {
        if (person.birth_date) {
            const age = moment().diff(person.birth_date, 'years');
            if (age <= 18) ageGroups['0-18']++;
            else if (age <= 30) ageGroups['19-30']++;
            else if (age <= 50) ageGroups['31-50']++;
            else if (age <= 70) ageGroups['51-70']++;
            else ageGroups['71+']++;
        }
    });

    return ageGroups;
}

async function getTopFamilies(limit = 5) {
    return Family.findAll({
        attributes: [
            'family_id',
            'family_name',
            [Sequelize.fn('COUNT', Sequelize.col('Persons.person_id')), 'memberCount']
        ],
        include: [{
            model: Person,
            attributes: []
        }],
        group: ['Family.family_id'],
        order: [[Sequelize.fn('COUNT', Sequelize.col('Persons.person_id')), 'DESC']],
        limit
    });
}

async function getRecentActivity(limit = 10) {
    const recentPersons = await Person.findAll({
        order: [['createdAt', 'DESC']],
        limit
    });

    const recentEvents = await Event.findAll({
        order: [['createdAt', 'DESC']],
        limit
    });

    return [...recentPersons, ...recentEvents]
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, limit);
}

async function getGrowthRate(model, startDate, endDate, interval) {
    const intervals = generateIntervals(startDate, endDate, interval);
    const growthData = await Promise.all(intervals.map(async ([start, end]) => {
        const count = await model.count({
            where: {
                createdAt: {
                    [Op.between]: [start, end]
                }
            }
        });
        return { date: start, count };
    }));
    return growthData;
}

function generateIntervals(startDate, endDate, interval) {
    const start = moment(startDate);
    const end = moment(endDate);
    const intervals = [];

    while (start.isBefore(end)) {
        const intervalEnd = moment(start).add(1, interval);
        intervals.push([start.toDate(), intervalEnd.toDate()]);
        start.add(1, interval);
    }

    return intervals;
}

module.exports = {
    getDashboardSummary,
    getPersonGrowthRate,
    getEventDistribution,
    getFamilyStatistics
};