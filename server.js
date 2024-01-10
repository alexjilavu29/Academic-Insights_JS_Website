// http://localhost:8080
// VoteRecord = MarkRecord
// category = courseName
// votes = score
// vote = point


import express from 'express'
import { Sequelize, DataTypes } from 'sequelize'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'my.db'
})

const MarkRecord = sequelize.define('MarkRecord', {
  courseName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  score: DataTypes.INTEGER
})

const AttendantsRecord = sequelize.define('AttendantsRecord', {
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: false
  }
})

await sequelize.sync({ alter: true })

const score = [{
  courseName: 'Statistică',
  score: 8
},{
  courseName: 'Economie',
  score: 9
},{
  courseName: 'Analiză',
  score: 6
}]

const records = [
  { count: 100 },
  { count: 150 },
  { count: 120 },
  { count: 140 },
  { count: 100 }
];


try {
  for (const point of score) {
    const record = new MarkRecord(point)
    await record.save()
  }  
} catch (error) {
  console.log('Materie deja înregistrată.')
}

const attendantsCount = await AttendantsRecord.count();
if (attendantsCount === 0) {
  for (const entry of records) {
    await AttendantsRecord.create(entry);
  }
}

const app = express()


app.use((req, res, next) => {
  console.log(req.url)
  next()
})

app.use(express.static('public'))
app.use(express.json())


app.get('/score', async (req, res) => {
  try {
    const score = await MarkRecord.findAll()
    res.status(200).json(score)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Eroare de Server.' })
  }

})

app.get('/AttendantsRecord/score', async (req, res) => {
  try {
    const records = await AttendantsRecord.findAll();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/score', async  (req, res) => {
  try {
    const point = new MarkRecord(req.body)
    await point.save()
    res.status(201).json({ message: 'created' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'server error' })
  }
})

// POST route for AttendantsRecord
app.post('/AttendantsRecord/score', async (req, res) => {
  try {
    const record = new AttendantsRecord(req.body);
    await record.save();
    res.status(201).json({ message: 'created' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error' });
  }
});



app.delete('/score/:id', async (req, res) => {
  try {
    const point = await MarkRecord.findByPk(req.params.id)
    if (point) {
      await point.destroy()
      res.status(204).json({ message: 'deleted' })
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'server error' })
  }
})

// DELETE route for AttendantsRecord
app.delete('/AttendantsRecord/score/:id', async (req, res) => {
  try {
    const record = await AttendantsRecord.findByPk(req.params.id)
    if (record) {
      await record.destroy()
      res.status(204).json({ message: 'deleted' })
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'server error' })
  }
});



app.put('/score/:id', async (req, res) => {
  try {
    const point = await MarkRecord.findByPk(req.params.id)
    if (point) {
      await point.update(req.body)
      res.status(202).json({ message: 'updated' })
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'server error' })
  }
})

// PUT route for AttendantsRecord
app.put('/AttendantsRecord/score/:id', async (req, res) => {
  try {
    const record = await AttendantsRecord.findByPk(req.params.id)
    if (record) {
      await record.update(req.body)
      res.status(202).json({ message: 'updated' })
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'server error' })
  }
});


app.listen(8080)
