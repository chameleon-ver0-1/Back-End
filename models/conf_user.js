module.exports = (sequelize, DataTypes) => {
    return sequelize.define('conf_user', {
        confTitle: {
            type: DataTypes.STRING(40),
            allowNull: false,
            primaryKey: true
        },
        projectId: {
            type: DataTypes.STRING(40),
            allowNull: false,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING(40),
            allowNull: false,
            primaryKey: true
        },
        isAdminYn: {
            type: DataTypes.STRING(1),
            defaultValue: 'N'
        },
        isConfYn: {
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