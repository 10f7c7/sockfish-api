module.exports = (Sequelize, DataTypes) => {
    const HallPassLog = Sequelize.define('hallpasslog', {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        originRoom: {
            type: DataTypes.STRING,
            allowNull: true
        },
        exitTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        returnTime: {
            type: DataTypes.DATE,
            allowNull: true
        },
    },
        {
            tableName: 'hallpasslog',
            timestamps: true,
            paranoid: true,
            deletedAt: "returnTime",
            updatedAt: false,
            createdAt: "exitTime"
        }
    );
    return HallPassLog;
}
