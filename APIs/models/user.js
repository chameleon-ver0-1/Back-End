module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        email: {
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        name_en: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        profile_img: {
            type: DataTypes.STRING(100),
            defaultValue: 'FIXME/default/img/path'
        },
        company: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        dept: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        certificatedYn: {
            type: DataTypes.STRING(1),
            defaultValue: 'N'
        }
    }, {
        timestamps: true,
        paranoid: true
    });
}