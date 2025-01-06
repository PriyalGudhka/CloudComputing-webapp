import express from 'express';
import config from './config/config.js';
import routes from './routes/healthzRoutes.js';

export const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use('/', routes);

const port = config.port; //Defines the port number

app.listen(port,()=>{
    console.log(`Server running on port: ${port}`);
});

