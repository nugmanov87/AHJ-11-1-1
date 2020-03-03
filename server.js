const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const uuid = require('uuid');
const faker = require('faker');
const app = new Koa();
// CORS
app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*', };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }

    ctx.response.status = 204;
  }
});

app.use(koaBody({
  text: true,
  urlencoded: true,
  multipart: true,
  json: true,
}));

const router = new Router();
const server = http.createServer(app.callback())

router.get('/messages/unread', async (ctx, next) => {
  let randomId;
  let randomEmail;
  let randomUserName;
  let randomBody;
  let randomReceived;

  const obgMessages = {
    status: 'ok',
    timestamp: new Date().getTime(),
    messages: [],
  };
  
  const randomNewMessage = Math.floor(Math.random() * 4);

  for (let i = 0; i < randomNewMessage; i += 1) {
    randomId = uuid.v4();
    randomEmail = faker.internet.email();
    randomUserName = faker.internet.userName();
    randomBody = faker.lorem.paragraph();
    randomReceived = faker.date.recent();
    
    obgMessages.messages.push(
      {
        id: randomId,
        from: randomEmail,
        subject: `Hello from ${randomUserName}`,
        body: randomBody,
        received: randomReceived,
      }
    );
  }
  
  console.log('get index');
  ctx.response.body = obgMessages;
});

app.use(router.routes()).use(router.allowedMethods());
const port = process.env.PORT || 7070;
server.listen(port);
