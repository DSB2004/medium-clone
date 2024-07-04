import app from "./app";
import REDIS_CLIENT from "./redis";



const server = app.listen(80, async () => {
    await REDIS_CLIENT.connect();
    console.log("Running on 80")
})


process.on('SIGINT', async () => {
    console.log('SIGINT received: closing server...');
    if (REDIS_CLIENT.isReady)
        await REDIS_CLIENT.quit();
    server.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('SIGTERM received: closing server...');
    await REDIS_CLIENT.disconnect();
    server.close();
    process.exit(0);
});
