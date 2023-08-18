var express = require('express');
var app = express();

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Comments = sequelize.define('comments', {
  // Model attributes are defined here
  comment: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  // Other model options go here
});

(async() => {
  await Comments.sync();
  console.log("The table for the User model was just (re)created!");
})();



app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// set the view engine to ejs
app.set('view engine', 'ejs');


// READ db
app.get('/', async function(req, res) {
  const comments = await Comments.findAll();
  res.render('index', {comments: comments });
}); 

// CREATE
app.post('/create', async (req, res) => {
  console.log(req.body)
  const { comment } = req.body 
  await Comments.create({ comment: comment }); // CREATE db
  res.redirect('/')
})

// UPDATE
app.post('/update/:id', async (req, res) => {
  console.log(req.params)
  console.log(req.body)

  const { comment } = req.body 
  const { id } = req.params 

  await Comments.update({ comment: comment }, {
    where: {
      id: id
    }
  });

  res.redirect('/')
})

// DELETE
app.post('/delete/:id', async (req, res) => {
  console.log(req.params)
  console.log(req.body)

  const { id } = req.params 

  await Comments.destroy({
    where: {
      id: id
    }
  });

  res.redirect('/')
})

app.listen(3000);
console.log('Server is listening on port 3000');