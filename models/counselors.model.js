module.exports = (Sequelize, DataTypes) => {
    const Counselor = Sequelize.define('counselors', {
        counselorId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            readOnly: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            readOnly: true
        },
        available: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        walkInAvailable: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
        {
            tableName: 'counselors',
            updatedAt: false,
            createdAt: false
        }
    );
    return Counselor;
}
