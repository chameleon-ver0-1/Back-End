module.exports = (sequelize, DataTypes) => {
    return sequelize.define('project', {
        projectName: {
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        projectCode: {
            type: DataTypes.STRING(40),
            allowNull: false,
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        timestamps: true,
        paranoid: true
    });
}