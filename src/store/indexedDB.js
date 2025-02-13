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

  updateMessagesStatus(mids, status) {
    this.db.messages.bulkUpdate(
      mids.map((id) => ({ key: id, changes: { status } }))
    );
  }

  async addMessage(message) {
    const isMessageEncrypted = message.encrypted_message_type !== undefined;
    const modifiedBody = isMessageEncrypted
      ? await encryptionService.encrypteDataForLocalStore(message.body)
      : message.body;
    this.db.messages.add({ ...message, body: modifiedBody });
  }

  async insertManyMessages(messages) {
    const encryptedMessages = await Promise.all(
      messages.map(async (message) => {
        const isMessageEncrypted = message.encrypted_message_type !== undefined;
        const modifiedBody = isMessageEncrypted
          ? await encryptionService.encrypteDataForLocalStore(message.body)
          : message.body;
        return { ...message, body: modifiedBody };
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
        const isMessageEncrypted = message.encrypted_message_type !== undefined;
        const modifiedBody = isMessageEncrypted
          ? await encryptionService.decryptDataFromLocalStore(message.body)
          : message.body;
        return { ...message, body: modifiedBody };
      })
    );
  }

  async upsertEncryptionMessage(mid, body) {
    await this.db.messages.update(mid, {
      body: await encryptionService.encrypteDataForLocalStore(body),
    });
  }

  async removeAllMessages() {
    await this.db.messages.clear();
  }

  async removeMessage(mid) {
    await this.db.messages.delete(mid);
  }
}

const indexedDB = new IndexedDB();

export default indexedDB;
