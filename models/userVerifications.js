import { Sequelize, DataTypes } from "sequelize";

const UserVerification = (sequelize, DataTypes) =>{
    const UserVerification = sequelize.define("UserVerification", {

        username: {
            type: DataTypes.STRING,
        },
        token: {
            type: DataTypes.UUID,
            unique: true
        },
        token_expiry: {
            type: DataTypes.DATE,
        },
        user_status: {
            type: DataTypes.STRING,
        },

    }, {
        timestamps: false
    });

    return UserVerification;
}
export default UserVerification;
