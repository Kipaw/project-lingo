import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

type Word = { text: string; meaning: string; img: string; audio: string };

const WORDS = {
  lalaki: {
    text: "lalaki",
    meaning: "laki-laki",
    img: "/lalaki.svg",
    audio: "/sun_lalaki.mp3",
  },
  awewe: {
    text: "awéwé",
    meaning: "perempuan",
    img: "/awewe.svg",
    audio: "/sun_awewe.mp3",
  },
  barudak: {
    text: "barudak",
    meaning: "anak-anak",
    img: "/barudak.svg",
    audio: "/sun_barudak.mp3",
  },
  indung: {
    text: "indung",
    meaning: "ibu",
    img: "/indung.svg",
    audio: "/sun_indung.mp3",
  },
  bapa: {
    text: "bapa",
    meaning: "ayah",
    img: "/bapa.svg",
    audio: "/sun_bapa.mp3",
  },
} satisfies Record<string, Word>;

type W = keyof typeof WORDS;

// Satu soal = tipe, kata yang benar, dan dua kata pengecoh.
type Q = { type: "SELECT" | "ASSIST"; answer: W; others: [W, W] };

const lessons: { title: string; questions: Q[] }[] = [
  {
    title: "Kata Benda",
    questions: [
      { type: "SELECT", answer: "lalaki", others: ["awewe", "barudak"] },
      { type: "SELECT", answer: "awewe", others: ["barudak", "lalaki"] },
      { type: "SELECT", answer: "barudak", others: ["awewe", "lalaki"] },
      { type: "ASSIST", answer: "lalaki", others: ["awewe", "barudak"] },
      { type: "ASSIST", answer: "awewe", others: ["barudak", "lalaki"] },
      { type: "ASSIST", answer: "barudak", others: ["lalaki", "awewe"] },
    ],
  },
  {
    title: "Keluarga",
    questions: [
      { type: "SELECT", answer: "indung", others: ["lalaki", "awewe"] },
      { type: "SELECT", answer: "bapa", others: ["indung", "barudak"] },
      { type: "SELECT", answer: "barudak", others: ["bapa", "indung"] },
      { type: "ASSIST", answer: "indung", others: ["awewe", "barudak"] },
      { type: "ASSIST", answer: "bapa", others: ["lalaki", "indung"] },
      { type: "ASSIST", answer: "barudak", others: ["bapa", "awewe"] },
    ],
  },
  {
    title: "Campuran",
    questions: [
      { type: "SELECT", answer: "bapa", others: ["lalaki", "awewe"] },
      { type: "SELECT", answer: "awewe", others: ["indung", "bapa"] },
      { type: "SELECT", answer: "lalaki", others: ["bapa", "barudak"] },
      { type: "ASSIST", answer: "indung", others: ["awewe", "bapa"] },
      { type: "ASSIST", answer: "lalaki", others: ["bapa", "barudak"] },
      { type: "SELECT", answer: "indung", others: ["barudak", "lalaki"] },
    ],
  },
];

const main = async () => {
  try {
    console.log("Seeding database");

    await db.delete(schema.challengeProgress);
    await db.delete(schema.userProgress);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challenges);
    await db.delete(schema.lessons);
    await db.delete(schema.units);
    await db.delete(schema.userSubscription);
    await db.delete(schema.courses);

    const [course] = await db
      .insert(schema.courses)
      .values({ title: "Sunda", imageSrc: "/sun.svg" })
      .returning();

    const [unit] = await db
      .insert(schema.units)
      .values({
        courseId: course.id,
        title: "Unit 1",
        description: `Belajar dasar bahasa ${course.title}`,
        order: 1,
      })
      .returning();

    for (const [lessonIndex, lessonData] of lessons.entries()) {
      const [lesson] = await db
        .insert(schema.lessons)
        .values({
          unitId: unit.id,
          title: lessonData.title,
          order: lessonIndex + 1,
        })
        .returning();

      for (const [qIndex, q] of lessonData.questions.entries()) {
        const answer = WORDS[q.answer];

        const question =
          q.type === "SELECT"
            ? `Mana yang artinya "${answer.meaning}"?`
            : `"${answer.meaning}"`;

        const [challenge] = await db
          .insert(schema.challenges)
          .values({
            lessonId: lesson.id,
            type: q.type,
            question,
            order: qIndex + 1,
          })
          .returning();

        // Posisi jawaban benar digeser-geser supaya tidak selalu di urutan pertama.
        const words = q.others.map((key) => WORDS[key]);
        words.splice(qIndex % 3, 0, answer);

        await db.insert(schema.challengeOptions).values(
          words.map((word) => ({
            challengeId: challenge.id,
            correct: word.text === answer.text,
            text: word.text,
            audioSrc: word.audio,
            // SELECT pakai gambar, ASSIST hanya teks.
            ...(q.type === "SELECT" ? { imageSrc: word.img } : {}),
          })),
        );
      }
    }

    console.log("Database seeded successfully");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};

main();
