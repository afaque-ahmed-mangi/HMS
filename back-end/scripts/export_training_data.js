import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { MongoMemoryServer } from "mongodb-memory-server";
import ChatLog, { maskPII } from "../src/models/ChatLog.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

async function exportTrainingData() {
  let mongoServer = null;
  let uri = process.env.MONGO_URI;

  try {
    if (!uri) {
      // Connect with short timeout to check if a local daemon is running, else start memory server
      try {
        await mongoose.connect("mongodb://127.0.0.1:27017/hostel_db", { serverSelectionTimeoutMS: 1500 });
        console.log(" Connected to local MongoDB daemon.");
      } catch {
        console.log(" Local mongod not detected, checking memory server data...");
        mongoServer = await MongoMemoryServer.create();
        uri = mongoServer.getUri();
        await mongoose.connect(uri);
        console.log(" Connected to MongoDB memory instance.");
      }
    } else {
      await mongoose.connect(uri);
      console.log(` Connected to MongoDB at ${uri}.`);
    }

    const logs = await ChatLog.find({}).sort({ created_at: 1 }).lean();
    console.log(` Found ${logs.length} chat log entries to export.`);

    if (logs.length === 0) {
      console.log("No chat logs recorded yet. Start chatting with the bot first!");
      await mongoose.disconnect();
      return;
    }

    const outputDir = path.join(__dirname, "../exports");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 1. Export to JSONL (standard conversational fine-tuning format)
    const jsonlPath = path.join(outputDir, "training_data.jsonl");
    const jsonlStream = fs.createWriteStream(jsonlPath, { flags: "w" });

    // Group logs by session_id to maintain conversational flow
    const sessions = {};
    for (const log of logs) {
      if (!sessions[log.session_id]) {
        sessions[log.session_id] = [];
      }
      sessions[log.session_id].push(log);
    }

    let conversationCount = 0;
    for (const [sessionId, sessionLogs] of Object.entries(sessions)) {
      const messages = [
        {
          role: "system",
          content: "You are the polite, factual hotel management assistant. Only answer from verified facts."
        }
      ];

      for (const entry of sessionLogs) {
        messages.push({ role: "user", content: maskPII(entry.user_message) });
        messages.push({ role: "assistant", content: maskPII(entry.ai_reply) });
      }

      jsonlStream.write(JSON.stringify({ session_id: sessionId, messages }) + "\n");
      conversationCount++;
    }
    jsonlStream.end();

    // 2. Export to CSV (tabular inspection format)
    const csvPath = path.join(outputDir, "training_data.csv");
    const escapeCsv = (str) => `"${String(str || "").replace(/"/g, '""')}"`;

    let csvContent = "session_id,user_message,ai_reply,provider,created_at\n";
    for (const log of logs) {
      csvContent += [
        escapeCsv(log.session_id),
        escapeCsv(maskPII(log.user_message)),
        escapeCsv(maskPII(log.ai_reply)),
        escapeCsv(log.provider),
        escapeCsv(log.created_at ? new Date(log.created_at).toISOString() : "")
      ].join(",") + "\n";
    }

    fs.writeFileSync(csvPath, csvContent, "utf-8");

    console.log(" Training data export complete!");
    console.log(`- JSONL output: ${jsonlPath} (${conversationCount} conversation sessions)`);
    console.log(`- CSV output:   ${csvPath} (${logs.length} single turns)`);
  } catch (err) {
    console.error(" Export failed:", err.message);
  } finally {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
    console.log(" Disconnected from MongoDB.");
  }
}

exportTrainingData();
