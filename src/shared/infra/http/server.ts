import app from './app';

app.listen(process.env.EXPRESS_PORT, async () => {
  console.log(`🚀 Server started on port ${process.env.EXPRESS_PORT}!`);
});
