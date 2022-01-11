let instance = null;

export class PubSubManager {
    constructor() {
        if (!instance) {
            instance = this;
        }
        this.subscribers = new Map();
    }
    subscribe(subscriber, id) {
        console.log(`subscribing to ${id}`);
        this.subscribers.set(id, subscriber);
    }

    publish(id, message) {
        this.subscribers.get(id).send(message)
    }

    getWsClient(id) {
        return this.subscribers.get(id);
    }

    getWsClients() {
        return this.subscribers;
    }

}
