import express from 'express';
import multer from 'multer';
import cors, {CorsOptions} from "cors";
import {parseCSVMatrix, parseCSVNodeList} from "./utils/csv.util";

const app = express();

export const ADJ_FILE = 'adjacency_matrix';
export const NODE_FILE = 'node_list';

// Configure Multer middleware for file uploads
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: (arg0: null, arg1: string) => void) => {
    cb(null, 'uploads/');
  },
  filename: (req: any, file, cb: (error: Error | null, filename: string) => void) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });


const options: CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
    'Authorization'
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: '*'
};


app.use(cors(options));

// Define the endpoint for file uploads
app.post('/upload', upload.fields([
  { name: ADJ_FILE, maxCount: 1 },
  { name: NODE_FILE, maxCount: 1 }
]), async (req, res) => {
  // Check if files were uploaded successfully
  if (!req.files || !Object.hasOwn(req.files, ADJ_FILE) || !Object.hasOwn(req.files, NODE_FILE)) {
    return res.status(400).json({ error: 'Both files are required' });
  }

  const matrix = await parseCSVMatrix(req.files[ADJ_FILE][0].path);
  const nodes = await parseCSVNodeList(req.files[NODE_FILE][0].path);


  // Handle file processing logic here
  // For example, you can read the files using fs.readFileSync and process the data

  // Return success response
  return res.status(200).json({ message: 'Files uploaded successfully', matrix,nodes });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
