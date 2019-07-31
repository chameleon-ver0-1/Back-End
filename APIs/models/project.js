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
        timestamps: true,
        paranoid: true
    });
}