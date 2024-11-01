import express from 'express';
import * as fs from 'fs';
import bodyParser from 'body-parser';
import cors from 'cors';
const jsonParser = bodyParser.json();
const app = express();
app.use(jsonParser);
//cors
app.use(cors());
let images: string[] = [];
let texts: string[] = [];

const getLast = (numbers: number[]) => {
  //example: [1,2,3,4,5,7,8,9,10]
  // return 5
  if (numbers.length === 0) {
    return 0;
  }

  for (let i = 0; i <= numbers.length; i++) {
    try {
      if (numbers[i] !== i + 1) {
        return numbers[i-1];
      }
    } catch (e) {
      return numbers[numbers.length - 1];
    }
  }
  return numbers[numbers.length - 1];
}

const updateFiles = () => {
  const files = fs.readdirSync('./images');
  images = files.filter(f => f.endsWith('.png'));
  texts = files.filter(f => f.endsWith('.txt'));
}
updateFiles();
app.get('/last', (req, res) => {
  updateFiles()
  //file name of text is number.txt, get max number
  const numbers = texts.map(t => parseInt(t.split('.')[0]));
  const last = getLast(numbers);
  
  if (last === 0) {
    res.send({ id: 1, prompt: '' });
    return;
  }
  const prompt = fs.readFileSync(`./images/${last}.txt`, 'utf-8');
  res.send({ id: last+1, prompt });
}
)

app.post('/prompt', (req, res) => {

  const { id, prompt } = req.body;
  fs.writeFileSync(`./images/${id}.txt`, prompt);
  console.log(`Prompt ${prompt} saved for image ${id}.png`);
  res.send({ id, prompt });
  updateFiles();
})

app.get('/prompt/:id', (req, res) => {
  const { id } = req.params;
  let prompt: string = "";
  try{
    prompt = fs.readFileSync(`./images/${id}.txt`, 'utf-8');
  }catch(e){
    res.status(404).send({error: 'Not found'});
  }
  res.send({ id, prompt });
})

app.get('/image/:id', (req, res) => {
  const { id } = req.params;
  res.sendFile(`./images/${id}.png`, { root: __dirname });

})

app.get("/ready", (req, res) => {
  updateFiles();
  const imagesReady = texts.map(i => "/image/" + i.split('.')[0]);
  const prompts = texts.map(t => fs.readFileSync(`./images/${t}`, 'utf-8'));

  const response = imagesReady.map((i, index) => ({image: i, prompt: prompts[index] }));
  res.send(response);
})
app.get("/listos", (req, res) => {
  res.sendFile('listos.html', { root: __dirname });
})
app.get("/assets/:file", (req, res) => {
  const { file } = req.params;
  res.sendFile(`./assets/${file}`, { root: __dirname });
})

app.get("/", (req, res) => {
  res.sendFile('index.html', { root: __dirname });
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})
