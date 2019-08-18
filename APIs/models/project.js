module.exports = (sequelize, DataTypes) => {
    return sequelize.define('project', {
        project_name: {
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        issue_ref: {
            type: DataTypes.STRING(40)
        },
        conf_ref: {
            type: DataTypes.STRING(40)
        },
        note_ref: {
            type: DataTypes.STRING(40)
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        timestamps: true,
        paranoid: true
    });
}