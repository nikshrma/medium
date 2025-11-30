import { Hono } from 'hono'
import { user } from './routes/user.routes';
import { blog } from './routes/blog.routes';

const app = new Hono().basePath('/api/v1')

app.route("/user" , user);
app.route("/blog" , blog);

export default app
