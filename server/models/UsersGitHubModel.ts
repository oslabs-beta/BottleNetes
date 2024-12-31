import {
  DataTypes,
  Model,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../db/db.js";

interface UsersGitHubModel
  extends Model<
    InferAttributes<UsersGitHubModel>,
    InferCreationAttributes<UsersGitHubModel>
  > {
  id: CreationOptional<string>;
  display_name: string;
  access_token: string;
  refresh_token: string;
  created_at: CreationOptional<Date>;
  updated_at: CreationOptional<Date>;
}

const UsersGitHub = sequelize.define<UsersGitHubModel>(
  "UsersGitHub",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    display_name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },

    access_token: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },

    refresh_token: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
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
    tableName: "users_github",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default UsersGitHub;
