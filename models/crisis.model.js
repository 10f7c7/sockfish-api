module.exports = (Sequelize, DataTypes) => {
    const Crisis = Sequelize.define('crisis', {
        crisisId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        resolved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gps: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        needs: {
            type: DataTypes.STRING,
            allowNull: false
        },
        urgency: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },
        {
            tableName: 'crisis',
            updatedAt: false,
            createdAt: false
        }
    );
    return Crisis;
}