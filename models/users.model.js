module.exports = (Sequelize, DataTypes) => {
    const User = Sequelize.define('users', {
        id: {
            type: DataTypes.STRING,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        attributes: {
            type: DataTypes.JSON,
        }
    },
        {
            tableName: 'users',
            updatedAt: false,
            createdAt: false
        }
    );
    return User;
}
