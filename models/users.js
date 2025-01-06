import { Sequelize, DataTypes } from "sequelize";
import bcrypt from 'bcrypt';  

const User = (sequelize, DataTypes) =>{
    const User = sequelize.define("User", {
        id:{
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        first_name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        password:{
            type: DataTypes.STRING,
        },
        username:{
            type: DataTypes.STRING,
        },
account_created:{
    type: DataTypes.DATE,
},
account_updated:{
    type: DataTypes.DATE,
},
isUserVerified:{
    type: DataTypes.BOOLEAN,
},

    }, {
        timestamps: false
    });

    User.prototype.generateHash = function (password) {
        return bcrypt.hash(password, bcrypt.genSaltSync(10));
    };

    User.beforeCreate(async (user) => {
        if (user.changed('password')) {
            user.password = await user.generateHash(user.password);
        }
    });

return User;
 }

export default User;
