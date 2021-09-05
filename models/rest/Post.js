const post = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "post",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        unique: true,
      },
      content: {
        type: DataTypes.STRING(3000),
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  )
  //   Post.sync()
  return Post
}

export default post
