/**
 * Use Sequelize to define the model of users table in DB
 */

import {
  DataTypes,
  Model,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import bcrypt from "bcrypt";

// Import in tables to establish relationship
import UsersGitHub from "./UsersGitHubModel.js";
import UsersGoogle from "./UsersGoogleModel.js";

import sequelize from "../db/db.js";

interface UsersModel
  extends Model<
    InferAttributes<UsersModel>,
    InferCreationAttributes<UsersModel>
  > {
  id: CreationOptional<string>;
  username: string;
  password_hash: string;
  email: string;
  first_name: string;
  last_name: string;
  github_id: CreationOptional<string>;
  google_id: CreationOptional<string>;
  created_at: CreationOptional<Date>;
  updated_at: CreationOptional<Date>;
}

// Define a model Users using Sequelizq
const Users = sequelize.define<UsersModel>(
  "Users",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },

    password_hash: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },

    first_name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    last_name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    // Foreign Key
    github_id: {
      type: DataTypes.UUID,
    },

    // Foreign Key
    google_id: {
      type: DataTypes.UUID,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

Users.belongsTo(UsersGitHub, { foreignKey: "github_id" });
Users.belongsTo(UsersGoogle, { foreignKey: "google_id" });

UsersGitHub.hasOne(Users, { foreignKey: "github_id" });
UsersGoogle.hasOne(Users, { foreignKey: "google_id" });

// Hash the password before creating and updating
Users.addHook("beforeSave", async (users: UsersModel) => {
  console.log("😗 Currently Hashing Password...");
  try {
    const oldPW = users.password_hash;
    const SALT_ROUND = await bcrypt.genSalt(10);
    users.password_hash = await bcrypt.hash(oldPW, SALT_ROUND);
    console.log("✅ Hashed Password!");
  } catch (error) {
    console.error(`😳 Unable to hash password: ${error}`);
  }
});

export default Users;
