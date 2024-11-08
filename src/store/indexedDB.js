import encryptionService from "@src/services/encryptionService";
import Dexie from "dexie";

class IndexedDB {
  constructor() {
    const db = new Dexie("samadb");
    db.version(1).stores({
      messages: "++_id, cid, created_at",
    });
    this.db = db;
  }

  markMessagesAsRead(mids) {
    this.db.messages.bulkUpdate(
      mids.map((id) => ({ key: id, changes: { status: "read" } }))
    );
  }

  async addMessage(message) {
    const encryptedBody = encryptionService.encrypteDataForLocalStore(
      message.body
    );
    this.db.messages.add({ ...message, body: encryptedBody });
  }

  async insertManyMessages(messages) {
    const encryptedMessages = await Promise.all(
      messages.map(async (message) => {
        const encryptedBody = await encryptionService.encrypteDataForLocalStore(
          message.body
        );
        return { ...message, body: encryptedBody };
      })
    );
    this.db.messages.bulkPut(encryptedMessages);
  }

  async getMessages(params) {
    const messages = await this.db.messages
      .where("cid")
      .equals(params.cid)
      .and(
        (el) =>
          !params.updated_at ||
          el.created_at > params.updated_at.gt ||
          el.created_at < params.updated_at.lt
      )
      .reverse()
      .limit(params.limit)
      .toArray();

    return await Promise.all(
      messages.map(async (message) => {
        const encryptedBody = await encryptionService.decryptDataFromLocalStore(
          message.body
        );
        return { ...message, body: encryptedBody };
      })
    );
  }

  async removeAllMessages() {
    await this.db.messages.clear();
  }
}

const indexedDB = new IndexedDB();

export default indexedDB;
