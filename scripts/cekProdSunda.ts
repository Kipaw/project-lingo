import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

// Placeholder aset. Nanti tinggal ganti path-nya per kata di bawah.
const PLACEHOLDER_IMG = "/placeholder.svg";
const PLACEHOLDER_AUDIO = "/placeholder.mp3";

const WORDS = {
  lalaki: {
    text: "lalaki",
    imageSrc: PLACEHOLDER_IMG,
    audioSrc: PLACEHOLDER_AUDIO,
  },
  awewe: {
    text: "awéwé",
    imageSrc: PLACEHOLDER_IMG,
    audioSrc: PLACEHOLDER_AUDIO,
  },
  budakLalaki: {
    text: "budak lalaki",
    imageSrc: PLACEHOLDER_IMG,
    audioSrc: PLACEHOLDER_AUDIO,
  },
  budakAwewe: {
    text: "budak awéwé",
    imageSrc: PLACEHOLDER_IMG,
    audioSrc: PLACEHOLDER_AUDIO,
  },
  indung: {
    text: "indung",
    imageSrc: PLACEHOLDER_IMG,
    audioSrc: PLACEHOLDER_AUDIO,
  },
  bapa: {
    text: "bapa",
    imageSrc: PLACEHOLDER_IMG,
    audioSrc: PLACEHOLDER_AUDIO,
  },
} as const;

type Word = (typeof WORDS)[keyof typeof WORDS];

type ChallengeSeed = {
  type: "SELECT" | "ASSIST";
  question: string;
  correct: Word;
  wrong: [Word, Word];
};

// 1 lesson: Kata Benda (Nouns) -> 8 soal, strukturnya sama seperti seed Spanish
const CHALLENGES: ChallengeSeed[] = [
  {
    type: "SELECT",
    question: 'Mana yang artinya "laki-laki"?',
    correct: WORDS.lalaki,
    wrong: [WORDS.awewe, WORDS.budakLalaki],
  },
  {
    type: "SELECT",
    question: 'Mana yang artinya "perempuan"?',
    correct: WORDS.awewe,
    wrong: [WORDS.budakLalaki, WORDS.lalaki],
  },
  {
    type: "SELECT",
    question: 'Mana yang artinya "anak laki-laki"?',
    correct: WORDS.budakLalaki,
    wrong: [WORDS.awewe, WORDS.lalaki],
  },
  {
    type: "ASSIST",
    question: '"laki-laki"',
    correct: WORDS.lalaki,
    wrong: [WORDS.awewe, WORDS.budakLalaki],
  },
  {
    type: "SELECT",
    question: 'Mana yang artinya "ibu"?',
    correct: WORDS.indung,
    wrong: [WORDS.lalaki, WORDS.awewe],
  },
  {
    type: "SELECT",
    question: 'Mana yang artinya "ayah"?',
    correct: WORDS.bapa,
    wrong: [WORDS.indung, WORDS.budakLalaki],
  },
  {
    type: "SELECT",
    question: 'Mana yang artinya "anak perempuan"?',
    correct: WORDS.budakAwewe,
    wrong: [WORDS.indung, WORDS.lalaki],
  },
  {
    type: "ASSIST",
    question: '"ibu"',
    correct: WORDS.indung,
    wrong: [WORDS.awewe, WORDS.budakLalaki],
  },
];

const main = async () => {
  try {
    console.log("Seeding database");

    // Delete all existing data
    await Promise.all([
      db.delete(schema.userProgress),
      db.delete(schema.challenges),
      db.delete(schema.units),
      db.delete(schema.lessons),
      db.delete(schema.courses),
      db.delete(schema.challengeOptions),
      db.delete(schema.userSubscription),
    ]);

    // Insert course
    const courses = await db
      .insert(schema.courses)
      .values([{ title: "Sunda", imageSrc: PLACEHOLDER_IMG }])
      .returning();

    for (const course of courses) {
      // 1 unit saja dulu
      const units = await db
        .insert(schema.units)
        .values([
          {
            courseId: course.id,
            title: "Unit 1",
            description: `Belajar dasar bahasa ${course.title}`,
            order: 1,
          },
        ])
        .returning();

      for (const unit of units) {
        // 1 lesson saja dulu
        const lessons = await db
          .insert(schema.lessons)
          .values([{ unitId: unit.id, title: "Kata Benda", order: 1 }])
          .returning();

        for (const lesson of lessons) {
          const challenges = await db
            .insert(schema.challenges)
            .values(
              CHALLENGES.map((c, i) => ({
                lessonId: lesson.id,
                type: c.type,
                question: c.question,
                order: i + 1,
              })),
            )
            .returning();

          for (const challenge of challenges) {
            const data = CHALLENGES[challenge.order - 1];
            const isAssist = data.type === "ASSIST";

            // Urutan opsi: jawaban benar ditaruh di posisi berbeda-beda
            const pos = (challenge.order - 1) % 3;
            const options = [...data.wrong];
            options.splice(pos, 0, data.correct);

            await db.insert(schema.challengeOptions).values(
              options.map((opt) => ({
                challengeId: challenge.id,
                correct: opt === data.correct,
                text: opt.text,
                // ASSIST tidak pakai gambar (sama seperti seed Spanish)
                ...(isAssist ? {} : { imageSrc: opt.imageSrc }),
                audioSrc: opt.audioSrc,
              })),
            );
          }
        }
      }
    }

    console.log("Database seeded successfully");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};

main();
