import amqp, { Channel } from "amqplib";

import env from "../constants/env";
import Logger from "../libs/Logger";

let channel: Channel;

async function connect() {
    try {
        Logger.warn("Connecting to RabbitMQ...");
        const amqpServer = env.RABBITMQ_URL;
        const connection = await amqp.connect(amqpServer);
        Logger.info("Connected to RabbitMQ");

        Logger.info("Creating channel ...");
        channel = await connection.createChannel();

        Logger.info("Asserting queue users ...");
        await channel.assertQueue("USERS");
        await channel.assertQueue("USERS_2");

        channel.consume("USERS", (data) => {
            console.log("Consuming USERS_2 service");
            const consumedData = JSON.parse(data?.content.toString() || "null");
            console.log(consumedData);
            channel.ack(data!);

            // await set timeout for 2 seconds
            setTimeout(() => {
                channel.sendToQueue(
                    "USERS_2",
                    Buffer.from(
                        JSON.stringify({
                            ...consumedData,
                            message2: "Hello from USERS 2" + Date.now(),
                        })
                    )
                );
            }, 1000);
        });
    } catch (error: any) {
        Logger.error(error);
    }
}

connect();
Logger.info("Channel created");

const getChannel = () => channel;

export default getChannel;
