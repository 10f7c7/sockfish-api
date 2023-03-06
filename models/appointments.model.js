module.exports = (Sequelize, DataTypes) => {
    const Appointments = Sequelize.define('appointments', {
        counselorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        startTime: {
            type: DataTypes.TIME,
            allowNull: false
        },
        endTime: {
            type: DataTypes.TIME,
            allowNull: true
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
        {
            tableName: 'appointments',
            updatedAt: false,
            createdAt: false
        }
    );
    return Appointments;
}
