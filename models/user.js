"use strict";

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        name: {
            type: DataTypes.STRING,
            trim: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            trim: true,
            validate: {
                notEmpty: true
            }
        },
        money: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        role: {
            type: DataTypes.ENUM("admin", "user"),
            allowNull: false,
            defaultValue: "user"
        }
    });

    /**
     * Find User by id
     * @param {number} id 
     */
    User.findById = async (id) => {
        const user = await User.findOne({
            where: {
                id
            }
        });

        return user;
    };

    return User;
};