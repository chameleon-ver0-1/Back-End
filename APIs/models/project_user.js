module.exports = (sequelize, DataTypes) => {
    return sequelize.define('project_user', {
        projectName: {
            type: DataTypes.STRING(40),
            allowNull: false,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING(40),
            allowNull: false,
            primaryKey: true
        },
        projectRole: {
            type: DataTypes.STRING(40),
            allowNull: true
        },
        isAdminYn: {
            type: DataTypes.STRING(1),
            defaultValue: 'N'
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        timestamps: true,
        paranoid: true
    });
};